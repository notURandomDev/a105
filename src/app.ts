import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { useUserStore } from "./stores/userStore";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("JXNB！");
  });

  // 获取用户全局状态
  const { userInfo } = useUserStore();

  useEffect(() => {
    if (!userInfo) Taro.navigateTo({ url: "/pages/auth/index" });
  }, [userInfo]);

  // children 是将要会渲染的页面
  return children;
}

export default App;
