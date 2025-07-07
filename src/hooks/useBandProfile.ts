import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { BandWithPositions } from "@/models/band";
import { PositionType } from "@/models/position";
import { updateBandPosition } from "@/services/bandPositionService";
import { getBandById, updateBand } from "@/services/bandsService";
import {
  hasMatchingMusicianProfile,
  updateMusicianBandIDs,
} from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { getPositionsByStatus, mergeBandWithPositions } from "@/utils/band";
import { JXToast } from "@/utils/toast";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

export const useBandProfile = () => {
  const [band, setBand] = useState<BandWithPositions | null>(
    MOCK_BANDS_WITH_POSITIONS.recruiting[0]
  );
  const { userInfo } = useUserStore();

  useEffect(() => {
    if (isBandFull() && band?.info._id && band.info.status === "recruiting") {
      const now = new Date();
      updateBand({
        bandID: band.info._id,
        data: {
          formedAt: now,
          status: "active",
          statusLogs: [{ at: now, status: "active" }, ...band.info.statusLogs],
          statusUpdatedAt: now,
        },
      });
    }
  }, [band]);

  const isRecruiting = band?.info.status === "recruiting";

  const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
    band?.positions ?? []
  );

  const fetchBand = async () => {
    if (!band?.info._id) return;

    const bandData = await getBandById({
      _id: band?.info._id,
      production: true,
    });
    if (!bandData) return;

    const bandWithPositions = await mergeBandWithPositions(bandData);
    if (!bandWithPositions) return;

    setBand(bandWithPositions);
  };

  // 检查用户是否有当前类型的乐手档案
  const checkUserIdentity = async (
    position: PositionType
  ): Promise<boolean | undefined> => {
    if (!userInfo?._id) return;

    // 发送请求，传参：当前用户ID、position类型
    const res = await hasMatchingMusicianProfile({
      userID: userInfo._id,
      position,
    });

    return res;
  };

  const joinBand = async (
    bandPositionID: string | number,
    bandID: string | number
  ) => {
    if (!userInfo?.nickName || !userInfo._id) return;

    Taro.showLoading();

    // 更新乐队位置信息（ recruiting -> occupied ）
    const bpRes = await updateBandPosition({
      _id: bandPositionID,
      data: {
        joinedAt: new Date(),
        status: "occupied",
        nickname: userInfo.nickName,
        userID: userInfo._id,
      },
    });

    // 更新乐手所在乐队信息（ bandIDs列表中添加一项 ）
    const mRes = await updateMusicianBandIDs({ _id: userInfo._id, bandID });

    if (!bpRes || !mRes) {
      console.log(`是在这里出了问题：bpRes-${bpRes}; mRes-${mRes}`);
      Taro.hideLoading();
      JXToast.networkError();
      return;
    }

    Taro.hideLoading();
    Taro.showModal({
      title: "操作成功！",
      content: "你已成功加入乐队",
      showCancel: false,
    });
  };

  const isBandFull = () => {
    const isActive = band?.positions.every((bp) => bp.status === "occupied");
    return isActive;
  };

  return {
    band,
    setBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
    fetchBand,
    checkUserIdentity,
    joinBand,
  };
};
