import { _, db } from "@/cloud/cloudClient";
import { MOCK_MUSICIAN_PROFILE } from "@/constants/database/musician";
import {
  CreateMusicianRequest,
  Musician,
  UpdateMusicianRequest,
} from "@/models/musician";
import { PositionType } from "@/models/position";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";

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

interface GetAllMusiciansParams {
  production?: boolean;
}
export const getAllMusicians = async ({
  production = false,
}: GetAllMusiciansParams = {}): Promise<Musician[] | undefined> => {
  try {
    if (!production) return [MOCK_MUSICIAN_PROFILE, MOCK_MUSICIAN_PROFILE];

    const res = await musiciansCollection.get();
    handleDBResult(res, "get", `获取全部乐手数据${res.data.length}条`);
    return res.data as Musician[];
  } catch (error) {
    console.error(error);
    return;
  }
};

interface GetMusiciansByUserIDParams {
  userID: string | number;
  production?: boolean;
}
export const getMusiciansByUserID = async ({
  userID,
  production = true,
}: GetMusiciansByUserIDParams): Promise<Musician[] | null> => {
  if (!production) return [MOCK_MUSICIAN_PROFILE];

  try {
    const res = await musiciansCollection.where({ userID: _.eq(userID) }).get();
    handleDBResult(
      res,
      "get",
      `根据用户ID${userID}获取${res.data.length}条乐手档案数据`
    );
    return res.data as Musician[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface GetMusiciansByPositionParams extends JxReqParamsBase {
  positions: PositionType[];
}

export type GetMusiciansByPosition = TcbService<
  GetMusiciansByPositionParams,
  Musician
>;

export const getMusiciansByPositions: GetMusiciansByPosition = async (
  params
) => {
  const { production = true, positions, pageIndex = 0 } = params;
  let hasMore = false;
  if (!production) return { data: [] as Musician[], hasMore, error: null };

  try {
    const res = await musiciansCollection
      .where({ position: _.in(positions) })
      .skip(PageSize * pageIndex)
      .get();

    handleDBResult(
      res,
      "get",
      `根据乐手类型(${positions.toString()})获取${res.data.length}条乐手收据`
    );

    hasMore = res.data.length === PageSize;

    return { data: res.data as Musician[], hasMore, error: null };
  } catch (error) {
    console.error(error);
    return { data: [] as Musician[], hasMore, error };
  }
};

interface GetMatchingMusicianParams {
  userID: string | number;
  position: PositionType;
}

// 返回值：匹配的乐手
export const getMatchingMusician = async ({
  userID,
  position,
}: GetMatchingMusicianParams) => {
  try {
    const res = await musiciansCollection
      .where({
        userID: _.eq(userID),
        position: _.eq(position),
      })
      .get();

    handleDBResult(
      res,
      "get",
      `根据用户ID(${userID})获取${position}类型乐手记录`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return;
  }
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
