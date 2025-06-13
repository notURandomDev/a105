export default defineAppConfig({
  pages: [
    "pages/calendar/index",
    "pages/reserve/index",
    "pages/profile-edit/index",
    "pages/index/index",
    "pages/profile/index",
    "pages/auth/index",
  ],

  window: {
    backgroundColor: "#fafcff",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },

  tabBar: {
    color: "#999", // 默认文字颜色
    selectedColor: "#000", // 选中时文字颜色
    backgroundColor: "#FFF", // 背景色
    borderStyle: "white",
    list: [
      // 导航项列表
      {
        pagePath: "pages/index/index", // 页面路径（基于src目录）
        text: "首页", // 显示文字
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home-active.png",
      },
      {
        pagePath: "pages/calendar/index",
        text: "日历",
        iconPath: "assets/icons/calendar.png",
        selectedIconPath: "assets/icons/calendar-active.png",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
        iconPath: "assets/icons/profile.png",
        selectedIconPath: "assets/icons/profile-active.png",
      },
    ],
  },
});
