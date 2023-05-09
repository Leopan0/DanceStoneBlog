# Vite构建过程中遇到的问题



### public 静态资源访问导致首页空白问题

#### 前言

我在vite构建中，使用idea编写代码时，idea在`index.html` 中对以下代码进行警告提示，无法解析/src/main.ts，采纳Idea默认提示，则会在导致了public目录中创建一个空白的main.ts文件

```html
<script type="module" src="/src/main.ts"></script>
```

#### 解决方法

删除 public 目录中的 `main.ts` 文件

