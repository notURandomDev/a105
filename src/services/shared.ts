import { JxReqParamsBase } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";
import { DB } from "@tarojs/taro";

interface GetPaginatedDataParams extends JxReqParamsBase {
  apiServiceFn: (pageIndex: number) => Promise<DB.Query.IQueryResult>;
  logEntity: string;
}

export const getPaginatedData = async <R>(params: GetPaginatedDataParams) => {
  const { production = true, pageIndex = 0, apiServiceFn, logEntity } = params;
  let hasMore = false;
  if (!production) return { data: [] as R[], hasMore, error: null };

  try {
    const res = await apiServiceFn(pageIndex);
    handleDBResult(
      res,
      "get",
      `根据${logEntity}获取${res.data.length}条乐队数据`
    );
    hasMore = res.data.length === PageSize;
    return { data: res.data as R[], hasMore, error: null };
  } catch (error) {
    console.error(error);
    return { data: [] as R[], hasMore, error };
  }
};
