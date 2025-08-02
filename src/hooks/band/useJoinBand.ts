import { updateBandPosition } from "@/services/bandPositionService";
import { updateMusicianBandIDs } from "@/services/musicianService";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";
import { useUserStore } from "@/stores/userStore";
import { JXToast } from "@/utils/toast";

export const useJoinBand = () => {
  const { userInfo } = useUserStore();
  const { fetchMusicians } = useMusicianStore();
  const { fetchBandPositions } = useBandPositionStore();
  const { fetchBands } = useBandStore();

  // 加入乐队的聚合操作
  const joinBand = async (
    musicianID: string | number,
    bandPositionID: string | number,
    bandID: string | number
  ) => {
    if (!userInfo?.nickName || !userInfo._id) return;

    // 1、更新乐队位置信息（ recruiting -> occupied ）
    const bpRes = await updateBandPosition({
      _id: bandPositionID,
      data: {
        joinedAt: new Date(),
        status: "occupied",
        nickname: userInfo.nickName,
        musicianID,
      },
    });

    // 2、更新乐手所在乐队信息（ bandIDs列表中添加一项 ）
    const mRes = await updateMusicianBandIDs({ _id: musicianID, bandID });

    if (!bpRes || !mRes) {
      JXToast.networkError();
      return;
    }

    // 3、更新全局缓存数据
    await Promise.all([fetchBandPositions(), fetchBands(), fetchMusicians()]);
  };

  return joinBand;
};
