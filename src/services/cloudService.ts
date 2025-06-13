import {
  CLOUD_CODE_ERRMSG_OK,
  CLOUD_OPENID_ERRMSG_OK,
  CLOUD_USER_PROFILE_OK,
} from "@/constants/cloud/config";
import Taro from "@tarojs/taro";

const getLoginCode = async () => {
  const GET_LOGIN_CODE = "获取登录凭证";

  try {
    const res = await Taro.login();

    if (res.errMsg !== CLOUD_CODE_ERRMSG_OK) {
      throw new Error(GET_LOGIN_CODE + `失败：${res.errMsg}`);
    }

    console.log(GET_LOGIN_CODE + "成功：", res);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getOpenid = async () => {
  const GET_OPENID = "获取用户openid";

  try {
    const res = await Taro.cloud.callFunction({
      name: "login",
    });

    if (res.errMsg !== CLOUD_OPENID_ERRMSG_OK) {
      throw new Error(GET_OPENID + `失败：${res.errMsg}`);
    }

    console.log(GET_OPENID + "成功：", res);
    return (res.result as { openid: string }).openid;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getUserProfile = async () => {
  const GET_USER_PROFILE = "获取用户信息";

  try {
    const res = await Taro.getUserProfile({ desc: "用于展示你的信息" });

    if (res.errMsg !== CLOUD_USER_PROFILE_OK) {
      throw new Error(GET_USER_PROFILE + `失败：${res.errMsg}`);
    }

    console.log(GET_USER_PROFILE + "成功：", res);
    return res.userInfo;
  } catch (err) {
    console.error(err);
    return null;
  }
};

interface CloudFileUploadParams {
  cloudPath: string;
  filePath: string;
}
export const uploadCloudFile = async ({ ...params }: CloudFileUploadParams) => {
  const CREATE_CLOUD_FILE = "上传文件至云存储";

  try {
    const res = await Taro.cloud.uploadFile(params);
    console.log(CREATE_CLOUD_FILE + "成功：", res);

    return res.fileID;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCloudFileByID = async (cloudFileID: string) => {
  const GET_CLOUD_FILE = "从云存储获取文件临时URL";

  try {
    const tempFileURL = await Taro.cloud.getTempFileURL({
      fileList: [cloudFileID],
    });
    console.log(GET_CLOUD_FILE + "成功：", tempFileURL);

    return tempFileURL.fileList[0].tempFileURL;
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface QiniuTokenResponse {
  token: string;
  key: string;
}

export const getQiniuToken = async (
  userDocId: string | number
): Promise<QiniuTokenResponse | null> => {
  const GET_QINIU_TOKEN = "从云函数获取七牛token";

  try {
    const res = await Taro.cloud.callFunction({
      name: "getQiniuToken",
      data: {
        fileName: `user/avatar/${userDocId}.png`,
      },
    });

    console.log(GET_QINIU_TOKEN + "成功：", res);
    return res.result as QiniuTokenResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface QiniuFileUploadParams {
  tempLocalFilePath: string;
  token: string;
  key: string;
}
export const uploadFileToQiniu = async ({
  tempLocalFilePath,
  token,
  key,
}: QiniuFileUploadParams) => {
  const UPLOAD_TO_CLOUD = "向七牛云存储上传文件";
  const DOMAIN = "https://sxqhmkn97.hd-bkt.clouddn.com";

  try {
    const res = await Taro.uploadFile({
      url: "https://upload.qiniup.com",
      filePath: tempLocalFilePath,
      name: "file",
      formData: { token, key },
    });

    console.log(UPLOAD_TO_CLOUD + "成功：", res);
    return `${DOMAIN}/${key}`;
  } catch (error) {
    console.error(error);
    return null;
  }
};
