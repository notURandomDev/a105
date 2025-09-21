import { _, db } from "@/cloud/cloudClient";
import {
  Application,
  ApplicationStatus,
  CreateApplicationRequest,
} from "@/models/application";
import { TcbService } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";
import { DB } from "@tarojs/taro";

const applicationCollection = db.collection("application");

// CREATE

export const createApplication = async (
  data: CreateApplicationRequest
): Promise<(string | number) | undefined> => {
  try {
    const res = await applicationCollection.add({ data: { ...data } });
    handleDBResult(res, "add", "新建申请记录");
    return res._id;
  } catch (error) {
    console.error(error);
    return;
  }
};

// READ
export const getAllApplications = async (): Promise<Application[] | null> => {
  try {
    const res = await applicationCollection.get();
    handleDBResult(
      res,
      "get",
      `获取全部申请(application)数据[${res.data.length}条]`
    );
    return res.data as Application[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 根据申请记录的状态，获取申请记录
export const getApplicationsByStatus = async ({
  status,
}: {
  status: ApplicationStatus;
}): Promise<Application[] | null> => {
  try {
    let res: DB.Query.IQueryResult;
    if (!status) {
      res = await applicationCollection.get();
    } else {
      res = await applicationCollection.where({ status: _.eq(status) }).get();
    }
    handleDBResult(res, "get", `根据申请状态(${status})获取申请数据`);
    return res.data as Application[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface GetApplicationsByFieldParams {
  field: "applyingBandPositionID" | "applyingMusicianID" | "targetBandID";
  value: (string | number)[];
  pageIndex: number;
  production?: boolean;
}

type GetApplicationsByField = TcbService<
  GetApplicationsByFieldParams,
  Application[]
>;

// 通用函数，能够根据字段筛选返回申请记录
export const getApplicationsByField: GetApplicationsByField = async (
  params
) => {
  const { field, value, production = true, pageIndex } = params;
  let hasMore = false;
  if (!production) return { data: [] as Application[], hasMore, error: null };
  try {
    const res = await applicationCollection
      .where({ [field]: _.in(value) })
      .skip(PageSize * pageIndex)
      .orderBy("appliedAt", "desc") // 按申请的时间降序
      .get();
    handleDBResult(
      res,
      "get",
      `根据字段 ${field} (${value.length}) 获取 ${res.data.length} 条申请记录数据`
    );

    // 如果返回数据的长度与分页数据限制相同，代表可能有更多数据（也可能刚好没有更多数据了）
    hasMore = Boolean(res.data.length === PageSize);
    console.log("[getApplicationsByField] hasMore:", hasMore);

    return { data: res.data as Application[], hasMore, error: null };
  } catch (error) {
    console.error(error);
    return { data: [] as Application[], hasMore, error };
  }
};

// UPDATE

interface UpdateApplicationParams {
  applicationID: string | number;
  status: ApplicationStatus;
}
export const updateApplicationStatus = async ({
  applicationID,
  status,
}: UpdateApplicationParams) => {
  try {
    const res = await applicationCollection
      .doc(applicationID)
      .update({ data: { status } });
    handleDBResult(res, "update", `更新申请记录状态【${status}】`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
