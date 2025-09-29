import { useState } from "react";

// 简化在获取数据时，对于 `loading` 状态的成对控制；增强状态的原子性
export const useMutexLoad = () => {
  const [loading, setLoading] = useState(false);

  // 接收一个获取数据的异步回调函数作为参数
  const mutexLoad = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    await fetchFn();
    setLoading(false);
  };

  return { loading, mutexLoad };
};
