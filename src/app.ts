import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { useUserStore } from "./stores/userStore";
import { useBandStore } from "./stores/bandStore";
import { useBandPositionStore } from "./stores/bandPositionStore";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  const { userInfo } = useUserStore();
  const fetchBands = useBandStore((s) => s.fetchBands);
  const fetchBandPositions = useBandPositionStore((s) => s.fetchBandPositions);

  useEffect(() => {
    fetchBands();
    fetchBandPositions();
  }, []);

  useEffect(() => {
    if (!userInfo) Taro.navigateTo({ url: "/pages/auth/index" });
  }, [userInfo]);

  // children 是将要会渲染的页面
  return children;
}

export default App;
