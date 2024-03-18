import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as e,f as s}from"./app-694d939e.js";const i={},t=s(`<h1 id="spring-小技巧" tabindex="-1"><a class="header-anchor" href="#spring-小技巧" aria-hidden="true">#</a> Spring 小技巧</h1><p>收集 Spring 未归类的小知识</p><h2 id="spring-依赖注入" tabindex="-1"><a class="header-anchor" href="#spring-依赖注入" aria-hidden="true">#</a> Spring 依赖注入</h2><h3 id="注入类" tabindex="-1"><a class="header-anchor" href="#注入类" aria-hidden="true">#</a> 注入类</h3><p>Spring 两种方式可以注入类：</p><ol><li>在私有属性上加注解 <code>@Autowired</code></li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">ITestService</span> testService<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><code>@Autowired</code> 还支持构造方法注入，在构造方法上加上该注解，就可，支持多个参数构造注入，Spring 官方更推荐。</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">public</span> <span class="token class-name">DataRecordServiceImplTest</span><span class="token punctuation">(</span><span class="token class-name">IDataRecordService</span> recordService<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>recordService <span class="token operator">=</span> recordService<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="注入父类" tabindex="-1"><a class="header-anchor" href="#注入父类" aria-hidden="true">#</a> 注入父类</h3><p>当需要注入某个类的所有子类时，可以通过Map方式注入</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">IParentService</span><span class="token punctuation">&gt;</span></span> dictServiceMap<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就能注入 <code>IParentService</code> 的所有子类</p><blockquote><p>这里 key 不会和子类名称完全一致，是截取前n个字符。</p></blockquote>`,14),c=[t];function o(r,p){return n(),e("div",null,c)}const u=a(i,[["render",o],["__file","Spring.html.vue"]]);export{u as default};
