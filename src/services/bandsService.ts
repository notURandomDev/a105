import { _, db } from "@/cloud/cloudClient";
import { MOCK_BANDS } from "@/constants/database/bands";

import { Band, BandStatus, CreateBandInput } from "@/models/band";
import { handleDBResult } from "@/utils/database";
import { DB } from "@tarojs/taro";

const bandsCollection = db.collection("band");
/* CREATE */

interface CreateBandParams {
  band: CreateBandInput;
  production?: boolean;
}
export const createBand = async ({
  band,
  production = false,
}: CreateBandParams): Promise<boolean | null> => {
  if (!production) return true;

  try {
    const res = await bandsCollection.add({ data: band });

    handleDBResult(res, "get", "创建乐队记录");

    return true;
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
  status?: BandStatus;
  production?: boolean;
}
export const getBandsByStatus = async ({
  status,
  production = false,
}: GetBandsByStatusParams = {}): Promise<Band[] | null> => {
  if (!production) return MOCK_BANDS["active"];

  try {
    let res: DB.Query.IQueryResult;
    if (!status) {
      res = await bandsCollection.get();
    } else {
      res = await bandsCollection.where({ status: _.eq(status) }).get();
    }

    handleDBResult(res, "get", "获取乐队数据");
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
/* UPDATE */
/* DELETE */
