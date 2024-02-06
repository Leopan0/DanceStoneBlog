---
title: 部署到Docker
isOriginal: false
date: 2024-02-06
category: Docker
tag:
  - Java
  - Docker
---

# 部署到Docker

将Spring Boot 项目部署打包成Docker 镜像文件，可以很方便部署和移植，有两种方式将Java 项目打包成Docker镜像，Dockerfile 和 Docker-Compose。

Dockerfile适用于定义单个容器的构建过程，通常用于构建和部署单个应用。dockerfile的产物是镜像

Docker Compose是一个工具，用于定义和管理多个Docker容器的配置。Docker Compose可以一次性启动、停止和管理多个容器，可以通过简单的命令来管理整个应用的生命周期。compose的产物是容器，容器是一个镜像的实例。

下面详细介绍两种方式的操作

## Dockerfile

### 操作步骤

我们需要准备以下工作

- 在pom.xml创建一个Dockerfile（用于描述Docker打包成镜像的相关操作）
- 将项目文件提交到可以运行docker的环境中，执行命令，生成镜像

### Dockerfile语法说明

Dockerfile是一个纯文本文件，通过编写指令配置相应的参数

#### FROM

两种形式如下：

```text
FROM <IMAGE>
FROM <IMAGE>:<TAG>
```

> 通过FROM指定的镜像名称必须是一个已经存在的镜像，这个镜像称之为基础镜像，必须位于第一条非注释指令

#### MAINTAINER

```text
MAINTAINER <NAME>
```

> 指定镜像的作者信息，包含镜像的所有者和联系人信息

#### RUN

用于指定构建镜像时运行的命令，两种模式：

```text
RUN <command> (shell模式)
RUN [ "executable", "param1", "param2" ] (exec模式)
```

> 在shell模式下，是使用/bin/sh -c COMMAND来运行命令的
> 在exec模式下可以指定其他的shell来运行命令RUN [“/bin/bash”, “-c”, “echo hello”]

多条RUN指令可以合并为一条：

```text
RUN yum install httpd && yum install ftp
```

> 这样在构建的时候会减少产生中间层镜像

####  EXPOSE

指定运行该镜像的容器使用的端口，可以是多个。

```text
EXPOSE <PORT>
```

使用这个指令的目的是告诉应用程序容器内应用程序会使用的端口，在运行时还需要使用-p参数指定映射端口。这是docker处于安全的目的，不会自动打开端口。

```text
docker run -p 80 -d dockertest/dockerfile_build nginx -g "daemon off"
```

#### CMD

用于提供容器运行的默认命令，如果在`docker run`时指定了运行的命令，则CMD命令不会执行。CMD有三种模式：

```text
CMD <command> (shell模式)
CMD [ "executable", "param1", "param2" ] (exec模式)
CMD [ 'param1', 'param2'] (通常与ENTRYPOINT搭配指定ENTRYPOINT的默认参数)
```

#### ENTRYPOINT

与CMD类似，ENTRYPOINT不会被`docker run`中指定的命令覆盖，如果想覆盖ENTRYPOINT，则需要在`docker run`中指定`--entrypoint`选项

它有两种模式：

```text
ENTRYPOINT <command> (shell模式)
ENTRYPOINT [ "executable", "param1", "param2" ] (exec模式)
```

#### ADD和COPY

作用都是将文件或目录复制到Dockerfile构建的镜像中

```text
ADD <src> <dest>
ADD ["<src>" "<dest>"] (适用于文件路径包含空格的情况)

COPY <src> <dest>
ADD ["<src>" "<dest>"] (适用于文件路径包含空格的情况)
```

> ADD包含了类似tar的解压功能，如果只是单纯复制文件，建议使用COPY，而且，两者的源文件路径使用Dockerfile相对路径，目标路径使用绝对路径。

```text
COPY index.html /var/www/html
```

#### VOLUME

用于向容器添加卷，可以提供共享存储等功能

```text
VOLUME ['/data']
```

