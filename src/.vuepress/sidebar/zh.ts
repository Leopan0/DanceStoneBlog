import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "后端",
      icon: "shell",
      prefix: "zh/后端/",
      link: "",
      children: "structure",
    },
    {
      text: "其他",
      icon: "note",
      prefix: "zh/其他/",
      link: "",
      children: "structure",
    },
    "intro",
  ],
});
