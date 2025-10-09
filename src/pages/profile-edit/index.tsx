import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input } from "@taroify/core";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { updateUser } from "@/services/usersService";

import JXAvatar from "@/components/JXAvatar";
import { ossAvatarUpload } from "@/utils/oss";
import { FormItemStatus } from "@/types/ui/shared";

interface ProfileFormItem<T> {
  value: T;
  status: FormItemStatus;
}

interface ProfileForm {
  nickName: ProfileFormItem<string>;
  avatarUrl: ProfileFormItem<string | undefined>;
}

export default function ProfileEdit() {
  const { userInfo, setUserInfo } = useUserStore();
  const [formData, setFormData] = useState<ProfileForm>({
    nickName: { value: "", status: "pristine" },
    avatarUrl: { value: undefined, status: "pristine" },
  });

  useEffect(() => {
    if (!userInfo?.nickName || !userInfo.avatarUrl) return;
    setFormData({
      nickName: { value: userInfo.nickName ?? "", status: "pristine" },
      avatarUrl: { value: userInfo.avatarUrl, status: "pristine" },
    });
  }, [userInfo]);

  const handleNicknameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, nickName: { value, status: "edited" } }));
  };

  const handleAvatarChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: { value, status: "edited" },
    }));
  };

  const isFormValid = () => {
    const { nickName } = formData;
    const isNickNameValid = nickName.value.length;
    return isNickNameValid;
  };

  const isFormEdited = () => {
    const { avatarUrl, nickName } = formData;
    const isAvatarEdited = avatarUrl.status === "edited";
    const isNickNameEdited = nickName.status === "edited";
    return isAvatarEdited || isNickNameEdited;
  };

  const handleSaveEdit = async () => {
    if (!userInfo || !isFormValid()) return;

    const { nickName, avatarUrl } = formData;
    if (nickName.status === "pristine" && avatarUrl.status === "pristine")
      return;

    Taro.showLoading();

    if (nickName.status === "edited") {
      await updateUser(userInfo._id, { nickName: nickName.value });
    }

    if (avatarUrl.status === "edited" && avatarUrl.value) {
      await handleAvatarUpload(avatarUrl.value);
    }

    // 更新本地全局状态
    setUserInfo({
      ...userInfo,
      nickName: nickName.value,
      avatarUrl: avatarUrl.value,
    });

    // 更新远程 userinfo
    Taro.hideLoading();

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
          src={formData.avatarUrl.value}
          onChooseAvatar={(e) => {
            const tempFilePath = e.detail.avatarUrl;
            handleAvatarChange(tempFilePath);
          }}
        />
      </View>
      <Cell.Group inset bordered={false}>
        <Field label="昵称">
          <Input
            onChange={(e) => handleNicknameChange(e.detail.value)}
            type="nickname"
            placeholder="请输入昵称"
            value={formData.nickName.value}
          />
        </Field>
      </Cell.Group>
      <View className="button-container">
        <Button
          disabled={!isFormValid() || !isFormEdited()}
          block
          color="success"
          onClick={handleSaveEdit}
        >
          保存
        </Button>
      </View>
    </View>
  );
}
