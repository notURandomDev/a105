import { _, db } from "@/cloud/cloudClient";
import {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
} from "@/models/application";
import { handleDBResult } from "@/utils/database";

const applicationCollection = db.collection("application");

// CREATE

export const createApplication = async (
  data: CreateApplicationInput
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
export const getAllApplications = async (): Promise<
  Application[] | undefined
> => {
  try {
    const res = await applicationCollection.limit(100).get();
    handleDBResult(
      res,
      "get",
      `获取全部申请(application)数据[${res.data.length}条]`
    );
    return res.data as Application[];
  } catch (error) {
    console.error(error);
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
