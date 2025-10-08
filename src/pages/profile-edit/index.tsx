import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input } from "@taroify/core";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { updateUser } from "@/services/usersService";
import { JXToast } from "@/utils/toast";

import JXAvatar from "@/components/JXAvatar";
import { getUserAvatarUrl } from "@/utils/user";

interface ProfileForm {
  nickName: string;
  avatarUrl?: string;
}

export default function ProfileEdit() {
  const { userInfo, setUserInfo } = useUserStore();
  const [formData, setFormData] = useState<ProfileForm>({
    nickName: "",
    avatarUrl: undefined,
  });

  useEffect(() => {
    if (!userInfo) return;
    setFormData((prev) => ({ ...prev, nickName: userInfo.nickName ?? "" }));
  }, [userInfo]);

  const handleNicknameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nickName: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!userInfo || formData.nickName === "") return;

    Taro.showLoading();
    // 更新远程 userinfo
    const res = await updateUser(userInfo._id, { nickName: formData.nickName });
    Taro.hideLoading();
    if (!res) {
      JXToast.networkError();
      return;
    }

    // 更新本地 userinfo
    setUserInfo({ ...userInfo, nickName: formData.nickName });

    Taro.showToast({
      title: "保存成功",
      icon: "success",
      success: () => setTimeout(() => Taro.navigateBack(), 500),
    });
  };

  const uploadToCloud = async (filePath: string) => {
    if (!userInfo) return;

    // 1. 将文件上传至云存储
    const cloudRes = await Taro.cloud.uploadFile({
      cloudPath: `avatars/${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      filePath,
    });
    console.log("头像文件成功上传到云端", cloudRes);

    // 获取到头像文件在云存储中的文件ID
    const fileID = cloudRes.fileID;

    // 更新数据库[用户表]中的用户头像文件ID
    await updateUser(userInfo._id, { avatarFileID: fileID });

    const avatarUrl = await getUserAvatarUrl(fileID);
    setFormData((prev) => ({ ...prev, avatarUrl }));
  };

  return (
    <View className="profile-edit config-page">
      <View
        style={{ justifyContent: "center", alignItems: "center", height: 160 }}
        className="container-v"
      >
        <JXAvatar size="lg" shape="rounded" src={formData.avatarUrl}>
          {formData.nickName}
        </JXAvatar>
        <Button
          openType="chooseAvatar"
          onChooseAvatar={(e) => {
            const tempFilePath = e.detail.avatarUrl;
            console.log(tempFilePath);
            uploadToCloud(tempFilePath);
          }}
        >
          选择头像
        </Button>
      </View>
      <Cell.Group inset bordered={false}>
        <Field label="昵称">
          <Input
            onChange={(e) => handleNicknameChange(e.detail.value)}
            type="nickname"
            placeholder="请输入昵称"
            value={formData.nickName}
          />
        </Field>
      </Cell.Group>
      <View className="button-container">
        <Button block color="success" onClick={handleSaveEdit}>
          保存
        </Button>
      </View>
    </View>
  );
}
