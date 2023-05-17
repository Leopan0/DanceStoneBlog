//vuepress配置
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  base: "/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "会跳舞的石头",
      description: "代码在指尖飞舞",
    },

    "/en/": {
      lang: "en-US",
      title: "Blog Demo",
      description: "A blog demo for vuepress-theme-hope",
    }
  },
  //主题
  theme,
  //其他插件
  plugins: [searchProPlugin({
    // 索引全部内容
    indexContent: false,
    // 为分类和标签添加索引
    customFields: [
      {
        getter: (page) => page.frontmatter.category,
        formatter: "分类：$content",
      },
      {
        getter: (page) => page.frontmatter.tag,
        formatter: "标签：$content",
      },
    ],
  }),
  searchPlugin({
    //排除首页
    isSearchable: (page) => page.path !== '/',
  }),]
});
