import { BandWithPositions } from "@/models/band";
import { useState } from "react";
import { useBandsByStatus } from "./band/useBandsByStatus";
import { useBandsWithPositions } from "./band/useBandsWithPositions";
import { selectMusiciansByUser } from "@/selectors/musicianSelectors";
import { useMusicianStore } from "@/stores/musicianStore";
import { useUserStore } from "@/stores/userStore";
import Taro from "@tarojs/taro";

export const useBandData = () => {
  const activeBands = useBandsWithPositions(useBandsByStatus("active"));
  const recruitingBands = useBandsWithPositions(useBandsByStatus("recruiting"));

  const [myBands, setMyBands] = useState<BandWithPositions[]>([]);

  // to-do
  // 根据用户id，获取用户所在的乐队

  const handleCreateBand = async () => {
    const allMusicians = useMusicianStore.getState().musicians;
    const userInfo = useUserStore.getState().userInfo;
    if (!userInfo) return;
    const musicians = selectMusiciansByUser(allMusicians, userInfo?._id);
    if (!musicians.length) {
      // 如果用户没有任何乐手身份，应该引导用户创建该乐手身份；不能直接更新乐队位置信息
      const res = await Taro.showModal({
        title: "你暂时还没有任何乐手身份",
        content: "请先创建乐手信息",
        confirmText: "前往创建",
      });
      if (res.confirm) Taro.navigateTo({ url: "/pages/musician-edit/index" });
      return;
    }

    Taro.navigateTo({
      url: `/pages/band-create/index?position=${musicians[0].position}`,
    });
  };

  return {
    myBands,
    activeBands,
    recruitingBands,
    handleCreateBand,
  };
};
