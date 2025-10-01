import { Band, BandStatus, CreateBandRequest } from "@/models/band";
import {
  BandPosition,
  CreateBandPositionRequest,
} from "@/models/band-position";
import { Musician } from "@/models/musician";
import { createBandPositions } from "@/services/bandPositionService";
import { createBand, getBandsByIDs } from "@/services/bandsService";
import { updateMusicianBandIDs } from "@/services/musicianService";

export const getPositionsByStatus = (
  positions: CreateBandPositionRequest[] | BandPosition[]
) => {
  const recruitingPositions = positions.filter(
    (p) => p.status === "recruiting"
  );
  const occupiedPositions = positions.filter((p) => p.status === "occupied");
  return { recruitingPositions, occupiedPositions };
};

interface CreateBandWithPositionsParams {
  positions: CreateBandPositionRequest[];
  band: CreateBandRequest;
}

export const createBandWithPositions = async ({
  positions,
  band,
}: CreateBandWithPositionsParams) => {
  // 1. 创建乐队，获取到乐队的ID
  const bandID = await createBand(band);
  if (!bandID) return;

  // 2. 找到乐队创建人的乐手ID
  //    此处能找到的前提是，picker 只提供用户有的乐手身份
  const occupiedPosition = positions.find((p) => p.status === "occupied");
  const creatorMusicianID = occupiedPosition?.musicianID;
  if (!creatorMusicianID) return;

  // 3. 更新创建人的乐手身份 bandIDs 字段 (加入新建的乐队)
  await updateMusicianBandIDs({ _id: creatorMusicianID, bandID });

  // 4. 根据乐队ID，创建乐队位置记录
  await createBandPositions({ positions, bandID });

  return true;
};

// 提取乐手所在的所有乐队ID(自动去重)
export const extractMusicianBaseBandIDs = (musicians: Musician[]) => [
  ...new Set(musicians.flatMap((b) => b.bandIDs)),
];

// 获取多个乐手所在的不同乐队
// 使用场景：乐手档案｜获取一个用户所在的所有乐队
export const getMusicianBaseBands = async (
  musicians: Musician[]
): Promise<Band[] | null> => {
  // 将乐手数组的 bandIDs 提取出来 (无重叠)
  const uniqueBandIDs = extractMusicianBaseBandIDs(musicians);
  const bands = await getBandsByIDs({ bandIDs: uniqueBandIDs });
  return bands;
};

// 将乐队数组映射成乐队ID数组（默认进行自动去重）
export const mapBandsIntoIds = (bands: Band[]): (string | number)[] => {
  return [...new Set(bands.map((band) => band._id))];
};

// 判断乐队当前是否已经满员（不再有正在招聘中的乐队位置）
export const isBandFull = (bandPositions: BandPosition[]): boolean => {
  return bandPositions.every((bp) => bp.status === "occupied");
};

// 入参：  列表，元素是乐队ID
// 逻辑：  对乐队ID进行去重；建立映射表
// 返回值：映射表｜乐队ID -> 乐队名
type BandNameMap = Map<string | number, string>;
export const generateBandNameMap = (
  bands: Band[],
  bandIDs: (string | number)[]
): BandNameMap => {
  const uniqueBandIDs = [...new Set(bandIDs)]; // 乐队ID去重
  const uniqueBands = bands.filter((b) => uniqueBandIDs.includes(b._id)); // 找到乐队
  return new Map(uniqueBands.map((b) => [b._id, b.name]));
};

// 根据乐队状态查找乐队
export const filterBandsByStatus = (bands: Band[], status: BandStatus) =>
  bands.filter((b) => b.status === status);