#### WORKDIR

在容器内部设置工作目录，这样ENTRYPOINT和CMD指定的命令都会在容器中这个目录下进行。

```text
WORKDIR /path/to/workdir
```

#### ENV

用于设置环境变量

```text
ENV <KEY> <VALUE>
ENV <KEY>=<VALUE>
```

#### USER

用于指定镜像为什么用户去运行

```text
USER nginx
```

> 镜像就会以nginx身份运行，可以使用uid，gid等各种组合使用

#### ONBUILD

为镜像创建触发器，当一个镜像被用作其他镜像的基础镜像时，这个触发器会被执行。当子镜像被构建时会插入触发器中的指令。

```text
ONBUILD COPY index.html /var/www/html
```

### 一个示例

```text
# 该镜像需要依赖的基础镜像
FROM openjdk:8
# 将当前目录下的jar包复制到docker容器的/目录下
ADD ./spring-boot.jar /spring-boot.jar
# 声明服务运行在8080端口
EXPOSE 8080
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java", "-jar","/spring-boot.jar"]
# 指定维护者的名字
MAINTAINER demo
```



### Dockerfile的构建过程

1. docker会从Dockerfile文件头FROM指定的基础镜像运行一个容器
2. 然后执行一条指令，对容器修改
3. 接着执行类似docker commit的操作，创建新的镜像层
4. 在基于刚创建的镜像运行一个新的容器
5. 执行Dockerfile下一条指令，直到所有指令执行完毕

> docker会删除中间层创建的容器，但不会删除中间层镜像，所以可以使用docker run运行一个中间层容器，从而查看每一步构建后的镜像状态，这样就可以进行调试。

#### 构建缓存

docker在构建过程中会将之前构建的镜像看做缓存。

当第一次构建的时候，构建过程会比较慢，而在此进行相同的构建的时候，会看见using cache字样，表示使用了缓存，构建过程也非常快。

如果不想使用构建缓存，则在docker build中使用—no-cache选项。

还可以在Dockerfile中使用ENV REFRESH_DATE 2018-01-01来制定缓存刷新时间，更改这个时间，就会让后面的命令不使用缓存。

## Docker-Compose

使用Docker-Compose，不仅可以创建项目对应的镜像，还可以生成对应的容器，启动相关中间件，都可以已yml文件形式管理

### 操作步骤

Docker-Compose首先要配置Dokcerfile，配置项目本身的镜像相关，然后配置docker-compose.yml文件，说明启动哪些线管容器



### 语法说明

#### 1.image
指定为镜像名称或镜像ID。

如果镜像不存在，Compose将尝试从互联网拉取这个镜像，例如： image: ubuntu image: orchardup/postgresql image: a4bc65fd

指定服务的镜像名，若本地不存在，则 Compose 会去仓库拉取这个镜像:

```yaml
services:
  web:
    image: nginx
```

#### 2.build

指定Dockerfile所在文件夹的路径。Compose将会利用他自动构建这个镜像，然后使用这个镜像。 build: ./dir

#### 3.command
覆盖容器启动后默认执行的命令。 command: bundle exec thin -p 3000

#### 4.links
链接到其他服务容器，使用服务名称(同时作为别名)或服务别名（SERVICE:ALIAS）都可以

```yaml
links:
 - db
 - db:database
 - redis
```

> 注意：使用别名会自动在服务器中的/etc/hosts 里创建，如：172.17.2.186 db，相应的环境变量也会被创建。

#### 5.external_links

链接到docker-compose.yml外部的容器，甚至并非是Compose管理的容器。参数格式和links类似。 external_links:

```yaml
- redis_1
 - project_db_1:mysql
 - project_db_2:sqlserver
```

#### 6.ports
暴露端口信息。格式

宿主机器端口：容器端口（HOST:CONTAINER）

或者仅仅指定容器的端口（宿主机器将会随机分配端口）都可以。

