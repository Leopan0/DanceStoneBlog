import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

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
    },
    "/zh": {
      lang: "zh-CN",
      title: "会跳舞的石头",
      description: "代码在指尖飞舞",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
