import { _, db } from "@/cloud/cloudClient";
import { MOCK_BANDS } from "@/constants/database/bands";

import {
  Band,
  BandStatus,
  BandStatusLog,
  CreateBandRequest,
} from "@/models/band";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult } from "@/utils/database";
import { JxDbCollection, sendJxRequest } from "./shared";

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

  const res = await sendJxRequest<Band>({
    mode: "batch",
    collection,
    production,
    mockData: MOCK_BANDS.active,
  });

  return res;
};

export type GetBandsByStatus = TcbService<
  JxReqParamsBase & { status: BandStatus },
  Band
>;

export const getBandsByStatus: GetBandsByStatus = async (params) => {
  const { status, pageIndex, production = true } = params;

  const res = await sendJxRequest<Band>({
    mode: "paginated",
    collection,
    conditions: [{ name: "乐队状态", field: "status", cmd: _.eq(status) }],
    // 优先展示最新的乐队招募帖子
    order: { field: "statusUpdatedAt", mode: "desc" },
    pageIndex,
    production,
  });

  return res;
};

type GetBandsByIDs = TcbService<
  JxReqParamsBase & { bandIDs: (string | number)[] },
  Band
>;

export const getBandsByIDs: GetBandsByIDs = async (params) => {
  const { production = true, bandIDs } = params;

  const res = await sendJxRequest<Band>({
    collection,
    conditions: [{ name: "乐队ID", field: "_id", cmd: _.in(bandIDs) }],
    production,
  });

  return res;
};

/* UPDATE */

interface UpdateBandData {
  status?: BandStatus;
  statusLogs?: BandStatusLog[];
  statusUpdatedAt?: Date;
  formedAt?: Date;
}

interface UpdateBandParams {
  bandID: string | number;
  data: UpdateBandData;
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