```yaml
ports:
 - "3306"
 - "8080:80"
 - "127.0.0.1:8090:8001"

```

>  注意：当使用 HOST:CONTAINER 格式来映射端口时，如果你使用的容器端口小于 60 你可能会得到错误得结果，因为 YAML 将会解析 xx:yy 这种数字格式为 60 进制。所以建议采用字符串格式。

#### 7.expose
暴露端口，与posts不同的是expose只可以暴露端口而不能映射到主机，只供外部服务连接使用；仅可以指定内部端口为参数。

```yaml
expose:
 - "3000"
 - "8000"
```

#### 8.volumes

设置卷挂载的路径。

可以设置宿主机路径:容器路径（host:container）或加上访问模式（host:container:ro）ro就是readonly的意思，只读模式。

```yaml
volumes:
 - /var/lib/mysql:/var/lib/mysql
 - /configs/mysql:/etc/configs/:ro
```

#### 9.volunes_from

挂载另一个服务或容器的所有数据卷。

```yaml
volumes_from:
 - service_name
 - container_name
```

#### 10.environment

设置环境变量。可以属于数组或字典两种格式。

如果只给定变量的名称则会自动加载它在Compose主机上的值，可以用来防止泄露不必要的数据。

```yaml
environment:
 - RACK_ENV=development
 - SESSION_SECRET
```

#### 11.env_file

从文件中获取环境变量，可以为单独的文件路径或列表。 如果通过docker-compose -f FILE指定了模板文件，则env_file中路径会基于模板文件路径。 如果有变量名称与environment指令冲突，则以后者为准。

```yaml
env_file: .env
env_file:
 - ./common.env
 - ./apps/web.env
 - /opt/secrets.env

```

#### 12.extends

基于已有的服务进行服务扩展。例如我们已经有了一个webapp服务，模板文件为common.yml.

```yaml
# common.yml
webapp:
build: ./webapp
environment:
 - DEBUG=false
 - SEND_EMAILS=false

```

编写一个新的 development.yml 文件，使用 common.yml 中的 webapp 服务进行扩展。 development.yml

```yaml
web:
extends:
file: common.yml
service: 
  webapp:
    ports:
      - "8080:80"
    links:
      - db
    envelopment:
      - DEBUG=true
   db:
    image: mysql:5.7
```

#### 13.net

设置网络模式。使用和docker client 的 --net 参数一样的值。

```yaml
# 容器默认连接的网络，是所有Docker安装时都默认安装的docker0网络.
net: "bridge"
# 容器定制的网络栈.
net: "none"
# 使用另一个容器的网络配置
net: "container:[name or id]"
# 在宿主网络栈上添加一个容器，容器中的网络配置会与宿主的一样
net: "host"

```

Docker会为每个节点自动创建三个网络： 网络名称 作用 bridge 容器默认连接的网络，是所有Docker安装时都默认安装的docker0网络 none 容器定制的网络栈 host 在宿主网络栈上添加一个容器，容器中的网络配置会与宿主的一样 附录： 操作名称 命令 创建网络 docker network create -d bridge mynet 查看网络列表 docker network ls

#### 14.pid

和宿主机系统共享进程命名空间，打开该选项的容器可以相互通过进程id来访问和操作。

```yaml
pid: "host"
```

#### 15.dns

```yaml
配置DNS服务器。可以是一个值，也可以是一个列表。
dns: 8.8.8.8
dns:
 - 8.8.8.8
 - 9.9.9.9
```

#### 16.cap_add，cap_drop

添加或放弃容器的Linux能力（Capability）。

```yaml
cap_add:
 - ALL
cap_drop:
 - NET_ADMIN
 - SYS_ADMIN
```

#### 17.dns_search

配置DNS搜索域。可以是一个值也可以是一个列表。

```yaml
dns_search: example.com
dns_search:
 - domain1.example.com
 \ - domain2.example.com
working_dir, entrypoint, user, hostname, domainname, mem_limit, privileged, restart, stdin_open, tty, cpu_shares
```

