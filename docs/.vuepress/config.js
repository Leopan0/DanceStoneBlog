module.exports = {
  plugins: ['@vuepress/back-to-top'],
  title: 'Dance Stone\'s Blog',
  description: '会跳舞石头的博客',
  head: [
    ['link', {rel: 'icon', href: '/logo.png'}]
  ],
  themeConfig: {
    //搜索
    search: true,
    // 导航栏
    nav: [
      { text: '首页', link: '/'},
      { text: '前端', link: '/web/'}
    ],
    //侧边栏
    siderbar: 'auto',
    // 最后更新时间
    lastUpdated: '最近更新时间',
    // 上 / 下一篇链接
    nextLink: true,
    preLinks: true,
    //git配置
    repo: 'https://github.com/Leopan0/DanceStoneBlog',
    repoLabel: '查看源码',
    editLink: true,
  },
   
}