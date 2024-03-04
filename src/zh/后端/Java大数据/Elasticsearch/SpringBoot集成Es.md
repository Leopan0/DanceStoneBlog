---
title: Spring Boot 集成Es
date: 2024-03-04
tag:
  - 搜索引擎
  - Java	
  - elasticsearch
---

# Spring Boot 集成Es

## 依赖

这是引入Maven示例

```xml
<dependency>
    <groupId>org.elasticsearch</groupId>
    <artifactId>elasticsearch</artifactId>
    <version>7.1.0</version>
</dependency>
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.1.0</version>
</dependency>
```

其中第二个依赖是es的访问客户端，es有两种方的 Client：`Java Low Level Client` 和 `Java High Level REST Client`。

低级别客户端，它允许通过 HTTP 请求与 ES 集群进行通信，API 本身不负责数据的编码解码，由用户去编码解码，它与所有的 ES 版本兼容。

高级客户端基于低级客户端，是从 6.0 才开始加入的，主要目标是为了暴露各 API 特定的方法，高版本客户端依赖于 ES 核心项目，将 Request 对象作为参数，返回一个 Response 对象，所有 API 都可以同步或异步调用。

更推荐高级客户端

## 配置

Java配置部分

```java
@Configurable
public class ElasticsearchConfiguration {

    @Autowired
    private EsConfig esConfig;

    /**
     * 配置客户端
     * @return
     */
    @Bean(destroyMethod = "close", name = "client")
    public RestHighLevelClient initRestClient() {
        RestClientBuilder builder = RestClient.builder(new HttpHost(esConfig.getHost(), Integer.parseInt(esConfig.getPort())))
                .setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder
                        .setConnectTimeout(esConfig.getConnTimeout())
                        .setSocketTimeout(esConfig.getSocketTimeout())
                        .setConnectionRequestTimeout(esConfig.getConnectionRequestTimeout()));
        return new RestHighLevelClient(builder);
    }
}
```



配置文件配置

```properties
# ip和端口
elasticsearch.host=localhost
elasticsearch.port=9200
# 连接超时
elasticsearch.connTimeout=3000
elasticsearch.socketTimeout=5000
# 请求超时
elasticsearch.connectionRequestTimeout=500
# username和password如果没有开启安全管理，可以不用配置
```

> 配置文件部分可以考虑做动态配置

## Spring Data 方式接入

Spring Data系列方便我们接入各种SQL 和 NoSQL专注业务代码实现

依赖我们只需要引入这个即可

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

配置也很简单

```properties
spring:
     elasticsearch:
        rest:
          uris: http://192.168.100.101:9200
          username: elasticsearch
          password: elasticsearch
```

就搞定了

## 参考

[Spring Boot 集成 Elasticsearch 实战 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/159138736)

[ElasticSearch 从入门到实战 | 《ElasticSearch入门到实战》电子书 (chaosopen.cn)](https://es.chaosopen.cn/)

[Spring Boot整合Elasticsearch，最新最全教程_springboot elasticsearch-CSDN博客](https://blog.csdn.net/gybshen/article/details/111469217)