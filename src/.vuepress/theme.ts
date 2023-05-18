//主题配置
import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://github.com/Leopan0",
  author: {
    name: "会跳舞的石头",
    url: "https://github.com/Leopan0/DanceStoneBlog",
  },
  navbarLayout:{
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"],
  },
  //版面设计
  iconAssets: "iconfont",
  logo: "/logo.svg",
  //地址
  repo: "vuepress-theme-hope/vuepress-theme-hope",
  docsDir: "docs",
  blog: {
    medias: {
      Github: "https://github.com/Leopan0",
      zhihu: "https://www.zhihu.com/people/wan-wan-wanaline",
    },
  },
  darkmode: "switch",
  //页面功能
  print: false,
  backToTop: {
    progress: true
  },
  //导航配置
  locales: {
    "/": {
      // 导航栏
      navbar: enNavbar,    
      // 侧边栏
      sidebar: enSidebar,
      //路径导航
      breadcrumb: true, 

      footer: "Power By <a href='https://vuepress.vuejs.org/zh'>VuePress</a>",
      displayFooter: true,
      copyright : "MIT Licensed | Copyright <a href='https://github.com/Leopan0'>会跳舞的石头</a>",

      blog: {
        description: "站点简介",
        intro: "/intro.html",
      },

      metaLocales: {
        editLink: "Github上查看",
      },
    },
  },
  //加密路径
  encrypt: {
    config: {
      "/demo/": ["1234"],
      "/en": ["1234"],
    },
  },
  
  plugins: {
    blog: true,
    copyCode: {},
    copyright: true,
    //图片预览配置
    photoSwipe: {

    },
    //markdown增强
    mdEnhance: {
      chart: true,
      demo: true,
      echarts: true,
      figure: true,
      gfm: true,
      include: true,
      katex: true,
      playground: {
        presets: ["ts", "vue"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      vPre: true,
      vuePlayground: true,
      //代码选项卡
      tabs: true, codetabs: true,
      sub:true, sup:true,
      mermaid: true,
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
      //幻灯片功能
      presentation:false,
      flowchart:false,
    },
  },
});
