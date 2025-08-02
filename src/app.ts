import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { useUserStore } from "./stores/userStore";
import { useBandStore } from "./stores/bandStore";
import { useBandPositionStore } from "./stores/bandPositionStore";
import { useReservationStore } from "./stores/reservationStore";
import { useMusicianStore } from "./stores/musicianStore";
import { useApplicationStore } from "./stores/applicationStore";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("JXNB！");
  });

  const { userInfo } = useUserStore();
  const fetchBands = useBandStore((s) => s.fetchBands);
  const fetchBandPositions = useBandPositionStore((s) => s.fetchBandPositions);
  const fetchReservations = useReservationStore((s) => s.fetchReservations);
  const fetchMusicians = useMusicianStore((s) => s.fetchMusicians);
  const fetchApplications = useApplicationStore((s) => s.fetchApplications);

  useEffect(() => {
    fetchBands();
    fetchBandPositions();
    fetchReservations();
    fetchMusicians();
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!userInfo) Taro.navigateTo({ url: "/pages/auth/index" });
  }, [userInfo]);

  // children 是将要会渲染的页面
  return children;
}

export default App;
