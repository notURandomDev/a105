import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import {
  Band,
  BandStatus,
  BandWithPositions,
  CreateBandRequest,
} from "@/models/band";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";
import { Musician } from "@/models/musician";
import {
  createBandPositions,
  getBandPositionsByBand,
  updateBandPosition,
} from "@/services/bandPositionService";
import {
  createBand,
  getBandsByIDs,
  getBandsByStatus,
} from "@/services/bandsService";
import { updateMusicianBandIDs } from "@/services/musicianService";

export const getPositionsByStatus = (
  positions: CreateBandPositionInput[] | BandPosition[]
) => {
  const recruitingPositions = positions.filter(
    (p) => p.status === "recruiting"
  );
  const occupiedPositions = positions.filter((p) => p.status === "occupied");
  return { recruitingPositions, occupiedPositions };
};

interface GetBandWithPositionsParams {
  status: BandStatus;
  production?: boolean;
}

export const getBandWithPositions = async ({
  status,
  production = false,
}: GetBandWithPositionsParams) => {
  if (!production) return MOCK_BANDS_WITH_POSITIONS[status];

  const bands = await getBandsByStatus({ status, production: true });
  if (!bands) return;

  const bandsWithPositions = await Promise.all(
    bands.map((b) => mergeBandWithPositions(b))
  );

  return bandsWithPositions.filter((bp) => bp !== undefined);
};

interface CreateBandWithPositionsParams {
  positions: CreateBandPositionInput[];
  band: CreateBandRequest;
}

export const createBandWithPositions = async ({
  positions,
  band,
}: CreateBandWithPositionsParams) => {
  // 首先，创建乐队，获取到乐队的ID
  const bandID = await createBand(band);
  if (!bandID) return;

  // 找到乐队创建人的position
  const occupiedPosition = positions.find((p) => p.status === "occupied");
  const creatorMusicianID = occupiedPosition?.musicianID;
  if (!creatorMusicianID) return;

  // 对创建人的乐手身份 bandIDs 字段进行修改 (加入新建的乐队)
  await updateMusicianBandIDs({ _id: creatorMusicianID, bandID });

  // 根据乐队ID，创建乐队位置记录
  await createBandPositions({ positions, bandID });

  return true;
};

// 更加通用的函数（后期提取到云函数中）
// 传入的参数：一个从后端获取的乐队实体
// 逻辑：通过传入的乐队的ID，获取相应的乐队位置信息
// 返回值：BandWithPosition 类型的乐队实体

export const mergeBandWithPositions = async (
  band: Band
): Promise<BandWithPositions | undefined> => {
  const positions = await getBandPositionsByBand({
    bandID: band._id,
    production: true,
  });
  if (!positions) return;

  return { info: band, positions };
};

// 入参：  列表，元素是乐队ID
// 逻辑：  对乐队ID进行去重；建立映射表
// 返回值：映射表｜乐队ID -> 乐队名

type BandNameMap = Map<string | number, string>;
export const getBandNameMap = async (
  bandsIDs: (string | number)[]
): Promise<BandNameMap | undefined> => {
  const uniqueBandIDs = [...new Set(bandsIDs)]; // 乐队ID去重
  const bands = await getBandsByIDs({ bandIDs: uniqueBandIDs });
  if (!bands) return;

  return new Map(bands.map((b) => [b._id, b.name]));
};

// 提取乐手所在的所有乐队ID
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

interface JoinBandParams {
  musicianID: string | number;
  bandPositionID: string | number;
  bandID: string | number;
  userName: string;
}

// 加入乐队的聚合操作
export const joinBand = async ({
  musicianID,
  bandPositionID,
  bandID,
  userName,
}: JoinBandParams) => {
  // 1. [BandPosition] 更新乐队位置信息（ recruiting -> occupied ）
  await updateBandPosition({
    _id: bandPositionID,
    data: {
      joinedAt: new Date(),
      status: "occupied",
      nickname: userName,
      musicianID,
    },
  });
  // 2. [Musician] 更新乐手所在乐队信息（ bandIDs列表中添加一项 ）
  await updateMusicianBandIDs({ _id: musicianID, bandID });
};
