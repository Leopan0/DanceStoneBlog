---
title: Redis与Lua脚本
isOrigin: false
description: Lua脚本运用的中间件很多，学习好，能掌握更多技巧
date: 2023-06-07
tag: 
  - Lua
  - Redis
---

Lua 脚本的基础语法和C系语言是相通的，详情基本语法可以看这里

[Lua 教程 | 菜鸟教程 (runoob.com)](https://www.runoob.com/lua/lua-tutorial.html)

本文主要介绍Lua脚本和Redis的用法。Lua 脚本在redis中是被视为一次操作的，意味着Lua脚本具有原子性，让我们无需考虑并发问题。Lua和redis结合有多种形式，下面是简单示例

> 需要保证redis版本支持 Lua 脚本

## 如何执行Lua脚本

### 执行命令

Lua 脚本在redis中有两种命令可以实现 `EVAL` 和 `EVALSHA`

#### EVAL

EVAL命令直接对脚本进行求值

```shell
#格式
eval script numkeys key [key ...] arg [arg ...]
#参数说明
#script：是一段 Lua 5.1 脚本程序，它会被运行在 Redis 服务器上下文中，这段脚本不必(也不应该)定义为一个 Lua 函数。
#numkeys:用于指定键名参数的个数。
#key：键名参数，表示在脚本中所用到的那些 Redis 键(key)，这些键名参数可以在 Lua 中通过全局变量 KEYS 数组，用 1 为基址的形式访问( KEYS[1] ， KEYS[2] ，以此类推)。
#arg：全局变量，可以在 Lua 中通过全局变量 ARGV 数组访问，访问的形式和 KEYS 变量类似( ARGV[1] 、 ARGV[2] ，诸如此类)
```

#### EVALSHA

EVALSHA 要求输入某个脚本的 SHA1 校验和， 这个校验和所对应的脚本必须至少被EVAL 执行过一次。

```shell
#格式
evalsha sha1 numkeys key [key ...] arg [arg ...]
```

> 换句话说，我们编写重复执行的脚本，后续可以通过EVALSHA来再次执行，Redis会通过SHA记录这次操作

### 辅助命令

#### script load

示例

```shell
script load "return 'hello'"
```



这个脚本的作用是将脚本添加到缓存当中，如果有需要可以直接用 `EVALSHA` 命令执行，脚本可以保留到 SCRIPT FLUSH 为止

#### script exists

判断某个脚本是否存在

#### script kill

杀死当前正在运行的 Lua 脚本，当且仅当这个脚本没有执行过任何写操作时，这个命令才生效。

####  script flush

清除所有Lua脚本

## 参考

[Lua 脚本 — Redis 设计与实现 (redisbook.readthedocs.io)](https://redisbook.readthedocs.io/en/latest/feature/scripting.html)

[第十节：Redis 脚本、Lua语法学习、以及秒杀案例脚本分析 - Yaopengfei - 博客园 (cnblogs.com)](https://www.cnblogs.com/yaopengfei/p/13941841.html)