const t=JSON.parse('{"key":"v-6b73edb9","path":"/zh/%E5%90%8E%E7%AB%AF/Java/Spring%E6%A1%86%E6%9E%B6%E4%BB%AC/SpringData/Spring%20Data%20JDBC.html","title":"Spring Data JDBC","lang":"zh-CN","frontmatter":{"tag":["Java","Spring Data"],"category":["Java"],"date":"2023-05-25T00:00:00.000Z","description":"Spring Data JDBC 准备工作 Spring Data JDBC 是对 JDBC Template 的封装，简化对JDBC数据库连接的操作。在Spring Boot当中，使用JDBC只需要两个包 Spring Data JDBC 的 Starter 包和 数据库驱动包 JDBC Starter 包 内含的Spring Core模块可能会和本身 Spring Boot 内含 Spring Core模块出现版本替换到最新，导致版本不兼容问题 &lt;dependency&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;spring-boot-starter-data-jdbc&lt;/artifactId&gt; &lt;version&gt;${jdbc.template.version}&lt;/version&gt; &lt;/dependency&gt;","head":[["meta",{"property":"og:url","content":"https://github.com/Leopan0/zh/%E5%90%8E%E7%AB%AF/Java/Spring%E6%A1%86%E6%9E%B6%E4%BB%AC/SpringData/Spring%20Data%20JDBC.html"}],["meta",{"property":"og:site_name","content":"会跳舞的石头"}],["meta",{"property":"og:title","content":"Spring Data JDBC"}],["meta",{"property":"og:description","content":"Spring Data JDBC 准备工作 Spring Data JDBC 是对 JDBC Template 的封装，简化对JDBC数据库连接的操作。在Spring Boot当中，使用JDBC只需要两个包 Spring Data JDBC 的 Starter 包和 数据库驱动包 JDBC Starter 包 内含的Spring Core模块可能会和本身 Spring Boot 内含 Spring Core模块出现版本替换到最新，导致版本不兼容问题 &lt;dependency&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;spring-boot-starter-data-jdbc&lt;/artifactId&gt; &lt;version&gt;${jdbc.template.version}&lt;/version&gt; &lt;/dependency&gt;"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-05-26T09:10:54.000Z"}],["meta",{"property":"article:author","content":"会跳舞的石头"}],["meta",{"property":"article:tag","content":"Java"}],["meta",{"property":"article:tag","content":"Spring Data"}],["meta",{"property":"article:published_time","content":"2023-05-25T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-05-26T09:10:54.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Spring Data JDBC\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-05-25T00:00:00.000Z\\",\\"dateModified\\":\\"2023-05-26T09:10:54.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"会跳舞的石头\\",\\"url\\":\\"https://github.com/Leopan0/DanceStoneBlog\\"}]}"]]},"headers":[{"level":3,"title":"准备工作","slug":"准备工作","link":"#准备工作","children":[]},{"level":3,"title":"单条数据执行","slug":"单条数据执行","link":"#单条数据执行","children":[]},{"level":3,"title":"批量执行","slug":"批量执行","link":"#批量执行","children":[]}],"git":{"createdTime":1685092254000,"updatedTime":1685092254000,"contributors":[{"name":"Leopan0","email":"33919622+Leopan0@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":2.35,"words":706},"filePathRelative":"zh/后端/Java/Spring框架们/SpringData/Spring Data JDBC.md","localizedDate":"2023年5月25日","excerpt":"<h1> Spring Data JDBC</h1>\\n<h3> 准备工作</h3>\\n<p>Spring Data JDBC 是对 JDBC Template 的封装，简化对JDBC数据库连接的操作。在Spring Boot当中，使用JDBC只需要两个包 Spring Data JDBC 的 Starter 包和 数据库驱动包</p>\\n<blockquote>\\n<p>JDBC Starter 包 内含的Spring Core模块可能会和本身 Spring Boot 内含 Spring Core模块出现版本替换到最新，导致版本不兼容问题</p>\\n</blockquote>\\n<div class=\\"language-xml line-numbers-mode\\" data-ext=\\"xml\\"><pre class=\\"language-xml\\"><code><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>dependency</span><span class=\\"token punctuation\\">&gt;</span></span>\\n    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>groupId</span><span class=\\"token punctuation\\">&gt;</span></span>org.springframework.boot<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>groupId</span><span class=\\"token punctuation\\">&gt;</span></span>\\n    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>artifactId</span><span class=\\"token punctuation\\">&gt;</span></span>spring-boot-starter-data-jdbc<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>artifactId</span><span class=\\"token punctuation\\">&gt;</span></span>\\n    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>version</span><span class=\\"token punctuation\\">&gt;</span></span>${jdbc.template.version}<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>version</span><span class=\\"token punctuation\\">&gt;</span></span>\\n<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>dependency</span><span class=\\"token punctuation\\">&gt;</span></span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","copyright":{"author":"会跳舞的石头"},"autoDesc":true}');export{t as data};