这些都是和 docker run 支持的选项类似。

```yaml
cpu_shares: 73
working_dir: /code
entrypoint: /code/entrypoint.sh
user: postgresql
hostname: foo
domainname: foo.com
mem_limit: 1000000000
privileged: true
restart: always
stdin_open: true
tty: true
```

#### 18.healthcheck

健康检查，这个非常有必要，等服务准备好以后再上线，避免更新过程中出现短暂的无法访问。

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/alive"]
  interval: 5s
  timeout: 3s
```

其实大多数情况下健康检查的规则都会写在 Dockerfile 中:

```yaml
FROM nginx
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
HEALTHCHECK --interval=5s --timeout=3s CMD curl -f http://localhost/alive || exit 1
```

#### 19.depends_on

依赖的服务，优先启动，例：

```yaml
depends_on:
  - redis
```

#### 20.deploy

部署相关的配置都在这个节点下，例：

```yaml
deploy:
  mode: replicated
  replicas: 2
  restart_policy:
    condition: on-failure
    max_attempts: 3
  update_config:
    delay: 5s
    order: start-first # 默认为 stop-first，推荐设置先启动新服务再终止旧的
  resources:
    limits:
      cpus: "0.50"
      memory: 1g
deploy:
  mode: global # 不推荐全局模式（仅个人意见）。
  placement:
    constraints: [node.role == manager]
```



### 一个YAML配置示例

```yaml
version: "3"

services:
  # 定义 Spring Boot 应用程序所需要的服务（容器）
  myproject:
    # 构建镜像的路径。"." 表示 Dockerfile 文件所在的当前目录
    build: .
    # 指定容器名称
    container_name: myproject
    # 容器所要使用的端口号
    ports:
      - "8080:8080"
    # 指定容器启动后所需要等待的其它服务的启动时间
    depends_on:
      - database
      - redis
    # 环境变量设置
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/mydb?useSSL=false
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=123456
      - SPRING_REDIS_HOST=redis

  # 定义数据库服务（容器）
  database:
    image: mysql:5.7
    container_name: database
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=mydb

  # 定义 Redis 服务（容器）
  redis:
    image: redis:alpine
    container_name: redis
    ports:
      - "6379:6379"
```



### Docker-compose常用命令

```shell
docker-compose 命令 --help                     获得一个命令的帮助
docker-compose up -d nginx                     构建启动nignx容器
docker-compose exec nginx bash                 登录到nginx容器中
docker-compose down                            此命令将会停止 up 命令所启动的容器，并移除网络
docker-compose ps                              列出项目中目前的所有容器
docker-compose restart nginx                   重新启动nginx容器
docker-compose build nginx                     构建镜像 
docker-compose build --no-cache nginx          不带缓存的构建
docker-compose top                             查看各个服务容器内运行的进程 
docker-compose logs -f nginx                   查看nginx的实时日志
docker-compose images                          列出 Compose 文件包含的镜像
docker-compose config                          验证文件配置，当配置正确时，不输出任何内容，当文件配置错误，输出错误信息。 
docker-compose events --json nginx             以json的形式输出nginx的docker日志
docker-compose pause nginx                     暂停nignx容器
docker-compose unpause nginx                   恢复ningx容器
docker-compose rm nginx                        删除容器（删除前必须关闭容器，执行stop）
docker-compose stop nginx                      停止nignx容器
docker-compose start nginx                     启动nignx容器
docker-compose restart nginx                   重启项目中的nignx容器
docker-compose run --no-deps --rm php-fpm php -v   在php-fpm中不启动关联容器，并容器执行php -v 执行完成后删除容器
```



## 参考

[Docker Compose 部署 Spring Boot 项目 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/620620565)

[Dockerfile 详解，看这一篇就够了 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/79142391)

[Docker-Compose入门到精通 （图解+秒懂+史上最全）_docker-compose图-CSDN博客](https://blog.csdn.net/crazymakercircle/article/details/121134684)

