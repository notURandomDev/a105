import { _, db } from "@/cloud/cloudClient";
import { MOCK_BANDS } from "@/constants/database/bands";

import {
  Band,
  BandStatus,
  BandStatusLog,
  CreateBandRequest,
  UpdateBandRequest,
} from "@/models/band";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult } from "@/utils/database";
import {
  JxDbCollection,
  JxDbRequestMode,
  JxQueryCondition,
  sendJxRequest,
} from "./shared";

const collection: JxDbCollection = "band";
const bandsCollection = db.collection("band");

/* CREATE */

export const createBand = async (
  band: CreateBandRequest
): Promise<string | number | null> => {
  try {
    const bandID = await bandsCollection.add({ data: band });
    handleDBResult(bandID, "add", "创建乐队记录");
    return bandID._id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* READ */

type GetAllBands = TcbService<JxReqParamsBase, Band>;

export const getAllBands: GetAllBands = async (params = {}) => {
  const { production = true } = params;
  const mockData = MOCK_BANDS.active;

  const res = await sendJxRequest<Band>({ collection, production, mockData });
  return res;
};

type GetBandsByField = TcbService<
  JxReqParamsBase & { conditions: JxQueryCondition[]; mode?: JxDbRequestMode },
  Band
>;

export const getBandsByField: GetBandsByField = async (params) => {
  const { conditions, pageIndex, production = true, mode = "default" } = params;

  const res = await sendJxRequest<Band>({
    mode,
    collection,
    production,
    order: { field: "statusUpdatedAt", mode: "desc" },
    conditions,
    pageIndex,
  });

  return res;
};

/* UPDATE */

interface UpdateBandParams {
  bandID: string | number;
  data: UpdateBandRequest;
}

export const updateBand = async ({ bandID, data }: UpdateBandParams) => {
  try {
    const res = await bandsCollection.doc(bandID).update({ data });
    handleDBResult(
      res,
      "update",
      `Payload：【${JSON.stringify(data)}】更新乐队数据`
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* DELETE */
