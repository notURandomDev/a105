import Taro from "@tarojs/taro";

export const getUserAvatarUrl = async (fileID: string) => {
  const res = await Taro.cloud.getTempFileURL({ fileList: [fileID] });
  return res.fileList[0].tempFileURL;
};
