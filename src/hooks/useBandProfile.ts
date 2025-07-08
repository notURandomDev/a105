import { BandWithPositions } from "@/models/band";
import { Musician } from "@/models/musician";
import { PositionType } from "@/models/position";
import { selectPositionsByStatus } from "@/selectors/bandPositionSelectors";
import {
  selectBandByID,
  selectBandsWithPositions,
} from "@/selectors/bandSelectors";
import { updateBandPosition } from "@/services/bandPositionService";
import { updateBand } from "@/services/bandsService";
import {
  getMatchingMusician,
  updateMusicianBandIDs,
} from "@/services/musicianService";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { useBandStore } from "@/stores/bandStore";
import { useUserStore } from "@/stores/userStore";
import { JXToast } from "@/utils/toast";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

export const useBandProfile = () => {
  const { userInfo } = useUserStore();
  const { bands, fetchBands } = useBandStore();
  const { bandPositions, fetchBandPositions } = useBandPositionStore();

  const [bandID, setBandID] = useState<string | number | null>(null);
  const [band, setBand] = useState<BandWithPositions | null>(null);

  const recruitingPositions = selectPositionsByStatus(
    band?.positions ?? [],
    "recruiting"
  );
  const occupiedPositions = selectPositionsByStatus(
    band?.positions ?? [],
    "occupied"
  );

  useEffect(() => {
    // 用户加入乐队后，判断当前乐队的状态是否需要更新
    updateBandStatus();
  }, [band]);

  useEffect(() => {
    if (!bandID || !bands) return;

    // 从所有乐队缓存中，根据ID获取到当前页面乐队的数据
    const currentBand = selectBandByID(bands, bandID);
    if (!currentBand) return;

    // 转换成带有乐队位置的加强乐队类型
    const bandWithPositions = selectBandsWithPositions([currentBand]);
    setBand(bandWithPositions[0]);
  }, [bandID, bands, bandPositions]);

  const isRecruiting = band?.info.status === "recruiting";

  // 判断当前乐队的状态是否为 active
  const isBandFull = () => {
    const isActive = band?.positions.every((bp) => bp.status === "occupied");
    return isActive;
  };

  // 判断并更新乐队状态为 active
  const updateBandStatus = async () => {
    if (isBandFull() && band?.info._id && band.info.status === "recruiting") {
      const now = new Date();
      await updateBand({
        bandID: band.info._id,
        data: {
          formedAt: now,
          status: "active",
          statusLogs: [{ at: now, status: "active" }, ...band.info.statusLogs],
          statusUpdatedAt: now,
        },
      });
      fetchBands();
    }
  };

  // 检查用户是否有当前类型的乐手档案
  const checkUserIdentity = async (
    position: PositionType
  ): Promise<Musician | undefined> => {
    if (!userInfo?._id) return;

    // 发送请求，传参：当前用户ID、position类型
    const res = await getMatchingMusician({
      userID: userInfo._id,
      position,
    });

    if (!res) return;
    return res[0] as Musician;
  };

  // 加入乐队的聚合操作
  const joinBand = async (
    musicianID: string | number,
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
    const mRes = await updateMusicianBandIDs({ _id: musicianID, bandID });

    if (!bpRes || !mRes) {
      Taro.hideLoading();
      JXToast.networkError();
      return;
    }

    await Promise.all([fetchBandPositions(), fetchBands()]);

    Taro.hideLoading();
    Taro.showModal({
      title: "操作成功！",
      content: "你已成功加入乐队",
      showCancel: false,
    });
  };

  return {
    band,
    setBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
    checkUserIdentity,
    joinBand,
    bandID,
    setBandID,
  };
};
