// import * as qiniu from "qiniu-js";

import { getQiniuToken } from "@/services/cloudService";
import { QiniuOptions } from "./qiniuUploader";
import * as qiniuUploader from "./qiniuUploader";

interface UploadToQiniuParams {
  userID: string | number;
  filePath: string;
}

export const uploadToQiniu = async (params: UploadToQiniuParams) => {
  const { userID, filePath } = params;

  // 1. 获取 token
  const cloudRes = await getQiniuToken(userID);
  if (!cloudRes) return;
  const { key, token: uptoken } = cloudRes;

  // 2. 初始化七牛云配置
  const options: QiniuOptions = {
    region: "ECN",
    // key,
    uptoken,
    domain: "http://a105-avatars.bkt.clouddn.com",
  };
  qiniuUploader.init(options);

  // 3. 文件上传操作
  const uploadOptions: qiniuUploader.QiniuUploadOptions = {
    filePath,
    options: null,
    // 上传成功回调
    success: (res) => {
      console.log("[uploadToQiniu] 成功将文件上传至七牛云", res);
    },
    // 上传失败回调
    fail: (res) => {
      console.log("[uploadToQiniu] 向七牛云上传文件失败", res);
    },
    // 上传进度监听回调
    progress: (progress) => {
      console.log("上传进度", progress.progress);
      console.log("已经上传的数据长度", progress.totalBytesSent);
      console.log(
        "预期需要上传的数据总长度",
        progress.totalBytesExpectedToSend
      );
    },
  };
  qiniuUploader.upload(uploadOptions);
};
