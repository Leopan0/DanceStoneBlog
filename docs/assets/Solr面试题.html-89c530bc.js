import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{o as r,c as o,f as e}from"./app-ab19b9ce.js";const i={},a=e('<h1 id="什么是solr-它与lucene有什么关系" tabindex="-1"><a class="header-anchor" href="#什么是solr-它与lucene有什么关系" aria-hidden="true">#</a> 什么是Solr？它与Lucene有什么关系？</h1><p>Solr是Apache下的一个顶级开源项目，采用Java开发，它是基于Lucene的全文搜索服务器 Lucene是一个基于Java的全文信息检索工具包，它不是一个完整的搜索应用程序，而是为你的应用程序提供索引和搜索功能 Solr底层的核心技术是使用Lucene来实现的</p><h1 id="solr的主要特点是什么" tabindex="-1"><a class="header-anchor" href="#solr的主要特点是什么" aria-hidden="true">#</a> Solr的主要特点是什么？</h1><ul><li>垂直搜索功能</li><li>提供一套强大Data Schema来定义字段，类型和设置文本分析</li><li>提供基于Web的管理界面</li></ul><h1 id="solr-垂直搜索-如何处理搜索" tabindex="-1"><a class="header-anchor" href="#solr-垂直搜索-如何处理搜索" aria-hidden="true">#</a> Solr 垂直搜索，如何处理搜索</h1><p>Solr垂直搜索功能指的是对某一特定领域或者主题的数据进行索引和搜索的能力 对外提供类似于Web-service的API接口</p><ol><li>接收查询请求：当用户在搜索界面输入查询关键词时，Solr接收该请求并发送给服务器。</li><li>解析查询请求：Solr接收到查询请求后，会进行解析和预处理操作。这个过程包括解析查询字符串、去除停用词（无关紧要的词汇，如&quot;的&quot;、&quot;和&quot;等）、分词等。</li><li>构建搜索索引：经过预处理后，Solr会根据配置的索引映射关系，将查询关键词转换为对应的索引字段。然后，根据索引构建搜索倒排索引表，用于快速定位符合条件的文档。</li><li>执行查询：根据用户的查询条件，Solr使用倒排索引表进行匹配，找到符合条件的文档。这个过程会根据配置的排序规则进行排序，并使用各种查询优化技术（如查询扩展、结果去重等）来提高搜索结果的质量。</li><li>返回结果：Solr将查询结果按照指定的排序方式进行排序，并将结果以XML或JSON等格式返回给客户端。</li><li>渲染结果：客户端接收到搜索结果后，根据需求进行数据的解析和展示。</li></ol><h1 id="简述倒排索引机制" tabindex="-1"><a class="header-anchor" href="#简述倒排索引机制" aria-hidden="true">#</a> 简述倒排索引机制</h1><p>倒排索引原理是<strong>将文档进行分词处理，标记每个词都出现在哪些文档里面，这样就可以快速查询某个词所出现的文档位置</strong> 倒排索引是一种倒排表（ inverted index），它以字或词为关键字进行索引。在这个索引表中，每个记录都对应一个关键词，记录的内容是出现该关键词的文档编号和该词在该文档中的位置信息。这种数据结构使得我们可以快速查找到包含特定关键词的所有文档。</p><h1 id="solr中的索引是什么-如何创建索引" tabindex="-1"><a class="header-anchor" href="#solr中的索引是什么-如何创建索引" aria-hidden="true">#</a> Solr中的索引是什么？如何创建索引？</h1><p>在Solr中，索引是一种数据结构，用于存储和组织文档数据，以便能够快速进行搜索和查询。创建过程如下：</p><ol><li>创建索引字段：首先，<strong>需要定义索引字段（field）</strong>，它们是用于存储和检索文档数据的属性。例如，可以创建一个名为&quot;title&quot;的索引字段，用于存储文档的标题信息。</li><li>定义字段类型：为了确保索引字段能够正确地存储和检索数据，需要为每个字段定义一个合适的<strong>字段类型（field type）</strong>。字段类型定义了字段的存储方式、索引方式以及其他相关属性。例如，可以为&quot;title&quot;字段定义一个名为&quot;text_general&quot;的字段类型，该类型适用于存储文本数据并进行全文搜索。</li><li>创建索引：在定义好索引字段和字段类型后，可以使用Solr的API或管理界面创建索引。在创建索引时，需要指定要索引的文档数据以及对应的索引字段。</li><li>提交文档：一旦文档数据被添加到索引中，需要提交这些文档以使其可供搜索。可以使用Solr的API或管理界面提交文档。</li></ol><h1 id="solr的分布式架构是怎样的-如何实现高可用性和负载均衡" tabindex="-1"><a class="header-anchor" href="#solr的分布式架构是怎样的-如何实现高可用性和负载均衡" aria-hidden="true">#</a> Solr的分布式架构是怎样的？如何实现高可用性和负载均衡？</h1><p>Solr的分布式架构通过使用Zookeeper作为协调服务，以Zookeeper为注册中心来管理 事务日志事务日志确保更新无丢失，即使文档没有索引到磁盘</p><h1 id="solr创建索引失败-但是数据保存成功该怎么办" tabindex="-1"><a class="header-anchor" href="#solr创建索引失败-但是数据保存成功该怎么办" aria-hidden="true">#</a> solr创建索引失败，但是数据保存成功该怎么办</h1><ul><li><strong>查看日志</strong>：查看Solr的日志文件，通常在Solr的安装目录下的logs文件夹中，找到相关的错误信息。</li><li><strong>清理临时信息</strong>：在创建索引失败后，可能需要清理临时信息，以便重新创建索引。</li><li><strong>重新创建索引</strong>：根据错误信息，采取相应的措施，重新创建索引。</li><li><strong>创建定时检查</strong>：通过定时检查降索引重新创建进Solr中，在创建索引时，有可能会出现索引重复或重名等冲突。需要先查看已有的索引，找出冲突的索引并删除，再重新创建所需索引。</li><li><strong>调整索引参数</strong>：根据实际情况，调整Solr的配置参数，例如缓存大小、线程池大小等，以提高索引的性能和成功率。</li></ul><h1 id="solr-中文分词" tabindex="-1"><a class="header-anchor" href="#solr-中文分词" aria-hidden="true">#</a> Solr 中文分词</h1><ul><li>通过内置分析器进行自定义处理，例如，可以使用Icu4j库来实现中文分词，然后将其包装成自定义分析器。IK Analyzer也是中文分析器</li><li>通过中文分词插件，例如结巴分词插件（Jieba）或盘古分词插件（Pangu）等</li></ul><h1 id="solr中的复制和复制集是什么-如何配置" tabindex="-1"><a class="header-anchor" href="#solr中的复制和复制集是什么-如何配置" aria-hidden="true">#</a> Solr中的复制和复制集是什么？如何配置？</h1><p>Solr中的复制和复制集是用来实现数据冗余和灾备的方法。复制是指将一个Solr索引节点的内容复制到另一个Solr索引节点上，以实现数据冗余。复制集是指由一个主Solr索引节点和若干个从Solr索引节点组成的集群，其中主节点负责接收和存储文档，从节点从主节点复制文档以实现数据冗余和灾备。 就是构建集群，可以通过Solr的API或者Zookeeper来管理</p><ol><li>Solr如何处理大量数据的索引和搜索？</li><li>Solr如何与其他系统集成？</li></ol><p>这些问题涵盖了Solr的基本概念、功能和架构。在面试中，你可以根据对方的回答来进一步探讨和深入了解他们对Solr的理解和经验。记得根据对方的回答提出更具体的问题，以便更好地评估他们的技能和知识水平。</p>',22),t=[a];function n(s,h){return r(),o("div",null,t)}const u=l(i,[["render",n],["__file","Solr面试题.html.vue"]]);export{u as default};
