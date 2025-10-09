"use strict";

// https://help.aliyun.com/zh/oss/wechat-applet-uploads-files-directly-to-oss#ec8c966235ibx

const crypto = require("crypto");

exports.main = async (event) => {
  const { dir = "avatars/" } = event;

  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const host = "https://a105.oss-cn-hangzhou.aliyuncs.com";

  const expireTime = 30; // 有效期 30 秒
  const policyText = {
    expiration: new Date(Date.now() + expireTime * 1000).toISOString(),
    conditions: [["starts-with", "$key", dir]],
  };

  const policy = Buffer.from(JSON.stringify(policyText)).toString("base64");
  const signature = crypto
    .createHmac("sha1", accessKeySecret)
    .update(policy)
    .digest("base64");

  return {
    accessid: accessKeyId,
    host,
    policy,
    signature,
    dir,
    expire: Math.floor(Date.now() / 1000) + expireTime,
  };
};
