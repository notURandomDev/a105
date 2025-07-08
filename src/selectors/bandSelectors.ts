import { Band, BandStatus } from "@/models/band";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { selectPositionsByBand } from "./bandPositionSelectors";

export const selectBandsByStatus = (bands: Band[], status: BandStatus) =>
  bands.filter((b) => b.status === status);

export const selectBandByID = (bands: Band[], bandID: string | number) =>
  bands.find((b) => b._id === bandID);

// 逻辑与 useBandsWithPositions 相同，区别在于该函数返回的值是非响应式快照数据
export const selectBandsWithPositions = (bands: Band[]) => {
  if (!bands) return [];
  const bandPositions = useBandPositionStore.getState().bandPositions;
  const bandsWithPositions = bands.map((band) => {
    const positions = selectPositionsByBand(bandPositions, band._id);
    return { info: band, positions };
  });
  return bandsWithPositions;
};
