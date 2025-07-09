import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { useUserStore } from "./stores/userStore";
import { useBandStore } from "./stores/bandStore";
import { useBandPositionStore } from "./stores/bandPositionStore";
import { useReservationStore } from "./stores/reservationStore";
import { useMusicianStore } from "./stores/musicianStore";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  const { userInfo } = useUserStore();
  const fetchBands = useBandStore((s) => s.fetchBands);
  const fetchBandPositions = useBandPositionStore((s) => s.fetchBandPositions);
  const fetchReservations = useReservationStore((s) => s.fetchReservations);
  const fetchMusicians = useMusicianStore((s) => s.fetchMusicians);

  useEffect(() => {
    fetchBands();
    fetchBandPositions();
    fetchReservations();
    fetchMusicians();
  }, []);

  useEffect(() => {
    if (!userInfo) Taro.navigateTo({ url: "/pages/auth/index" });
  }, [userInfo]);

  // children 是将要会渲染的页面
  return children;
}

export default App;
