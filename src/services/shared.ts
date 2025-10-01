import { _, db } from "@/cloud/cloudClient";
import { JxReqParamsBase, TcbServiceResult } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";
import { DB } from "@tarojs/taro";

export type JxDbCollection =
  | "band"
  | "band_position"
  | "musician"
  | "application"
  | "reservation";

const JxCollectionConfig: Record<JxDbCollection, string> = {
  band: "乐队",
  band_position: "乐队位置",
  musician: "乐手",
  application: "申请记录",
  reservation: "预约记录",
};

const getCollection = (collection: JxDbCollection) => ({
  dbCollection: db.collection(collection),
  dbName: JxCollectionConfig[collection],
});

type JxDbRequestMode = "default" | "paginated" | "batch";

interface JxLogParams {
  collection: JxDbCollection;
  mode?: JxDbRequestMode | "batched";
  queryEntities?: string[];
  length: number;
  pageIndex?: number;
}

const jxDbLog = (params: JxLogParams) => {
  const { queryEntities, length, mode = "default", pageIndex } = params;
  const { dbName } = getCollection(params.collection);
  const query = queryEntities?.length
    ? `根据[${queryEntities.join(", ")}]`
    : "全量";

  let prefix = `${mode}`;
  const requestCount = pageIndex !== undefined ? pageIndex + 1 : -1;
  if (mode === "batch") {
    prefix = `batch-request-${requestCount}`;
  } else if (mode === "batched") {
    prefix = `batch-requested-${requestCount}-times`;
  }

  return `[${prefix}]${query}获取${length}条${dbName}数据`;
};

const DefaultError = {
  name: "Invalid Request",
  message: "Nothing has been executed",
};

type JxDbMethod = "GET" | "POST" | "DELETE";
type JxDbOrder = { field: string; mode: "asc" | "desc" };
// { bandID: _.in(bandIDs) }
export type JxQueryCondition = {
  name: string;
  field: string;
  cmd: DB.Command.DatabaseQueryCommand;
};

interface JxRequestParams extends JxReqParamsBase {
  collection: JxDbCollection;
  mode?: JxDbRequestMode; // Defaults to `default`
  method?: JxDbMethod; // Defaults to `GET`
  conditions?: JxQueryCondition[];
  order?: JxDbOrder;
  skip?: number;
  production: boolean;
  pageIndex?: number; // 只会在 `paginated` 模式中使用
}

export const sendJxRequest = async <T>(
  params: JxRequestParams
): Promise<TcbServiceResult<T>> => {
  let hasMore = false;

  // 对参数进行解构，赋予默认值
  const { mode = "default", method = "GET" } = params;

  // 如果开启了测试模式，则提前返回
  if (!params.production) return { data: [] as T[], hasMore, error: null };

  // 变量初始化
  let cmd = getCollection(params.collection).dbCollection;
  let queryEntities: string[] = [];

  // 开始构造指令

  // 1. [orderBy] 如果有排序需求，则进行排序
  const order = params.order;
  if (order) cmd = cmd.orderBy(order.field, order.mode);

  // 2. [where] 如果有查询条件，构造 `where` 指令内容
  const conditions = params.conditions;
  if (conditions?.length) {
    console.log("db conditions", conditions);
    const query = conditions.reduce((acc, { field, cmd }) => {
      acc[field] = cmd;
      return acc;
    }, {});
    console.log("db queries", query);
    queryEntities = conditions.map(({ name }) => name);
    cmd = cmd.where(query);
  }

  // 获取日志的固定参数
  const logParams = { collection: params.collection, queryEntities };

  // 进入请求发送阶段
  try {
    // GET Request
    if (method === "GET") {
      // [batch] 批量请求模式
      if (mode === "batch") {
        let pageIndex = 0;
        let data: T[] = [];

        // 循环获取数据，直到获取完最后一页的数据
        while (true) {
          const res = await cmd.skip(PageSize * pageIndex).get();
          const length = res.data.length;
          const log = jxDbLog({
            mode: "batch",
            length,
            pageIndex,
            ...logParams,
          });
          handleDBResult(res, "get", log);
          data.push(...(res.data as T[]));

          if (res.data.length !== PageSize) break;
          pageIndex++;
        }

        // 批量请求完毕，打印总结日志
        const length = data.length;
        console.log(
          jxDbLog({ mode: "batched", length, pageIndex, ...logParams })
        );
        return { data, error: null, hasMore: false };
      }

      // [paginated] 分页请求模式
      else if (mode === "paginated" && params.pageIndex !== undefined) {
        const res = await cmd.skip(PageSize * params.pageIndex).get();
        const length = res.data.length;
        const log = jxDbLog({ mode: "paginated", length, ...logParams });
        handleDBResult(res, "get", log);
        hasMore = res.data.length === PageSize;
        return { data: res.data as T[], hasMore, error: null };
      }

      // [default] 默认执行单页请求模式
      else {
        const res = await cmd.get();
        const log = jxDbLog({ length: res.data.length, ...logParams });
        handleDBResult(res, "get", log);
        return { data: res.data as T[], hasMore, error: null };
      }
    }
    // POST Request
    else if (method === "POST") {
      return { data: [] as T[], error: DefaultError, hasMore };
    }
    // DELETE Request
    else if (method === "DELETE") {
      return { data: [] as T[], error: DefaultError, hasMore };
    }
    // Method not Implemented yet
    else {
      return { data: [] as T[], error: DefaultError, hasMore };
    }
  } catch (error) {
    console.error(error);
    return { data: [] as T[], hasMore, error };
  }
};
