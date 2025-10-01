export default defineAppConfig({
  pages: [
    "pages/musicians-n-bands/index",
    "pages/calendar/index",
    "pages/mail/index",
    "pages/demo/index",
    "pages/profile/index",
    "pages/pay/index",
    "pages/index/index",
    "pages/musician-edit/index",
    "pages/band-create/index",
    "pages/musician-detail/index",
    "pages/band-detail/index",
    "pages/reserve/index",
    "pages/profile-edit/index",
    "pages/auth/index",
    "pages/instruction/index",
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
        iconPath: "assets/icons/tab/home.png",
        selectedIconPath: "assets/icons/tab/home-active.png",
      },
      {
        pagePath: "pages/calendar/index",
        text: "日历",
        iconPath: "assets/icons/tab/calendar.png",
        selectedIconPath: "assets/icons/tab/calendar-active.png",
      },
      {
        pagePath: "pages/musicians-n-bands/index",
        text: "乐队 & 乐手",
        iconPath: "assets/icons/tab/band.png",
        selectedIconPath: "assets/icons/tab/band-active.png",
      },
      {
        pagePath: "pages/mail/index",
        text: "收件箱",
        iconPath: "assets/icons/tab/mail.png",
        selectedIconPath: "assets/icons/tab/mail-active.png",
      },
      // {
      //   pagePath: "pages/profile/index",
      //   text: "我的",
      //   iconPath: "assets/icons/tab/profile.png",
      //   selectedIconPath: "assets/icons/tab/profile-active.png",
      // },
      {
        pagePath: "pages/demo/index",
        text: "测试",
        iconPath: "assets/icons/tab/profile.png",
        selectedIconPath: "assets/icons/tab/profile-active.png",
      },
    ],
  },
});
