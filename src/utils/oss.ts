import Taro from "@tarojs/taro";

interface GetOssSignatureRes {
  accessid: string;
  host: string;
  policy: string;
  signature: string;
  dir: string;
  expire: number;
}

interface OssAvatarUpload {
  (filePath: string): Promise<string | null>;
}

export const ossAvatarUpload: OssAvatarUpload = async (filePath) => {
  // 1. 调用云函数，获取OSS凭证
  const cloudRes = await Taro.cloud.callFunction({ name: "getOssSignature" });
  console.log("云函数调用成功：", cloudRes);

  const data = cloudRes.result as GetOssSignatureRes;
  const fileName = `${data.dir}${Date.now()}.jpeg`;

  // 2. 上传文件至OSS
  try {
    const uploadRes = await Taro.uploadFile({
      url: data.host,
      filePath,
      name: "file",
      formData: {
        key: fileName,
        policy: data.policy,
        OSSAccessKeyId: data.accessid,
        signature: data.signature,
        success_action_status: "200",
      },
    });
    if (uploadRes.errMsg !== "uploadFile:ok") return null;
    // 如果响应 uploadFile:ok，返回头像URL

    const avatarUrl = `${data.host}/${fileName}`;

    console.log("文件上传至OSS成功", uploadRes);
    console.log("上传成功:", avatarUrl);

    return avatarUrl;
  } catch (error) {
    console.error("上传失败:", error);
    return null;
  }
};
