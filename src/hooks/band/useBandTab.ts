import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Band, BandStatus } from "@/models/band";
import { getBandsByStatus } from "@/services/bandsService";
import { BandTabKey } from "@/types/components";
import { useUserMusicians } from "../user/useUserMusicians";
import { usePaginatedData } from "../util/usePaginatedData";

// Tab初始值：活跃乐队
const DefaultBandTabKey = "recruitingBands";

export const useBandTab = () => {
  const [activeBandTabKey, setActiveBandTabKey] =
    useState<BandTabKey>(DefaultBandTabKey);

  const { fetchUserMusicians } = useUserMusicians({ lazyLoad: true });

  const { data: bandsData, fetchPaginatedData } = usePaginatedData<Band>();

  const fetchBands = (autoPagination = false) => {
    return fetchPaginatedData({
      autoPagination,
      fetchFn: (pageIndex: number) => {
        const status = activeBandTabKey.replace("Bands", "") as BandStatus;
        return getBandsByStatus({ status, pageIndex });
      },
    });
  };

  // 监听乐队Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchBands();
  }, [activeBandTabKey]);

  // 处理创建乐队的函数
  const handleCreateBand = async () => {
    // 重新获取用户的所有乐手身份
    const userMusicians = await fetchUserMusicians();
    // 如果用户没有任何乐手身份，应该引导用户创建该乐手身份；不能直接更新乐队位置信息
    if (!userMusicians.length) {
      const res = await Taro.showModal({
        title: "你暂时还没有任何乐手身份",
        content: "请先创建乐手信息",
        confirmText: "前往创建",
      });
      if (res.confirm) Taro.navigateTo({ url: "/pages/musician-edit/index" });
      return;
    }

    // 如果用户有乐手身份，允许创建乐队
    Taro.navigateTo({
      url: "/pages/band-create/index",
    });
  };

  return {
    activeBandTabKey,
    setActiveBandTabKey,
    handleCreateBand,
    bandsData,
    fetchBands,
  };
};
