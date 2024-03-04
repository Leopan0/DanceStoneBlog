import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as c,c as o,a as n,b as a,d as e,f as i}from"./app-d2bd0ec7.js";const p={},d=i(`<h1 id="部署到docker" tabindex="-1"><a class="header-anchor" href="#部署到docker" aria-hidden="true">#</a> 部署到Docker</h1><p>将Spring Boot 项目部署打包成Docker 镜像文件，可以很方便部署和移植，有两种方式将Java 项目打包成Docker镜像，Dockerfile 和 Docker-Compose。</p><p>Dockerfile适用于定义单个容器的构建过程，通常用于构建和部署单个应用。dockerfile的产物是镜像</p><p>Docker Compose是一个工具，用于定义和管理多个Docker容器的配置。Docker Compose可以一次性启动、停止和管理多个容器，可以通过简单的命令来管理整个应用的生命周期。compose的产物是容器，容器是一个镜像的实例。</p><p>下面详细介绍两种方式的操作</p><h2 id="dockerfile" tabindex="-1"><a class="header-anchor" href="#dockerfile" aria-hidden="true">#</a> Dockerfile</h2><h3 id="操作步骤" tabindex="-1"><a class="header-anchor" href="#操作步骤" aria-hidden="true">#</a> 操作步骤</h3><p>我们需要准备以下工作</p><ul><li>在pom.xml创建一个Dockerfile（用于描述Docker打包成镜像的相关操作）</li><li>将项目文件提交到可以运行docker的环境中，执行命令，生成镜像</li></ul><h3 id="dockerfile语法说明" tabindex="-1"><a class="header-anchor" href="#dockerfile语法说明" aria-hidden="true">#</a> Dockerfile语法说明</h3><p>Dockerfile是一个纯文本文件，通过编写指令配置相应的参数</p><h4 id="from" tabindex="-1"><a class="header-anchor" href="#from" aria-hidden="true">#</a> FROM</h4><p>两种形式如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM &lt;IMAGE&gt;
FROM &lt;IMAGE&gt;:&lt;TAG&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>通过FROM指定的镜像名称必须是一个已经存在的镜像，这个镜像称之为基础镜像，必须位于第一条非注释指令</p></blockquote><h4 id="maintainer" tabindex="-1"><a class="header-anchor" href="#maintainer" aria-hidden="true">#</a> MAINTAINER</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>MAINTAINER &lt;NAME&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>指定镜像的作者信息，包含镜像的所有者和联系人信息</p></blockquote><h4 id="run" tabindex="-1"><a class="header-anchor" href="#run" aria-hidden="true">#</a> RUN</h4><p>用于指定构建镜像时运行的命令，两种模式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>RUN &lt;command&gt; (shell模式)
RUN [ &quot;executable&quot;, &quot;param1&quot;, &quot;param2&quot; ] (exec模式)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>在shell模式下，是使用/bin/sh -c COMMAND来运行命令的 在exec模式下可以指定其他的shell来运行命令RUN [“/bin/bash”, “-c”, “echo hello”]</p></blockquote><p>多条RUN指令可以合并为一条：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>RUN yum install httpd &amp;&amp; yum install ftp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>这样在构建的时候会减少产生中间层镜像</p></blockquote><h4 id="expose" tabindex="-1"><a class="header-anchor" href="#expose" aria-hidden="true">#</a> EXPOSE</h4><p>指定运行该镜像的容器使用的端口，可以是多个。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>EXPOSE &lt;PORT&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用这个指令的目的是告诉应用程序容器内应用程序会使用的端口，在运行时还需要使用-p参数指定映射端口。这是docker处于安全的目的，不会自动打开端口。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run -p 80 -d dockertest/dockerfile_build nginx -g &quot;daemon off&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="cmd" tabindex="-1"><a class="header-anchor" href="#cmd" aria-hidden="true">#</a> CMD</h4><p>用于提供容器运行的默认命令，如果在<code>docker run</code>时指定了运行的命令，则CMD命令不会执行。CMD有三种模式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>CMD &lt;command&gt; (shell模式)
CMD [ &quot;executable&quot;, &quot;param1&quot;, &quot;param2&quot; ] (exec模式)
CMD [ &#39;param1&#39;, &#39;param2&#39;] (通常与ENTRYPOINT搭配指定ENTRYPOINT的默认参数)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="entrypoint" tabindex="-1"><a class="header-anchor" href="#entrypoint" aria-hidden="true">#</a> ENTRYPOINT</h4><p>与CMD类似，ENTRYPOINT不会被<code>docker run</code>中指定的命令覆盖，如果想覆盖ENTRYPOINT，则需要在<code>docker run</code>中指定<code>--entrypoint</code>选项</p><p>它有两种模式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ENTRYPOINT &lt;command&gt; (shell模式)
ENTRYPOINT [ &quot;executable&quot;, &quot;param1&quot;, &quot;param2&quot; ] (exec模式)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="add和copy" tabindex="-1"><a class="header-anchor" href="#add和copy" aria-hidden="true">#</a> ADD和COPY</h4><p>作用都是将文件或目录复制到Dockerfile构建的镜像中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD &lt;src&gt; &lt;dest&gt;
ADD [&quot;&lt;src&gt;&quot; &quot;&lt;dest&gt;&quot;] (适用于文件路径包含空格的情况)

COPY &lt;src&gt; &lt;dest&gt;
ADD [&quot;&lt;src&gt;&quot; &quot;&lt;dest&gt;&quot;] (适用于文件路径包含空格的情况)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>ADD包含了类似tar的解压功能，如果只是单纯复制文件，建议使用COPY，而且，两者的源文件路径使用Dockerfile相对路径，目标路径使用绝对路径。</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>COPY index.html /var/www/html
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="volume" tabindex="-1"><a class="header-anchor" href="#volume" aria-hidden="true">#</a> VOLUME</h4><p>用于向容器添加卷，可以提供共享存储等功能</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>VOLUME [&#39;/data&#39;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="workdir" tabindex="-1"><a class="header-anchor" href="#workdir" aria-hidden="true">#</a> WORKDIR</h4><p>在容器内部设置工作目录，这样ENTRYPOINT和CMD指定的命令都会在容器中这个目录下进行。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>WORKDIR /path/to/workdir
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="env" tabindex="-1"><a class="header-anchor" href="#env" aria-hidden="true">#</a> ENV</h4><p>用于设置环境变量</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ENV &lt;KEY&gt; &lt;VALUE&gt;
ENV &lt;KEY&gt;=&lt;VALUE&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="user" tabindex="-1"><a class="header-anchor" href="#user" aria-hidden="true">#</a> USER</h4><p>用于指定镜像为什么用户去运行</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>USER nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>镜像就会以nginx身份运行，可以使用uid，gid等各种组合使用</p></blockquote><h4 id="onbuild" tabindex="-1"><a class="header-anchor" href="#onbuild" aria-hidden="true">#</a> ONBUILD</h4><p>为镜像创建触发器，当一个镜像被用作其他镜像的基础镜像时，这个触发器会被执行。当子镜像被构建时会插入触发器中的指令。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ONBUILD COPY index.html /var/www/html
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="一个示例" tabindex="-1"><a class="header-anchor" href="#一个示例" aria-hidden="true">#</a> 一个示例</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 该镜像需要依赖的基础镜像
FROM openjdk:8
# 将当前目录下的jar包复制到docker容器的/目录下
ADD ./spring-boot.jar /spring-boot.jar
# 声明服务运行在8080端口
EXPOSE 8080
# 指定docker容器启动时运行jar包
ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;,&quot;/spring-boot.jar&quot;]
# 指定维护者的名字
MAINTAINER demo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dockerfile的构建过程" tabindex="-1"><a class="header-anchor" href="#dockerfile的构建过程" aria-hidden="true">#</a> Dockerfile的构建过程</h3><ol><li>docker会从Dockerfile文件头FROM指定的基础镜像运行一个容器</li><li>然后执行一条指令，对容器修改</li><li>接着执行类似docker commit的操作，创建新的镜像层</li><li>在基于刚创建的镜像运行一个新的容器</li><li>执行Dockerfile下一条指令，直到所有指令执行完毕</li></ol><blockquote><p>docker会删除中间层创建的容器，但不会删除中间层镜像，所以可以使用docker run运行一个中间层容器，从而查看每一步构建后的镜像状态，这样就可以进行调试。</p></blockquote><h4 id="构建缓存" tabindex="-1"><a class="header-anchor" href="#构建缓存" aria-hidden="true">#</a> 构建缓存</h4><p>docker在构建过程中会将之前构建的镜像看做缓存。</p><p>当第一次构建的时候，构建过程会比较慢，而在此进行相同的构建的时候，会看见using cache字样，表示使用了缓存，构建过程也非常快。</p><p>如果不想使用构建缓存，则在docker build中使用—no-cache选项。</p><p>还可以在Dockerfile中使用ENV REFRESH_DATE 2018-01-01来制定缓存刷新时间，更改这个时间，就会让后面的命令不使用缓存。</p><h2 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker-Compose</h2><p>使用Docker-Compose，不仅可以创建项目对应的镜像，还可以生成对应的容器，启动相关中间件，都可以已yml文件形式管理</p><h3 id="操作步骤-1" tabindex="-1"><a class="header-anchor" href="#操作步骤-1" aria-hidden="true">#</a> 操作步骤</h3><p>Docker-Compose首先要配置Dokcerfile，配置项目本身的镜像相关，然后配置docker-compose.yml文件，说明启动哪些线管容器</p><h3 id="语法说明" tabindex="-1"><a class="header-anchor" href="#语法说明" aria-hidden="true">#</a> 语法说明</h3><h4 id="_1-image" tabindex="-1"><a class="header-anchor" href="#_1-image" aria-hidden="true">#</a> 1.image</h4><p>指定为镜像名称或镜像ID。</p><p>如果镜像不存在，Compose将尝试从互联网拉取这个镜像，例如： image: ubuntu image: orchardup/postgresql image: a4bc65fd</p><p>指定服务的镜像名，若本地不存在，则 Compose 会去仓库拉取这个镜像:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">web</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-build" tabindex="-1"><a class="header-anchor" href="#_2-build" aria-hidden="true">#</a> 2.build</h4><p>指定Dockerfile所在文件夹的路径。Compose将会利用他自动构建这个镜像，然后使用这个镜像。 build: ./dir</p><h4 id="_3-command" tabindex="-1"><a class="header-anchor" href="#_3-command" aria-hidden="true">#</a> 3.command</h4><p>覆盖容器启动后默认执行的命令。 command: bundle exec thin -p 3000</p><h4 id="_4-links" tabindex="-1"><a class="header-anchor" href="#_4-links" aria-hidden="true">#</a> 4.links</h4><p>链接到其他服务容器，使用服务名称(同时作为别名)或服务别名（SERVICE:ALIAS）都可以</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">links</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> db
 <span class="token punctuation">-</span> db<span class="token punctuation">:</span>database
 <span class="token punctuation">-</span> redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>注意：使用别名会自动在服务器中的/etc/hosts 里创建，如：172.17.2.186 db，相应的环境变量也会被创建。</p></blockquote><h4 id="_5-external-links" tabindex="-1"><a class="header-anchor" href="#_5-external-links" aria-hidden="true">#</a> 5.external_links</h4><p>链接到docker-compose.yml外部的容器，甚至并非是Compose管理的容器。参数格式和links类似。 external_links:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token punctuation">-</span> redis_1
 <span class="token punctuation">-</span> project_db_1<span class="token punctuation">:</span>mysql
 <span class="token punctuation">-</span> project_db_2<span class="token punctuation">:</span>sqlserver
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_6-ports" tabindex="-1"><a class="header-anchor" href="#_6-ports" aria-hidden="true">#</a> 6.ports</h4><p>暴露端口信息。格式</p><p>宿主机器端口：容器端口（HOST:CONTAINER）</p><p>或者仅仅指定容器的端口（宿主机器将会随机分配端口）都可以。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">ports</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token string">&quot;3306&quot;</span>
 <span class="token punctuation">-</span> <span class="token string">&quot;8080:80&quot;</span>
 <span class="token punctuation">-</span> <span class="token string">&quot;127.0.0.1:8090:8001&quot;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>注意：当使用 HOST:CONTAINER 格式来映射端口时，如果你使用的容器端口小于 60 你可能会得到错误得结果，因为 YAML 将会解析 xx:yy 这种数字格式为 60 进制。所以建议采用字符串格式。</p></blockquote><h4 id="_7-expose" tabindex="-1"><a class="header-anchor" href="#_7-expose" aria-hidden="true">#</a> 7.expose</h4><p>暴露端口，与posts不同的是expose只可以暴露端口而不能映射到主机，只供外部服务连接使用；仅可以指定内部端口为参数。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">expose</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token string">&quot;3000&quot;</span>
 <span class="token punctuation">-</span> <span class="token string">&quot;8000&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_8-volumes" tabindex="-1"><a class="header-anchor" href="#_8-volumes" aria-hidden="true">#</a> 8.volumes</h4><p>设置卷挂载的路径。</p><p>可以设置宿主机路径:容器路径（host:container）或加上访问模式（host:container:ro）ro就是readonly的意思，只读模式。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">volumes</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> /var/lib/mysql<span class="token punctuation">:</span>/var/lib/mysql
 <span class="token punctuation">-</span> /configs/mysql<span class="token punctuation">:</span>/etc/configs/<span class="token punctuation">:</span>ro
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_9-volunes-from" tabindex="-1"><a class="header-anchor" href="#_9-volunes-from" aria-hidden="true">#</a> 9.volunes_from</h4><p>挂载另一个服务或容器的所有数据卷。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">volumes_from</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> service_name
 <span class="token punctuation">-</span> container_name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_10-environment" tabindex="-1"><a class="header-anchor" href="#_10-environment" aria-hidden="true">#</a> 10.environment</h4><p>设置环境变量。可以属于数组或字典两种格式。</p><p>如果只给定变量的名称则会自动加载它在Compose主机上的值，可以用来防止泄露不必要的数据。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">environment</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> RACK_ENV=development
 <span class="token punctuation">-</span> SESSION_SECRET
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_11-env-file" tabindex="-1"><a class="header-anchor" href="#_11-env-file" aria-hidden="true">#</a> 11.env_file</h4><p>从文件中获取环境变量，可以为单独的文件路径或列表。 如果通过docker-compose -f FILE指定了模板文件，则env_file中路径会基于模板文件路径。 如果有变量名称与environment指令冲突，则以后者为准。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">env_file</span><span class="token punctuation">:</span> .env
<span class="token key atrule">env_file</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> ./common.env
 <span class="token punctuation">-</span> ./apps/web.env
 <span class="token punctuation">-</span> /opt/secrets.env

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_12-extends" tabindex="-1"><a class="header-anchor" href="#_12-extends" aria-hidden="true">#</a> 12.extends</h4><p>基于已有的服务进行服务扩展。例如我们已经有了一个webapp服务，模板文件为common.yml.</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># common.yml</span>
<span class="token key atrule">webapp</span><span class="token punctuation">:</span>
<span class="token key atrule">build</span><span class="token punctuation">:</span> ./webapp
<span class="token key atrule">environment</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> DEBUG=false
 <span class="token punctuation">-</span> SEND_EMAILS=false

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编写一个新的 development.yml 文件，使用 common.yml 中的 webapp 服务进行扩展。 development.yml</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">web</span><span class="token punctuation">:</span>
<span class="token key atrule">extends</span><span class="token punctuation">:</span>
<span class="token key atrule">file</span><span class="token punctuation">:</span> common.yml
<span class="token key atrule">service</span><span class="token punctuation">:</span> 
  <span class="token key atrule">webapp</span><span class="token punctuation">:</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;8080:80&quot;</span>
    <span class="token key atrule">links</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> db
    <span class="token key atrule">envelopment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> DEBUG=true
   <span class="token key atrule">db</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,117),r={id:"_13-net",tabindex:"-1"},u=n("a",{class:"header-anchor",href:"#_13-net","aria-hidden":"true"},"#",-1),m={href:"http://13.net",target:"_blank",rel:"noopener noreferrer"},v=i(`<p>设置网络模式。使用和docker client 的 --net 参数一样的值。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 容器默认连接的网络，是所有Docker安装时都默认安装的docker0网络.</span>
<span class="token key atrule">net</span><span class="token punctuation">:</span> <span class="token string">&quot;bridge&quot;</span>
<span class="token comment"># 容器定制的网络栈.</span>
<span class="token key atrule">net</span><span class="token punctuation">:</span> <span class="token string">&quot;none&quot;</span>
<span class="token comment"># 使用另一个容器的网络配置</span>
<span class="token key atrule">net</span><span class="token punctuation">:</span> <span class="token string">&quot;container:[name or id]&quot;</span>
<span class="token comment"># 在宿主网络栈上添加一个容器，容器中的网络配置会与宿主的一样</span>
<span class="token key atrule">net</span><span class="token punctuation">:</span> <span class="token string">&quot;host&quot;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker会为每个节点自动创建三个网络： 网络名称 作用 bridge 容器默认连接的网络，是所有Docker安装时都默认安装的docker0网络 none 容器定制的网络栈 host 在宿主网络栈上添加一个容器，容器中的网络配置会与宿主的一样 附录： 操作名称 命令 创建网络 docker network create -d bridge mynet 查看网络列表 docker network ls</p><h4 id="_14-pid" tabindex="-1"><a class="header-anchor" href="#_14-pid" aria-hidden="true">#</a> 14.pid</h4><p>和宿主机系统共享进程命名空间，打开该选项的容器可以相互通过进程id来访问和操作。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">pid</span><span class="token punctuation">:</span> <span class="token string">&quot;host&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_15-dns" tabindex="-1"><a class="header-anchor" href="#_15-dns" aria-hidden="true">#</a> 15.dns</h4><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>配置DNS服务器。可以是一个值，也可以是一个列表。
<span class="token key atrule">dns</span><span class="token punctuation">:</span> 8.8.8.8
<span class="token key atrule">dns</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> 8.8.8.8
 <span class="token punctuation">-</span> 9.9.9.9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_16-cap-add-cap-drop" tabindex="-1"><a class="header-anchor" href="#_16-cap-add-cap-drop" aria-hidden="true">#</a> 16.cap_add，cap_drop</h4><p>添加或放弃容器的Linux能力（Capability）。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">cap_add</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> ALL
<span class="token key atrule">cap_drop</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> NET_ADMIN
 <span class="token punctuation">-</span> SYS_ADMIN
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_17-dns-search" tabindex="-1"><a class="header-anchor" href="#_17-dns-search" aria-hidden="true">#</a> 17.dns_search</h4><p>配置DNS搜索域。可以是一个值也可以是一个列表。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">dns_search</span><span class="token punctuation">:</span> example.com
<span class="token key atrule">dns_search</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> domain1.example.com
 \\ <span class="token punctuation">-</span> domain2.example.com
working_dir<span class="token punctuation">,</span> entrypoint<span class="token punctuation">,</span> user<span class="token punctuation">,</span> hostname<span class="token punctuation">,</span> domainname<span class="token punctuation">,</span> mem_limit<span class="token punctuation">,</span> privileged<span class="token punctuation">,</span> restart<span class="token punctuation">,</span> stdin_open<span class="token punctuation">,</span> tty<span class="token punctuation">,</span> cpu_shares
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这些都是和 docker run 支持的选项类似。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">cpu_shares</span><span class="token punctuation">:</span> <span class="token number">73</span>
<span class="token key atrule">working_dir</span><span class="token punctuation">:</span> /code
<span class="token key atrule">entrypoint</span><span class="token punctuation">:</span> /code/entrypoint.sh
<span class="token key atrule">user</span><span class="token punctuation">:</span> postgresql
<span class="token key atrule">hostname</span><span class="token punctuation">:</span> foo
<span class="token key atrule">domainname</span><span class="token punctuation">:</span> foo.com
<span class="token key atrule">mem_limit</span><span class="token punctuation">:</span> <span class="token number">1000000000</span>
<span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">restart</span><span class="token punctuation">:</span> always
<span class="token key atrule">stdin_open</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">tty</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_18-healthcheck" tabindex="-1"><a class="header-anchor" href="#_18-healthcheck" aria-hidden="true">#</a> 18.healthcheck</h4><p>健康检查，这个非常有必要，等服务准备好以后再上线，避免更新过程中出现短暂的无法访问。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">healthcheck</span><span class="token punctuation">:</span>
  <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;CMD&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;curl&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-f&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;http://localhost/alive&quot;</span><span class="token punctuation">]</span>
  <span class="token key atrule">interval</span><span class="token punctuation">:</span> 5s
  <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 3s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实大多数情况下健康检查的规则都会写在 Dockerfile 中:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>FROM nginx
RUN apt<span class="token punctuation">-</span>get update <span class="token important">&amp;&amp;</span> apt<span class="token punctuation">-</span>get install <span class="token punctuation">-</span>y curl <span class="token important">&amp;&amp;</span> rm <span class="token punctuation">-</span>rf /var/lib/apt/lists/*
HEALTHCHECK <span class="token punctuation">-</span><span class="token punctuation">-</span>interval=5s <span class="token punctuation">-</span><span class="token punctuation">-</span>timeout=3s CMD curl <span class="token punctuation">-</span>f http<span class="token punctuation">:</span>//localhost/alive <span class="token punctuation">|</span><span class="token punctuation">|</span> exit 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_19-depends-on" tabindex="-1"><a class="header-anchor" href="#_19-depends-on" aria-hidden="true">#</a> 19.depends_on</h4><p>依赖的服务，优先启动，例：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_20-deploy" tabindex="-1"><a class="header-anchor" href="#_20-deploy" aria-hidden="true">#</a> 20.deploy</h4><p>部署相关的配置都在这个节点下，例：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">deploy</span><span class="token punctuation">:</span>
  <span class="token key atrule">mode</span><span class="token punctuation">:</span> replicated
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">restart_policy</span><span class="token punctuation">:</span>
    <span class="token key atrule">condition</span><span class="token punctuation">:</span> on<span class="token punctuation">-</span>failure
    <span class="token key atrule">max_attempts</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">update_config</span><span class="token punctuation">:</span>
    <span class="token key atrule">delay</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">order</span><span class="token punctuation">:</span> start<span class="token punctuation">-</span>first <span class="token comment"># 默认为 stop-first，推荐设置先启动新服务再终止旧的</span>
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
    <span class="token key atrule">limits</span><span class="token punctuation">:</span>
      <span class="token key atrule">cpus</span><span class="token punctuation">:</span> <span class="token string">&quot;0.50&quot;</span>
      <span class="token key atrule">memory</span><span class="token punctuation">:</span> 1g
<span class="token key atrule">deploy</span><span class="token punctuation">:</span>
  <span class="token key atrule">mode</span><span class="token punctuation">:</span> global <span class="token comment"># 不推荐全局模式（仅个人意见）。</span>
  <span class="token key atrule">placement</span><span class="token punctuation">:</span>
    <span class="token key atrule">constraints</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>node.role == manager<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="一个yaml配置示例" tabindex="-1"><a class="header-anchor" href="#一个yaml配置示例" aria-hidden="true">#</a> 一个YAML配置示例</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3&quot;</span>

<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token comment"># 定义 Spring Boot 应用程序所需要的服务（容器）</span>
  <span class="token key atrule">myproject</span><span class="token punctuation">:</span>
    <span class="token comment"># 构建镜像的路径。&quot;.&quot; 表示 Dockerfile 文件所在的当前目录</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span> .
    <span class="token comment"># 指定容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> myproject
    <span class="token comment"># 容器所要使用的端口号</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;8080:8080&quot;</span>
    <span class="token comment"># 指定容器启动后所需要等待的其它服务的启动时间</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> database
      <span class="token punctuation">-</span> redis
    <span class="token comment"># 环境变量设置</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> SPRING_PROFILES_ACTIVE=prod
      <span class="token punctuation">-</span> SPRING_DATASOURCE_URL=jdbc<span class="token punctuation">:</span>mysql<span class="token punctuation">:</span>//database<span class="token punctuation">:</span>3306/mydb<span class="token punctuation">?</span>useSSL=false
      <span class="token punctuation">-</span> SPRING_DATASOURCE_USERNAME=root
      <span class="token punctuation">-</span> SPRING_DATASOURCE_PASSWORD=123456
      <span class="token punctuation">-</span> SPRING_REDIS_HOST=redis

  <span class="token comment"># 定义数据库服务（容器）</span>
  <span class="token key atrule">database</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">5.7</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> database
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;3306:3306&quot;</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=123456
      <span class="token punctuation">-</span> MYSQL_DATABASE=mydb

  <span class="token comment"># 定义 Redis 服务（容器）</span>
  <span class="token key atrule">redis</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>alpine
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> redis
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;6379:6379&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="docker-compose常用命令" tabindex="-1"><a class="header-anchor" href="#docker-compose常用命令" aria-hidden="true">#</a> Docker-compose常用命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> 命令 <span class="token parameter variable">--help</span>                     获得一个命令的帮助
<span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span> nginx                     构建启动nignx容器
<span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> nginx <span class="token function">bash</span>                 登录到nginx容器中
<span class="token function">docker-compose</span> down                            此命令将会停止 up 命令所启动的容器，并移除网络
<span class="token function">docker-compose</span> <span class="token function">ps</span>                              列出项目中目前的所有容器
<span class="token function">docker-compose</span> restart nginx                   重新启动nginx容器
<span class="token function">docker-compose</span> build nginx                     构建镜像 
<span class="token function">docker-compose</span> build --no-cache nginx          不带缓存的构建
<span class="token function">docker-compose</span> <span class="token function">top</span>                             查看各个服务容器内运行的进程 
<span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> nginx                   查看nginx的实时日志
<span class="token function">docker-compose</span> images                          列出 Compose 文件包含的镜像
<span class="token function">docker-compose</span> config                          验证文件配置，当配置正确时，不输出任何内容，当文件配置错误，输出错误信息。 
<span class="token function">docker-compose</span> events <span class="token parameter variable">--json</span> nginx             以json的形式输出nginx的docker日志
<span class="token function">docker-compose</span> pause nginx                     暂停nignx容器
<span class="token function">docker-compose</span> unpause nginx                   恢复ningx容器
<span class="token function">docker-compose</span> <span class="token function">rm</span> nginx                        删除容器（删除前必须关闭容器，执行stop）
<span class="token function">docker-compose</span> stop nginx                      停止nignx容器
<span class="token function">docker-compose</span> start nginx                     启动nignx容器
<span class="token function">docker-compose</span> restart nginx                   重启项目中的nignx容器
<span class="token function">docker-compose</span> run --no-deps <span class="token parameter variable">--rm</span> php-fpm php <span class="token parameter variable">-v</span>   在php-fpm中不启动关联容器，并容器执行php <span class="token parameter variable">-v</span> 执行完成后删除容器
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>`,32),k={href:"https://zhuanlan.zhihu.com/p/620620565",target:"_blank",rel:"noopener noreferrer"},b={href:"https://zhuanlan.zhihu.com/p/79142391",target:"_blank",rel:"noopener noreferrer"},h={href:"https://blog.csdn.net/crazymakercircle/article/details/121134684",target:"_blank",rel:"noopener noreferrer"};function g(x,y){const s=l("ExternalLinkIcon");return c(),o("div",null,[d,n("h4",r,[u,a(),n("a",m,[a("13.net"),e(s)])]),v,n("p",null,[n("a",k,[a("Docker Compose 部署 Spring Boot 项目 - 知乎 (zhihu.com)"),e(s)])]),n("p",null,[n("a",b,[a("Dockerfile 详解，看这一篇就够了 - 知乎 (zhihu.com)"),e(s)])]),n("p",null,[n("a",h,[a("Docker-Compose入门到精通 （图解+秒懂+史上最全）_docker-compose图-CSDN博客"),e(s)])])])}const q=t(p,[["render",g],["__file","部署到Docker.html.vue"]]);export{q as default};
