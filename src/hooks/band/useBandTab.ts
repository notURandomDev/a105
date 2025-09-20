import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Band } from "@/models/band";
import { getBandsByStatus } from "@/services/bandsService";
import { BandTabKey } from "@/types/components";
import { useUserMusicians } from "../user/useUserMusicians";

export const useBandTab = () => {
  // Tab初始值：活跃乐队
  const [activeBandTabKey, setActiveBandTabKey] =
    useState<BandTabKey>("recruitingBands");
  const [bands, setBands] = useState<Band[]>([]);

  const { userMusicians } = useUserMusicians();

  // 根据类型获取乐队数据
  const fetchBands = async (tabKey: BandTabKey) => {
    let fetchedBands;
    if (tabKey === "activeBands")
      fetchedBands = await getBandsByStatus({ status: "active" });
    if (tabKey === "recruitingBands")
      fetchedBands = await getBandsByStatus({ status: "recruiting" });

    if (fetchedBands) setBands(fetchedBands);
  };

  // 监听乐队Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchBands(activeBandTabKey);
  }, [activeBandTabKey]);

  // 处理创建乐队的函数
  const handleCreateBand = async () => {
    // 获取用户的所有乐手身份
    if (!userMusicians.length) {
      // 如果用户没有任何乐手身份，应该引导用户创建该乐手身份；不能直接更新乐队位置信息
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
    bands,
    fetchBands,
  };
};
