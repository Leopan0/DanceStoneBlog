import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "后端",
    icon: "edit",
    prefix: "/zh/后端/",
    children: [
      {
        text: "Java技术",
        link: "Java/"
      },
      {
        text: "Java大数据",
        link: "Java大数据/"
      },
    ],
  },
  {
    text: "前端",
    link: "/zh/前端/",
  },
  {
    text: "其他",
    icon: "note",
    prefix: "/zh/其他/",
    children: [{
      text: "搭建问题",
      icon: "edit",
      link: "搭建问题",
    },
    ]
  },
]);
