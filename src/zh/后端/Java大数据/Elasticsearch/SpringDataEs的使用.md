---
title: Spring Data Es的使用
date: 2024-03-04
tag:
  - 搜索引擎
  - Java	
  - elasticsearch
---

# Spring Data Es的使用

## 实体类

Spring Data系列使用都很简单，Spring Data es也不例外，从下面这个类开始

```java
@Data
@Document(indexName = "book", createIndex = true)
public class Book {
    @Id
    @Field(type = FieldType.Text)
    private String id;
    @Field(analyzer="ik_max_word")
    private String title;
    @Field(analyzer="ik_max_word")
    private String author;
    @Field(type = FieldType.Double)
    private Double price;
    @Field(type = FieldType.Date,format = DateFormat.basic_date_time)
    private Date createTime;
    @Field(type = FieldType.Date,format = DateFormat.basic_date_time)
    private Date updateTime;
}
```

这是一个书本的实体，有点儿类似JPA的数据实体，只不过这儿映射的是Es。同理这儿的注解`@Document ` 与 `@Table` 类似，对应到Es就是索引。`@Id ` 就是索引Id, `@Field` 定义字段类型

> 这儿@Field可以配置选择分词器

## 操作执行

定义了 `entity ` ，接下来定义`Dao` 

```java
public interface ESBookRepository extends ElasticsearchRepository<Book, String> {

    List<Book> findByTitleOrAuthor(String title, String author);

    @Highlight(fields = {
            @HighlightField(name = "title"),
            @HighlightField(name = "author")
    })
    @Query("{\"match\":{\"title\":\"?0\"}}")
    SearchHits<Book> find(String keyword);
}
```

这是个经典的`Repository ` ，这儿集成了es的父级`ElasticsearchRepository ` ，也可以使用`ElasticsearchTemplate `进行模板操作

> ElasticsearchRepository也定义了基础的增删查改

当然可以进行一些高级查询，定义类似QueryDsl的查询方式，下面是一些示例（示例与上述实体无关）：

```java
// 基本查询
TermQueryBuilder termQuery = QueryBuilders.termQuery(name, value);
shopRepository.search(termQuery);// 执行查询
// 另外还有其它基本查询
QueryBuilders.matchQuery(name, text);
QueryBuilders.rangeQuery("").lt(to);

NativeSearchQueryBuilder queryBuilder = new NativeSearchQueryBuilder();
// 多条件查询
queryBuilder.withQuery(QueryBuilders.termQuery("name", "ww"));
queryBuilder.withQuery(QueryBuilders.rangeQuery("").gt(""));
// 设置分页参数
queryBuilder.withPageable(PageRequest.of(0, 10));
// 排序
queryBuilder.withSort(SortBuilders.fieldSort("price").order(SortOrder.DESC));
// 执行查询
shopRepository.search(queryBuilder.build());

// 聚合,类型为terms，聚合名称为names，聚合字段为name
queryBuilder.addAggregation(
AggregationBuilders.terms("names").field("name"));
// 执行查询,需要把结果强转为AggregatedPage类型
AggregatedPage<Shop> aggPage = (AggregatedPage<Shop>) this.shopRepository.search(queryBuilder.build());

// 组合查询
BoolQueryBuilder baseQueryBuild = QueryBuilders.boolQuery();
// 查询 price=12 and (name = ls or name = zs)
BoolQueryBuilder shouldQueryBuild = QueryBuilders.boolQuery();
shouldQueryBuild.should(QueryBuilders.termQuery("name", "ls"));
shouldQueryBuild.should(QueryBuilders.termQuery("name", "zs"));
baseQueryBuild.filter(QueryBuilders.termQuery("price", "12"));
baseQueryBuild.filter(shouldQueryBuild);
// 执行查询
this.shopRepository.search(baseQueryBuild);
```



## 参考

[Spring Boot整合Elasticsearch，最新最全教程_springboot elasticsearch-CSDN博客](https://blog.csdn.net/gybshen/article/details/111469217)

[SpringBoot整合ElasticSearch的两种方式 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/587556026)

