import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

export default defineUserConfig({
  base: "/",
  plugins: [
    //markdown增强
    mdEnhancePlugin({
      //代码选项卡
      tabs: true, codetabs: true,
      sub:true, sup:true,
      //开起自定义对齐
      align:true,
      //css属性
      attrs:false,
      mark:true,
      //图片 详情查看
      imgLazyload:true,
      imgMark:true,
      //markdown 卡片
      card:true,

    }),
  ],
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

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
