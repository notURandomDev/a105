import { _, db } from "@/cloud/cloudClient";
import { MOCK_BAND_ACTIVE, MOCK_BANDS } from "@/constants/database/bands";

import {
  Band,
  BandStatus,
  BandStatusLog,
  CreateBandRequest,
} from "@/models/band";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";

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

interface GetAllBandsParams {
  production?: boolean;
}
export const getAllBands = async ({
  production = true,
}: GetAllBandsParams = {}): Promise<Band[] | undefined> => {
  if (!production) return MOCK_BANDS.active;
  try {
    let pageIndex = 0;
    let bands: Band[] = [];
    while (true) {
      const res =
        (await bandsCollection.skip(PageSize * pageIndex).get()) || [];
      handleDBResult(
        res,
        "get",
        `[batch-request-${pageIndex + 1}]获取到${res.data.length}条乐队数据`
      );
      bands.push(...(res.data as Band[]));

      if (res.data.length !== PageSize) break;

      pageIndex++;
    }

    if (pageIndex) console.log(`批量获取到${bands.length}条乐队数据`);
    return bands;
  } catch (error) {
    console.error(error);
  }
};

interface GetBandsByStatusParams extends JxReqParamsBase {
  status: BandStatus;
}

export type GetBandsByStatus = TcbService<GetBandsByStatusParams, Band>;

export const getBandsByStatus: GetBandsByStatus = async (params) => {
  const { status, production = true, pageIndex = 0 } = params;
  let hasMore = false;
  if (!production) return { data: [] as Band[], hasMore, error: null };

  try {
    const res = await bandsCollection
      .orderBy("statusUpdatedAt", "desc") // 优先展示最新的乐队招募帖子
      .where({ status: _.eq(status) })
      .skip(PageSize * pageIndex)
      .get();

    handleDBResult(
      res,
      "get",
      `根据乐队状态(${status})获取${res.data.length}条乐队数据`
    );

    hasMore = res.data.length === PageSize;
    return { data: res.data as Band[], hasMore, error: null };
  } catch (error) {
    console.error(error);
    return { data: [] as Band[], hasMore, error };
  }
};

interface GetBandByIdParams {
  _id: string | number;
  production?: boolean;
}

export const getBandById = async ({
  _id,
  production = true,
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
  production = true,
  bandIDs,
}: GetBandsByIDsParams): Promise<Band[] | null> => {
  if (!production) return null;
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
    return null;
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
