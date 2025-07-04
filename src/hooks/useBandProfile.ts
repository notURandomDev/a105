import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { BandWithPositions } from "@/models/band";
import { updateBandPosition } from "@/services/bandPositionService";
import { getBandById, updateBand } from "@/services/bandsService";
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

  const handleJoinBand = async (bandPositionID: string | number) => {
    if (!userInfo?.nickName || !userInfo._id) return;

    Taro.showLoading();
    const res = await updateBandPosition({
      _id: bandPositionID,
      data: {
        joinedAt: new Date(),
        status: "occupied",
        nickname: userInfo.nickName,
        userID: userInfo._id,
      },
    });
    if (!res) {
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

    fetchBand();
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
    handleJoinBand,
  };
};
