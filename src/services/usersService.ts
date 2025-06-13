import { _, db } from "@/cloud/cloudClient";
import { DB_ERRMSG_OK } from "@/constants/database/config";
import { User } from "@/models/user";

const usersCollection = db.collection("user");

/* CREATE */

export const createUser = async () => {
  try {
    const res = await usersCollection.add({ data: {} });
    console.log("新建了用户记录", res);
    return res._id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* READ */

export const getUserByOpenid = async (openid: string): Promise<User | null> => {
  const QUERY_OPENID = "根据openid获取用户数据";
  try {
    const res = await usersCollection.where({ _openid: _.eq(openid) }).get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_OPENID + `失败：${res.errMsg}`);
    }

    console.log(QUERY_OPENID + "成功：", res);
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

    // if (res.errMsg !== DB_ERRMSG_OK) {
    //   throw new Error(UPDATE_USER + `失败：${res.errMsg}`);
    // }

    console.log(UPDATE_USER + "成功：", res);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* DELETE */
