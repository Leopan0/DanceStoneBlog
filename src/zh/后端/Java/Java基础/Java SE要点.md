---
date: 2023-04-18
tag: 
  - Java
---

# Java SE 要点

## 枚举

> 原文：[枚举为什么可以用==判断相等](https://blog.csdn.net/x_iya/article/details/53291536)

详细：答案是肯定的，因为枚举有着严格的实例化控制，所以你可以用 `==` 去做比较符，这个用法，在官方文档中也有明确的说明。而且枚举equals（）方法的底层就是用==判断。
```java
    /**
     * Returns true if the specified object is equal to this
     * enum constant.
     *
     * @param other the object to be compared for equality with this object.
     * @return  true if the specified object is equal to this
     *          enum constant.
     */
    public final boolean equals(Object other) {
        return this==other;
    }
```
基础类型的包装类型也用 `==` 判断



## Pattern.compile函数的用法

在使用`Pattern.compile`函数时，可以加入控制正则表达式的匹配行为的参数： 
`Pattern Pattern.compile(String regex, int flag) `

flag的取值范围如下： 

- `Pattern.CANON_EQ`     当且仅当两个字符的"正规分解(canonical decomposition)"都完全相同的情况下，才认定匹配。比如用了这个标志之后，表达式"\u030A"会匹配?。默认情况下，不考虑规范相等性(canonical equivalence)"。 
- `Pattern.CASE_INSENSITIVE`     默认情况下，大小写不明感的匹配只适用于US-ASCII字符集。这个标志能让表达式忽略大小写进行匹配。要想对Unicode字符进行大小不明感的匹 配，只要将UNICODE_CASE与这个标志合起来就行了。 
- `Pattern.COMMENTS`     在这种模式下，匹配时会忽略(正则表达式里的)空格字符(译者注：不是指表达式里的"\\s"，而是指表达式里的空格，tab，回车之类)。注释从#开始，一直到这行结束。可以通过嵌入式的标志来启用Unix行模式。 
- `Pattern.DOTALL`     在这种模式下，表达式'.'可以匹配任意字符，包括表示一行的结束符。默认情况下，表达式'.'不匹配行的结束符。 
- `Pattern.MULTILINE`   在这种模式下， `^` 和 `$` 分别匹配一行的开始和结束。此外，`^` 仍然匹配字符串的开始，`$` 也匹配字符串的结束。默认情况下，这两个表达式仅仅匹配字符串的开始和结束。 
- `Pattern.UNICODE_CASE`     在这个模式下，如果你还启用了CASE_INSENSITIVE标志，那么它会对Unicode字符进行大小写不明感的匹配。默认情况下，大小写不敏感的匹配只适用于US-ASCII字符集。 
- `Pattern.UNIX_LINES`     在这个模式下，只有'\n'才被认作一行的中止，并且与`.`，`^`，以及`$`进行匹配。

## lamda表达式
### ParallelStream

​		`parallelStream` 是 Java lamda表达式当中并行流写法，本质上并行方法，效率很高，但是需要注意会产生多线程下的各种问题，比如使用非线程安全的集合类，会导致空指针和数组下标越界等问题。如果使用`.collect`最终将结果收集起来就不会有个这个问题或者使用`CopyOnWriteArrayList`， `CopyOnWriteArraySet` 这类线程安全的集合来避免问题。千万不能使用 `parallelStream` 去循环处理非线程安全的流程。

