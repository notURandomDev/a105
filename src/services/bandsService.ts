import { _, db } from "@/cloud/cloudClient";
import {
  MOCK_BAND_ACTIVE,
  MOCK_BAND_RECRUITING,
  MOCK_BANDS,
} from "@/constants/database/bands";

import {
  Band,
  BandStatus,
  BandStatusLog,
  CreateBandInput,
} from "@/models/band";
import { handleDBResult } from "@/utils/database";
import { DB } from "@tarojs/taro";

const bandsCollection = db.collection("band");
/* CREATE */

export const createBand = async (
  band: CreateBandInput
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

interface GetAllBandsParams {
  production?: boolean;
}
export const getAllBands = async ({
  production = false,
}: GetAllBandsParams = {}): Promise<Band[] | null> => {
  if (!production) return MOCK_BANDS.active;
  try {
    const res = await bandsCollection
      .where({ status: _.eq("recruiting") })
      .get();

    handleDBResult(res, "get", "获取全部乐队数据");

    return res.data as Band[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface GetBandsByStatusParams {
  status: BandStatus;
  production?: boolean;
}
export const getBandsByStatus = async ({
  status,
  production = false,
}: GetBandsByStatusParams): Promise<Band[] | null> => {
  if (!production) return MOCK_BANDS[status];

  try {
    let res: DB.Query.IQueryResult;
    if (!status) {
      res = await bandsCollection.get();
    } else {
      res = await bandsCollection.where({ status: _.eq(status) }).get();
    }

    handleDBResult(res, "get", `根据乐队状态(${status})获取乐队数据`);
    return res.data as Band[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface GetMyBandsParams {
  userID: string;
  production?: boolean;
}

const getBandsByUserId = () => {};

interface GetBandByIdParams {
  _id: string | number;
  production?: boolean;
}

export const getBandById = async ({
  _id,
  production = false,
}: GetBandByIdParams): Promise<Band | undefined> => {
  if (!production) return MOCK_BAND_ACTIVE;

  try {
    const res = await bandsCollection.where({ _id: _.eq(_id) }).get();
    handleDBResult(res, "get", `根据乐队ID(${_id})获取乐队数据`);
    return res.data[0] as Band;
  } catch (error) {
    console.error(error);
  }
};

interface GetBandsByIDsParams {
  production?: boolean;
  bandIDs: (string | number)[];
}
export const getBandsByIDs = async ({
  production,
  bandIDs,
}: GetBandsByIDsParams): Promise<Band[] | undefined> => {
  if (!production) return;
  try {
    const res = await bandsCollection.where({ _id: _.in(bandIDs) }).get();
    handleDBResult(
      res,
      "get",
      `根据乐队ID(${bandIDs.length})获取${res.data.length}条乐队数据`
    );
    return res.data as Band[];
  } catch (error) {
    console.error(error);
    return;
  }
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
    handleDBResult(res, "update", "更新乐队数据");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* DELETE */
