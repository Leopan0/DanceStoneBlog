import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "后端",
    icon: "edit",
    prefix: "/zh/后端/",
    children: [
      {
        text: "Java",
        icon: "edit",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "edit", link: "1" },
          { text: "苹果2", icon: "edit", link: "2" },
        ],
      },
      {
        text: "数据库",
        icon: "edit",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "edit", link: "1" },
          { text: "苹果2", icon: "edit", link: "2" },
        ],
      },
      {
        text: "中间件",
        icon: "edit",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "edit", link: "1" },
          { text: "苹果2", icon: "edit", link: "2" },
        ],
      },
    ],
  },
  {
    text: "前端",
    icon: "edit",
    link: "/zh/前端/article",
  },
  {
    text: "其他",
    icon: "note",
    prefix: "/zh/其他/",
    children: [{
      text: "程序员建站",
      icon: "edit",
      link: "/",
    },]
  },
]);
