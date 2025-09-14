import { _, db } from "@/cloud/cloudClient";
import {
  Application,
  ApplicationStatus,
  CreateApplicationRequest,
} from "@/models/application";
import { handleDBResult } from "@/utils/database";
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

// 通用函数，能够根据字段筛选返回申请记录
export const getApplicationsByField = async (
  field: "applyingBandPositionID" | "applyingMusicianID" | "targetBandID",
  ids: (string | number)[]
): Promise<Application[] | null> => {
  try {
    const res = await applicationCollection.where({ [field]: _.in(ids) }).get();
    handleDBResult(
      res,
      "get",
      `根据字段 ${field} (${ids.length}) 获取 ${res.data.length} 条申请记录数据`
    );
    return res.data as Application[];
  } catch (error) {
    console.error(error);
    return null;
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
