export const DB_OK_CODES: Record<DBMethod, string> = {
  add: "collection.add:ok",
  get: "collection.get:ok",
  update: "document.update:ok",
  remove: "document.remove:ok",
};

type DBMethod = "get" | "add" | "update" | "remove";
export const handleDBResult = <T extends { errMsg: string }>(
  res: T,
  method: DBMethod,
  msg: string
) => {
  if (res.errMsg !== DB_OK_CODES[method]) {
    throw new Error("【API】" + msg + `失败：${res.errMsg}`);
  }

  console.log("(API)" + msg + "成功：", res);
};

export const PageSize = 20;
