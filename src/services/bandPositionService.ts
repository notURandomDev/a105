import { _, db } from "@/cloud/cloudClient";
import { MOCK_BAND_POSITIONS } from "@/constants/database/band-positions";
import {
  BandPosition,
  CreateBandPositionRequest,
} from "@/models/band-position";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult } from "@/utils/database";
import { JxDbCollection, sendJxRequest } from "./shared";

const collection: JxDbCollection = "band_position";
const bandPositionCollection = db.collection("band_position");

// CREATE

interface CreateBandPositionsParams {
  positions: CreateBandPositionRequest[];
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

type GetBandPositionsByBand = TcbService<
  JxReqParamsBase & { bandID: string | number },
  BandPosition
>;

export const getBandPositionsByBand: GetBandPositionsByBand = async (
  params
) => {
  const { production = true, bandID } = params;

  const res = await sendJxRequest<BandPosition>({
    collection,
    conditions: [{ name: "乐队ID", field: "bandID", cmd: _.eq(bandID) }],
    production,
    mockData: [
      MOCK_BAND_POSITIONS.occupied[0],
      ...MOCK_BAND_POSITIONS.recruiting,
    ],
  });

  return res;
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
