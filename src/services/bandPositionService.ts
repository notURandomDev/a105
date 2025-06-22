import { db } from "@/cloud/cloudClient";
import { CreateBandPositionInput } from "@/models/band-position";
import { handleDBResult } from "@/utils/database";

const bandPositionCollection = db.collection("band_position");

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
