import { _, db } from "@/cloud/cloudClient";
import {
  Application,
  ApplicationStatus,
  CreateApplicationRequest,
} from "@/models/application";
import { JxReqParamsBase, TcbService } from "@/types/service/shared";
import { handleDBResult, PageSize } from "@/utils/database";
import { DB } from "@tarojs/taro";
import { getPaginatedData } from "./shared";

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

type ApplicationRequestField =
  | "applyingBandPositionID"
  | "applyingMusicianID"
  | "targetBandID"
  | "status";

interface GetApplicationsByFieldParams extends JxReqParamsBase {
  // Not all fields in the query need to be used.
  // e.g.: { "targetBandID": [] }
  query: Partial<
    Record<ApplicationRequestField, (ApplicationStatus | string | number)[]>
  >;
}

type GetApplicationsByField = TcbService<
  GetApplicationsByFieldParams,
  Application
>;

// 通用函数，能够根据字段筛选返回申请记录
export const getApplicationsByField: GetApplicationsByField = async (
  params
) => {
  const { query } = params;

  // 逐个添加查询条件：{ [field]: _.in(value) }
  const queryConditions = Object.entries(query).reduce(
    (acc, [field, value]) => {
      acc[field] = _.in(value);
      return acc;
    },
    {} as Record<ApplicationRequestField, DB.Query.IStringQueryCondition>
  );

  return getPaginatedData<Application>({
    apiServiceFn: async (pageIndex: number) => {
      return applicationCollection
        .where(queryConditions)
        .skip(PageSize * pageIndex)
        .orderBy("appliedAt", "desc") // 按申请的时间降序
        .get();
    },
    logEntity: `字段 ${Object.keys(queryConditions).join(", ")}`,
    ...params,
  });
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
