import Taro from "@tarojs/taro";

Taro.cloud.init({
  env: process.env.TARO_CLOUD_ENV_ID, // 当前的云开发环境 ID
});

export const db = Taro.cloud.database();
export const _ = db.command;
