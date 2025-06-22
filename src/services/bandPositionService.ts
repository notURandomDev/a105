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

interface GetBandPositionsByBandParams {
  bandID: string;
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
interface GetBandPositionsByIdParams {
  bandPositionIDs: string[];
  production?: boolean;
}

export const getBandPositionsById = async ({
  bandPositionIDs,
  production = false,
}: GetBandPositionsByIdParams): Promise<BandPosition[] | null> => {
  if (!production)
    return [MOCK_BAND_POSITIONS.occupied[0], ...MOCK_BAND_POSITIONS.recruiting];

  try {
    const res = await Promise.all(
      bandPositionIDs.map((_id) =>
        bandPositionCollection.where({ _id: _.eq(_id) }).get()
      )
    );

    res.map((r) =>
      handleDBResult(r, "get", "根据乐队位置ID获取一系列乐队位置记录")
    );

    return res.flatMap((r) => r.data as BandPosition[]);
  } catch (error) {
    console.error(error);
    return null;
  }
};
