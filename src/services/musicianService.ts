import { _, db } from "@/cloud/cloudClient";
import { MOCK_MUSICIAN_PROFILE } from "@/constants/database/musician";
import {
  CreateMusicianRequest,
  Musician,
  UpdateMusicianRequest,
} from "@/models/musician";
import { PositionType } from "@/models/position";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult } from "@/utils/database";
import { JxDbCollection, sendJxRequest } from "./shared";

const collection: JxDbCollection = "musician";
const musiciansCollection = db.collection("musician");

interface CreateMusicianParams {
  musicians: CreateMusicianRequest[];
}

// CREATE

export const createMusicians = async ({ musicians }: CreateMusicianParams) => {
  try {
    const res = await Promise.all(
      musicians.map((mp) => musiciansCollection.add({ data: mp }))
    );
    res.map((r) => handleDBResult(r, "add", "添加乐手档案信息"));
    return res.map((r) => r._id);
  } catch (error) {
    console.error(error);
    return;
  }
};

// READ

type GetMusiciansByUserID = TcbService<
  JxReqParamsBase & { userID: string | number },
  Musician
>;

export const getMusiciansByUserID: GetMusiciansByUserID = async (params) => {
  const { userID, production = true } = params;

  const res = await sendJxRequest<Musician>({
    collection,
    conditions: [{ name: "用户ID", field: "userID", cmd: _.eq(userID) }],
    production,
    mockData: [MOCK_MUSICIAN_PROFILE],
  });

  return res;
};

export type GetMusiciansByPosition = TcbService<
  JxReqParamsBase & { positions: PositionType[] },
  Musician
>;

export const getMusiciansByPositions: GetMusiciansByPosition = async (
  params
) => {
  const { positions, pageIndex, production = true } = params;

  const res = await sendJxRequest<Musician>({
    mode: "paginated",
    collection,
    conditions: [{ name: "乐手类型", field: "position", cmd: _.in(positions) }],
    // 优先展示最新的乐队招募帖子
    order: { field: "statusUpdatedAt", mode: "desc" },
    pageIndex,
    production,
  });

  return res;
};

// UPDATE

interface UpdateMusiciansParams {
  musicians: UpdateMusicianRequest[];
}
export const updateMusicians = async ({
  musicians,
}: UpdateMusiciansParams): Promise<Boolean> => {
  try {
    const res = await Promise.all(
      musicians.map(({ _id, position, bio }) =>
        musiciansCollection.doc(_id).update({ data: { position, bio } })
      )
    );
    res.map((r) => handleDBResult(r, "update", `更新乐手档案数据`));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

interface UpdateMusicianBandIDsParams {
  _id: string | number;
  bandID: string | number;
}
export const updateMusicianBandIDs = async ({
  _id,
  bandID,
}: UpdateMusicianBandIDsParams): Promise<boolean | undefined> => {
  try {
    const res = await musiciansCollection
      .doc(_id)
      .update({ data: { bandIDs: _.push(bandID) } });

    handleDBResult(
      res,
      "update",
      `根据乐手ID(${_id})更新乐手所在乐队ID字段|push(${bandID})`
    );

    if (!res) return false;

    return true;
  } catch (error) {
    console.error(error);
  }
};
