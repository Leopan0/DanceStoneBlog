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
        icon: "java",
        link: "Java/"
      },
    ],
  },
  {
    text: "前端",
    icon: "edit",
    link: "/zh/前端/",
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
