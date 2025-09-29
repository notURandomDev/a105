import { usePageScroll } from "@tarojs/taro";
import { useState } from "react";
import { useMutexLoad } from "./useMutexLoad";

// 简化了 pullRefresh 必须用到状态的样板代码
export const usePullRefresh = () => {
  // 在 useMutexLoad 基础上进行了进一步封装
  const { loading: pullRefreshing, mutexLoad: mutexPullRefresh } =
    useMutexLoad();

  const [reachTop, setReachTop] = useState(true);
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  return { reachTop, mutexPullRefresh, pullRefreshing };
};
