import Taro from "@tarojs/taro";

export const showToast = {
  success(msg = "操作成功", options?: Taro.showToast.Option) {
    return Taro.showToast({
      ...options,
      title: msg,
      icon: "success",
      duration: 2000,
    });
  },

  error(msg = "操作失败", options?: Taro.showToast.Option) {
    return Taro.showToast({
      ...options,
      title: msg,
      icon: "error",
      duration: 2000,
    });
  },

  info(msg: string, options?: Taro.showToast.Option) {
    return Taro.showToast({
      ...options,
      title: msg,
      icon: "none",
      duration: 2000,
    });
  },
};
