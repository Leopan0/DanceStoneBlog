---
tag:
  - Java
  - Spring
category:
  - Java
date: 2023-05-25
---

# Spring 小技巧

收集 Spring 未归类的小知识



## Spring 依赖注入



### 注入类

Spring 两种方式可以注入类：

1. 在私有属性上加注解 `@Autowired`

```java
@Autowired
private ITestService testService;
```

2. `@Autowired` 还支持构造方法注入，在构造方法上加上该注解，就可，支持多个参数构造注入，Spring 官方更推荐。

```java
@Autowired
public DataRecordServiceImplTest(IDataRecordService recordService){
    this.recordService = recordService;
}
```



### 注入父类

当需要注入某个类的所有子类时，可以通过Map方式注入

```java
@Autowired
private Map<String, IParentService> dictServiceMap;
```

这样就能注入 `IParentService` 的所有子类

> 这里 key 不会和子类名称完全一致，是截取前n个字符。