---
date：2023-06-02
tag:
  - java
  - Spring Web
---

# Web序列化器加载顺序问题

在项目中，配置多序列化转换，有多种方式实现，使用不同方式的Spring 底层实现，导致序列化器的选择结果有很大区别，我遇到问题，导致fastjson序列化没有正确的加载，也没有走jackjson的自定义序列化

> 我的fastjson和jackjson都做了自定义处理，jackjson优先，fastjson其次

开始是这样，我的WebMvc配置继承了 `WebMvcConfigurationSupport` 类，但是一些需要，我需要切换为实现 `WebMvcConfigurer` 接口，进行需要化时，并没有走我的自定义序列化方式，jackjson和fastjson，都没有去使用。

通过调试，我找到了下面这段代码

```java
package org.springframework.web.servlet.mvc.method.annotation;
...
protected <T> void writeWithMessageConverters(@Nullable T value, MethodParameter returnType,
			ServletServerHttpRequest inputMessage, ServletServerHttpResponse outputMessage)
			throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {
    ...
    for (HttpMessageConverter<?> converter : this.messageConverters) {
				GenericHttpMessageConverter genericConverter = (converter instanceof GenericHttpMessageConverter ?
						(GenericHttpMessageConverter<?>) converter : null);
				if (genericConverter != null ?
						((GenericHttpMessageConverter) converter).canWrite(targetType, valueType, selectedMediaType) :
						converter.canWrite(valueType, selectedMediaType)) {
					body = getAdvice().beforeBodyWrite(body, returnType, selectedMediaType,
							(Class<? extends HttpMessageConverter<?>>) converter.getClass(),
							inputMessage, outputMessage);
					if (body != null) {
						Object theBody = body;
						LogFormatUtils.traceDebug(logger, traceOn ->
								"Writing [" + LogFormatUtils.formatValue(theBody, !traceOn) + "]");
						addContentDispositionHeader(inputMessage, outputMessage);
						if (genericConverter != null) {
							genericConverter.write(body, targetType, selectedMediaType, outputMessage);
						}
						else {
							((HttpMessageConverter) converter).write(body, selectedMediaType, outputMessage);
						}
					}                 
    ...
...
```

这段代码中，是调用序列化转换，输出序列化结果的地方，断点这儿发现默认使用的是 `MappingJackson2HttpMessageConverter` 序列化转换器，这就奇怪了，为什么继承`WebMvcConfigurationSupport` 类并没有使用这个默认的序列化器。

通过监听一个`List<HttpMessageConverter<?>> converters` 属性发现，实现 `WebMvcConfigurer` 接口，会多加载很多自带的序列化转换器，而且这些序列化转换器，优先级很高，在上述代码中，找到第一个合适的转换器，就会返回调用，这才导致我的两种自定义序列化方式，没有生效。

## 解决方法

找到原因，解决就简单了，我在WebMvc配置类中，将自定义序列化器排序放在最前面即可，这样我的序列化器优先级就会很高了

```java
@Override
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
	CostJackson2HttpMessageConverter costJackson2HttpMessageConverter = new CostJackson2HttpMessageConverter();
	converters.add(0, costJackson2HttpMessageConverter);
	converters.add(1, fastJsonHttpMessageConverter());
}
```






