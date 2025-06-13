import { _, db } from "@/cloud/cloudClient";
import { MOCK_BANDS } from "@/constants/database/bands";
import { DB_ERRMSG_OK } from "@/constants/database/config";
import { Band } from "@/models/band";

const bandsCollection = db.collection("band");
/* CREATE */

/* READ */

export const getAllBands = async ({
  production = false,
}: {
  production?: boolean;
} = {}): Promise<Band[] | null> => {
  const QUERY_ALL = "获取全部乐队数据";

  if (!production) return MOCK_BANDS.DEFAULT;

  try {
    const res = await bandsCollection.get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_ALL + `失败：${res.errMsg}`);
    }

    console.log(QUERY_ALL + "成功：", res);
    return res.data as Band[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* UPDATE */
/* DELETE */
