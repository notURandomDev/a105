import { Band, BandStatus } from "@/models/band";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { selectPositionsByBand } from "./bandPositionSelectors";
import { Musician } from "@/models/musician";
import { selectMusiciansByUser } from "./musicianSelectors";

// 根据乐队状态查找乐队
export const selectBandsByStatus = (bands: Band[], status: BandStatus) =>
  bands.filter((b) => b.status === status);

// 根据乐队ID查找乐队
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

export const selectBandNamesByIDs = (
  bands: Band[],
  bandIDs: (string | number)[]
): Map<string | number, string> => {
  const uniqueBandIDs = [...new Set(bandIDs)]; // 乐队ID去重
  const uniqueBands = bands.filter((b) => uniqueBandIDs.includes(b._id)); // 找到乐队
  return new Map(uniqueBands.map((b) => [b._id, b.name]));
};

// 根据乐手信息获取到所有匹配的乐队
export const selectBandsByMusicians = (
  bands: Band[],
  musicians: Musician[]
) => {
  // 将乐手数组的 bandIDs 提取出来 (无重叠)
  const uniqueBandIDs = new Set(musicians.flatMap((b) => b.bandIDs));
  const uniqueBands = bands.filter((b) => uniqueBandIDs.has(b._id));
  return uniqueBands;
};

// 根据用户信息匹配用户所在的所有乐队
export const selectBandsByUserID = (
  userID: string | number,
  musicians: Musician[],
  bands: Band[]
) => {
  const userMusicians = selectMusiciansByUser(musicians, userID);
  const userBands = selectBandsByMusicians(bands, userMusicians);
  return userBands;
};
