import { BandWithPositions } from "@/models/band";
import { selectPositionsByStatus } from "@/selectors/bandPositionSelectors";
import {
  selectBandByID,
  selectBandsWithPositions,
} from "@/selectors/bandSelectors";
import { updateBand } from "@/services/bandsService";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { useBandStore } from "@/stores/bandStore";
import { useEffect, useState } from "react";

export const useBandProfile = () => {
  const { bands, fetchBands } = useBandStore();
  const { bandPositions } = useBandPositionStore();

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

  return {
    band,
    setBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
    bandID,
    setBandID,
  };
};
