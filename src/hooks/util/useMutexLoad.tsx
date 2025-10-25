import Taro from "@tarojs/taro";
import { useState } from "react";

interface UseMutexLoadProps {
  // 是否展示 Taro 的 loading 图标，默认关闭
  showLoading?: boolean;
  // 展示 Modal 的配置（详细信息，贴近微信原生体验）
  modalConfig?: Taro.showModal.Option;
  // 展示 Toast 的配置（简要信息）
  toastConfig?: Taro.showToast.Option;
  // fetchFn 执行成功的回调
  onSuccess?: void;
  onError?: void;
  mnemonic?: string;
  result?: boolean;
}

// 简化在获取数据时，对于 `loading` 状态的成对控制；增强状态的原子性
export const useMutexLoad = (props: UseMutexLoadProps = {}) => {
  const { showLoading, modalConfig, toastConfig } = props;

  const [loading, setLoading] = useState(false);

  // 接收一个获取数据的异步回调函数作为参数
  const mutexLoad = async <T,>(fetchFn: () => Promise<T>) => {
    setLoading(true);
    if (showLoading) Taro.showLoading();
    const res = await fetchFn();
    if (showLoading) Taro.hideLoading();
    setLoading(false);
    return res;
  };

  return { loading, mutexLoad };
};
