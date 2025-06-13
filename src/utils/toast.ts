import Taro from "@tarojs/taro";

export const JXToast = {
  success(msg = "操作成功") {
    Taro.showToast({
      title: msg,
      icon: "success",
      duration: 2000,
    });
  },

  error(msg = "操作失败") {
    Taro.showToast({
      title: msg,
      icon: "error",
      duration: 2000,
    });
  },

  info(msg: string) {
    Taro.showToast({
      title: msg,
      icon: "none",
      duration: 2000,
    });
  },

  networkError() {
    Taro.showToast({
      title: "网络错误",
      icon: "error",
      duration: 2000,
    });
  },
};
