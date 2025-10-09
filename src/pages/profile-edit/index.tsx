import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input } from "@taroify/core";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { updateUser } from "@/services/usersService";
import { JXToast } from "@/utils/toast";

import JXAvatar from "@/components/JXAvatar";
import { ossAvatarUpload } from "@/utils/oss";

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
    if (!userInfo?.nickName || !userInfo.avatarUrl) return;
    setFormData({
      nickName: userInfo.nickName ?? "",
      avatarUrl: userInfo.avatarUrl,
    });
  }, [userInfo]);

  const handleNicknameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, nickName: value }));
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

  const handleAvatarUpload = async (tempFileUrl: string) => {
    if (!userInfo) return;
    Taro.showLoading({ title: "加载中" });

    // 1. 上传头像文件至OSS
    const avatarUrl = await ossAvatarUpload(tempFileUrl);
    if (!avatarUrl) {
      Taro.showToast({ title: "头像更新失败", icon: "error" });
      return;
    }

    // 2. 更新用户表
    const res = await updateUser(userInfo._id, { avatarUrl });
    if (!res) {
      Taro.showToast({ title: "头像更新失败", icon: "error" });
      return;
    }

    Taro.hideLoading();
    Taro.showToast({ title: "头像更新成功", icon: "success" });

    // 3. 更新 userInfo 全局状态，驱动表单数据更新
    setUserInfo({ ...userInfo, avatarUrl });
  };

  return (
    <View className="profile-edit config-page">
      <View
        style={{ justifyContent: "center", alignItems: "center", height: 160 }}
        className="container-v"
      >
        <JXAvatar
          clickable
          size="lg"
          shape="rounded"
          src={formData.avatarUrl}
          onChooseAvatar={(e) => {
            const tempFilePath = e.detail.avatarUrl;
            console.log(tempFilePath);
            handleAvatarUpload(tempFilePath);
          }}
        />
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
