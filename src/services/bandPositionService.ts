import { _, db } from "@/cloud/cloudClient";
import { MOCK_BAND_POSITIONS } from "@/constants/database/band-positions";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";
import { handleDBResult } from "@/utils/database";

const bandPositionCollection = db.collection("band_position");

// CREATE

interface CreateBandPositionsParams {
  positions: CreateBandPositionInput[];
  bandID: string | number;
}
export const createBandPositions = async ({
  positions,
  bandID,
}: CreateBandPositionsParams) => {
  try {
    const res = await Promise.all(
      positions.map((p) =>
        bandPositionCollection.add({ data: { ...p, bandID } })
      )
    );
    res.map((r) => handleDBResult(r, "add", `添加乐队位置记录`));
    return res.map((r) => r._id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// READ

export const getAllBandPositions = async (): Promise<
  BandPosition[] | undefined
> => {
  try {
    const res = await bandPositionCollection.limit(100).get();
    handleDBResult(res, "get", "获取全部乐队位置(bandPosition)数据");
    return res.data as BandPosition[];
  } catch (error) {
    console.error(error);
  }
};

interface GetBandPositionsByBandParams {
  bandID: string | number;
  production?: boolean;
}
export const getBandPositionsByBand = async ({
  bandID,
  production = false,
}: GetBandPositionsByBandParams): Promise<BandPosition[] | null> => {
  if (!production)
    return [MOCK_BAND_POSITIONS.occupied[0], ...MOCK_BAND_POSITIONS.recruiting];

  try {
    const res = await bandPositionCollection
      .where({
        bandID: _.eq(bandID),
      })
      .get();

    handleDBResult(res, "get", `根据乐队ID(${bandID})获取乐队位置记录`);
    return res.data as BandPosition[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// UPDATE

type UpdateBandPositionData = Pick<
  BandPosition,
  "joinedAt" | "nickname" | "status" | "musicianID"
>;

interface UpdateBandPositionParams {
  _id: string | number;
  data: UpdateBandPositionData;
}

export const updateBandPosition = async ({
  _id,
  data,
}: UpdateBandPositionParams) => {
  try {
    const res = await bandPositionCollection.doc(_id).update({ data });
    handleDBResult(res, "update", `根据ID(${_id})更新乐队位置信息`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
