import { useBandsByStatus } from "./band/useBandsByStatus";
import { useBandsWithPositions } from "./band/useBandsWithPositions";
import { selectMusiciansByUser } from "@/selectors/musicianSelectors";
import { useMusicianStore } from "@/stores/musicianStore";
import { useUserStore } from "@/stores/userStore";
import Taro from "@tarojs/taro";
import { useBandsWithUser } from "./band/useBandsWithUser";
import { useEffect, useState } from "react";
import { BandWithPositions } from "@/models/band";
import { selectBandsWithPositions } from "@/selectors/bandSelectors";

export const useBandData = () => {
  const activeBands = useBandsWithPositions(useBandsByStatus("active"));
  const recruitingBands = useBandsWithPositions(useBandsByStatus("recruiting"));
  const userBands = useBandsWithUser();

  const [myBands, setMyBands] = useState<BandWithPositions[]>([]);

  useEffect(() => {
    setMyBands(selectBandsWithPositions(userBands));
  }, [userBands]);

  const bandTabData = { myBands, activeBands, recruitingBands };

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
      url: `/pages/band-create/index?musicianID=${musicians[0]._id}`,
    });
  };

  return {
    handleCreateBand,
    bandTabData,
  };
};
