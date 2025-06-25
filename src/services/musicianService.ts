import { _, db } from "@/cloud/cloudClient";
import { MOCK_MUSICIAN_PROFILE } from "@/constants/database/musician";
import {
  CreateMusicianInput,
  Musician,
  UpdateMusicianInput,
} from "@/models/musician";
import { handleDBResult } from "@/utils/database";

const musiciansCollection = db.collection("musician");

interface CreateMusicianParams {
  musicians: CreateMusicianInput[];
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
interface getMusiciansByUserIDParams {
  userID: string | number;
  production?: boolean;
}
export const getMusiciansByUserID = async ({
  userID,
  production = false,
}: getMusiciansByUserIDParams): Promise<Musician[] | undefined> => {
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
    return;
  }
};

// UPDATE

interface UpdateMusiciansParams {
  musicians: UpdateMusicianInput[];
}
export const updateMusicians = async ({
  musicians,
}: UpdateMusiciansParams): Promise<Boolean> => {
  try {
    const res = await Promise.all(
      musicians.map(({ _id, position, bio, genre }) =>
        musiciansCollection.doc(_id).update({ data: { position, bio, genre } })
      )
    );
    res.map((r) => handleDBResult(r, "update", `更新乐手档案数据`));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
