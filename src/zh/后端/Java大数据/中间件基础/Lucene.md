---
title: Lucene
date: 2024-02-23
tag:
  - es
  - 搜索引擎
  - Java
  - solr
---

# Lucene

Lucene是Apache基金会jakarta项目组的一个子项目；

Lucene是一个开放源码的全文检索引擎工具包，**提供了完整的查询引擎和索引引擎，部分语种文本分析引擎**；

Lucene 在开源的搜索引擎里一直处于垄断地位，它的实现语言是 Java 语言。

现在常用的ElasticSearch、Solr等全文搜索引擎均是基于Lucene实现的。但Lucene是单机的模式

## Lucene基础工作流程

索引的生成分为两个部分：

1）创建阶段：

- 添加文档阶段，通过IndexWriter调用addDocument方法生成正向索引文件；
- 文档添加后，**通过flush或merge操作生成倒排索引文件**。

2） 搜索阶段：

- 用户通过查询语句向Lucene发送查询请求；
- 通过IndexSearch下的IndexReader读取索引库内容，获取文档索引；
- 得到搜索结果后，基于搜索算法对结果进行排序后返回。

## Lucene索引构成

### 正向索引

Lucene的基础层次结构由**索引、段、文档、域、词**五个部分组成。正向索引的生成即为基于Lucene的基础层次结构一级一级处理文档并分解域存储词的过程。

索引文件层级关系如图1所示：

- **索引**：Lucene索引库包含了搜索文本的所有内容，可以通过文件或文件流的方式存储在不同的数据库或文件目录下。
- **段**：一个索引中包含多个段，段与段之间相互独立。由于Lucene进行关键词检索时需要加载索引段进行下一步搜索，如果索引段较多会增加较大的I/O开销，减慢检索速度，因此写入时会通过段合并策略对不同的段进行合并。
- **文档**：Lucene会将文档写入段中，一个段中包含多个文档。
- **域**：一篇文档会包含多种不同的字段，不同的字段保存在不同的域中。
- **词**：Lucene会通过分词器将域中的字符串通过词法分析和语言处理后拆分成词，Lucene通过这些关键词进行全文检索。

### 倒排索引

Lucene全文索引的核心是基于**倒排索引实现的快速索引机制**。

倒排索引原理如图2所示，倒排索引简单来说就是基于分析器将文本内容进行分词后，记录每个词出现在哪篇文章中，从而通过用户输入的搜索词查询出包含该词的文章。

![img](https://pic1.zhimg.com/80/v2-318fea3b1397b9c6a9e270774d4bb1c8_720w.webp)

根据图2，我们可以看出当我们模糊查询，相关性匹配（搜索）时，正排索引需要仔细比对值，而倒排效率则更高，不用过滤无关词段

倒排正是将这些文本记录拆分成词组，来关联索引

> **问题：**上述倒排索引使用时每次都需要将索引词加载到内存中，当文章数量较多，篇幅较长时，索引词可能会占用大量的存储空间，加载到内存后内存损耗较大。
>
> 从Lucene4开始，Lucene采用了FST来减少索引词带来的空间消耗。
>
> FST(Finite StateTransducers)，中文名有限状态机转换器。其主要特点在于以下四点：
>
> - 查找词的时间复杂度为O(len(str))；
> - 通过将前缀和后缀分开存储的方式，减少了存放词所需的空间；
> - 加载时仅将前缀放入内存索引，后缀词在磁盘中进行存放，减少了内存索引使用空间的损耗；
> - FST结构在对PrefixQuery、FuzzyQuery、RegexpQuery等查询条件查询时，查询效率高。

## 一个Demo

基于Lucene的引擎有很多，很多很简单好用、甚至支持了分布式，各种分词插件，但这儿还是简单演示一下基础的代码操作

```java
	public static void main(String[] args) throws IOException, ParseException {
        // 创建分析和索引文档目录
        StandardAnalyzer analyzer = new StandardAnalyzer();
        Path path = Paths.get("E:/lucene-demo-index", new String[0]);
        Directory index = FSDirectory.open(path);

        //增
        // 1.创建索引，初始化一个writer
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        config.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
        IndexWriter writer = new IndexWriter(index, config);
        // 2 写入索引
        addDoc(writer, "Lucene in Action", "193398817");
        addDoc(writer, "Lucene for Dummies", "55320055Z");
        addDoc(writer, "Managing Gigabytes", "55063554A");
        addDoc(writer, "The Art of Computer Science", "9900333X");
        writer.close();

        // 查
        // 1.构造1个查询
        String queryStr = "lucene";
        Query q = new QueryParser("title", analyzer).parse(queryStr);
        System.out.println("query: " + q.toString());

        int hitsPerPage = 10;
        // 2 创建索引查询
        IndexReader reader = DirectoryReader.open(index);
        IndexSearcher searcher = new IndexSearcher(reader);
        // 3 执行查询
        TopDocs docs = searcher.search(q, hitsPerPage);
        ScoreDoc[] hits = docs.scoreDocs;

        //结果展示
        System.out.println("found " + hits.length + " results");
        for(ScoreDoc hit : hits) {
            int docId = hit.doc;
            Document doc = searcher.doc(docId);
            System.out.println(doc.get("title") + " - " + doc.get("isbn"));
        }
    }

    private static void addDoc(IndexWriter writer, String title, String isbn) throws IOException {
        Document doc = new Document();
        doc.add(new TextField("title", title, Field.Store.YES));
        doc.add(new StringField("isbn", isbn, Field.Store.YES));
        writer.addDocument(doc);
    }
```



## 参考

[深度解析 Lucene 轻量级全文索引实现原理 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/391168762)

[Lucene简介（一个 Demo 示例）_lucene demo-CSDN博客](https://blog.csdn.net/SLN2432713617/article/details/90140515)