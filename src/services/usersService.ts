import { _, db } from "@/cloud/cloudClient";
import { User } from "@/models/user";
import { handleDBResult } from "@/utils/database";

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

export const getUserByOpenid = async (openid: string): Promise<User | null> => {
  try {
    const res = await usersCollection.where({ _openid: _.eq(openid) }).get();
    handleDBResult(res, "get", "根据openid获取用户数据");
    return res.data[0] as User;
  } catch (error) {
    console.error(error);
    return null;
  }
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
  const UPDATE_USER = "更新用户数据";
  try {
    const res = await usersCollection.doc(docId).update({ data });
    console.log(UPDATE_USER + "成功：", res);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* DELETE */
