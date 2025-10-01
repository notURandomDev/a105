import { _, db } from "@/cloud/cloudClient";
import { User } from "@/models/user";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult } from "@/utils/database";
import { JxDbCollection, sendJxRequest } from "./shared";

const collection: JxDbCollection = "user";
const usersCollection = db.collection("user");

/* CREATE */

export const createUser = async () => {
  try {
    const res = await usersCollection.add({ data: {} });
    handleDBResult(res, "add", "新建用户记录");
    return res._id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* READ */

type GetUserByOpenid = TcbService<JxReqParamsBase & { openid: string }, User>;

export const getUserByOpenid: GetUserByOpenid = async (params) => {
  const { openid } = params;

  const res = await sendJxRequest<User>({
    collection,
    conditions: [{ name: "openid", field: "_openid", cmd: _.eq(openid) }],
    production: true,
  });

  return res;
};

/* UPDATE */

interface UpdateUserData {
  nickName?: string;
  avatarFileID?: string;
}
export const updateUser = async (
  docId: string | number,
  data: UpdateUserData
) => {
  try {
    const res = await usersCollection.doc(docId).update({ data });
    handleDBResult(res, "update", `根据ID(${docId})更新用户数据`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* DELETE */
