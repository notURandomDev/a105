import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import {
  Band,
  BandStatus,
  BandWithPositions,
  CreateBandRequest,
} from "@/models/band";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";
import {
  createBandPositions,
  getBandPositionsByBand,
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
  const bands = await getBandsByIDs({
    bandIDs: uniqueBandIDs,
    production: true,
  });
  if (!bands) return;

  return new Map(bands.map((b) => [b._id, b.name]));
};
