import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as s,f as t}from"./app-743195df.js";const e={},p=t(`<h1 id="spring-validation" tabindex="-1"><a class="header-anchor" href="#spring-validation" aria-hidden="true">#</a> Spring Validation</h1><p>​ <code>Spring Validation</code> 是对 <code>Hibernate Validation</code>进行了二次封装，在<code>Spring MVC</code> 模块中添加了自动校验，并将校验信息封装进了特定的类中。通过框架，可以轻松完成Spring 的校验。</p><h2 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h2><p>使用 <code>Spring Validation</code>，需要导入下面这个依赖包</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-starter-validation<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>\${spring-boot.version}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><h3 id="默认校验" tabindex="-1"><a class="header-anchor" href="#默认校验" aria-hidden="true">#</a> 默认校验</h3><p>如果使用默认注解进行校验，无需使用其他配置，下面是常用的校验注解：</p><table><thead><tr><th>注解</th><th>说明</th></tr></thead><tbody><tr><td>@Null</td><td>被注释的元素必须为null</td></tr><tr><td>@NotNull</td><td>被注释的元素必须不为null</td></tr><tr><td>@AssertTrue</td><td>被注释的元素必须为true</td></tr><tr><td>@AssertFalse</td><td>被注释的元素必须为false</td></tr><tr><td>@Min(value)</td><td>被注释的元素必须是一个数字，其值必须大于等于指定的最小值</td></tr><tr><td>@Max(value)</td><td>被注释的元素必须是一个数字，其值必须小于等于指定的最大值</td></tr><tr><td>@DecimalMin(value)</td><td>被注释的元素必须是一个数字，其值必须大于等于指定的最小值</td></tr><tr><td>@DecimalMax(value)</td><td>被注释的元素必须是一个数字，其值必须小于等于指定的最大值</td></tr><tr><td>@Size(max, min)</td><td>被注释的元素的大小必须在指定的范围内</td></tr><tr><td>@Digits (integer, fraction)</td><td>被注释的元素必须是一个数字，其值必须在可接受的范围内</td></tr><tr><td>@Past</td><td>被注释的元素必须是一个过去的日期</td></tr><tr><td>@Future</td><td>被注释的元素必须是一个将来的日期</td></tr><tr><td>@Pattern(value)</td><td>被注释的元素必须符合指定的正则表达式</td></tr><tr><td>@Email</td><td>被注释的元素必须是电子邮箱地址</td></tr><tr><td>@Length</td><td>被注释的字符串的大小必须在指定的范围内</td></tr><tr><td>@NotEmpty</td><td>被注释的字符串的必须非空</td></tr><tr><td>@Range</td><td>被注释的元素必须在合适的范围内</td></tr></tbody></table><p>使用内置默认注解校验，需要在对应属性上加上注解，同时在需要校验的接口上使用<code>Valid</code> 注解，在接口所在类加上<code>Validated</code> 注解。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>validation<span class="token punctuation">.</span></span><span class="token class-name">Valid</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>validation<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Validated</span></span><span class="token punctuation">;</span>
<span class="token annotation punctuation">@Validated</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">IPersonService</span> <span class="token punctuation">{</span>
    <span class="token keyword">void</span> <span class="token function">savePerson</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Valid</span> <span class="token class-name">Person</span> person<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内置校验注解支持对返回的消息进行自定义 message 返回错误信息，帮助异常捕捉更好的获取信息。多重校验还可以加不同注解来实现。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@NotNull</span><span class="token punctuation">(</span>message <span class="token operator">=</span> <span class="token string">&quot;身份证不能为空&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@Size</span><span class="token punctuation">(</span>message <span class="token operator">=</span> <span class="token string">&quot;身份证不正确&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> idCard<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Size</span><span class="token punctuation">(</span>min <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">String</span> phone<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@NotNull</span>
    <span class="token annotation punctuation">@Email</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> email<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">Date</span> birthDate<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * true 男性， false 女性
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">boolean</span> sex<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果有多个参数需要校验，形式可以如下，即一个校验类对应一个校验结果。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">void</span> <span class="token function">funct</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Validated</span> <span class="token class-name">Person</span> person<span class="token punctuation">,</span> <span class="token class-name">BindingResult</span> fooBindingResult ，<span class="token annotation punctuation">@Validated</span> <span class="token class-name">Bar</span> bar<span class="token punctuation">,</span> <span class="token class-name">BindingResult</span> barBindingResult<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="自定义校验" tabindex="-1"><a class="header-anchor" href="#自定义校验" aria-hidden="true">#</a> 自定义校验</h3><p><code>Spring Validation</code> 自定义校验需要一些配置，创建自己的校验注解和校验实现</p><p>添加自己的校验注解：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Documented</span>
<span class="token comment">//此处填写校验实现类</span>
<span class="token annotation punctuation">@Constraint</span><span class="token punctuation">(</span>validatedBy <span class="token operator">=</span> <span class="token class-name">ValidPersonValidator</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span><span class="token constant">TYPE</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span><span class="token constant">RUNTIME</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token annotation punctuation">@interface</span> <span class="token class-name">ValidPerson</span> <span class="token punctuation">{</span>

    <span class="token comment">// 默认返回信息</span>
    <span class="token class-name">String</span> <span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>

    <span class="token comment">// 必要信息</span>
    <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">groups</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Payload</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">payload</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加自己的校验实现</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// ValidPerson为校验注解</span>
<span class="token comment">// Person需要校验的类</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ValidPersonValidator</span> <span class="token keyword">implements</span> <span class="token class-name">ConstraintValidator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ValidPerson</span><span class="token punctuation">,</span> <span class="token class-name">Person</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@SneakyThrows</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isValid</span><span class="token punctuation">(</span><span class="token class-name">Person</span> person<span class="token punctuation">,</span> <span class="token class-name">ConstraintValidatorContext</span> context<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">String</span> msg <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token function">getIdCard</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> person<span class="token punctuation">.</span><span class="token function">getIdCard</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">18</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            msg <span class="token operator">=</span> <span class="token string">&quot;身份证有误&quot;</span><span class="token punctuation">;</span>
            <span class="token comment">// 取消多余message显示</span>
            context<span class="token punctuation">.</span><span class="token function">disableDefaultConstraintViolation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 自定义返回msg</span>
            context<span class="token punctuation">.</span><span class="token function">buildConstraintViolationWithTemplate</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addConstraintViolation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),o=[p];function c(i,l){return a(),s("div",null,o)}const r=n(e,[["render",c],["__file","Spring数据验证.html.vue"]]);export{r as default};
