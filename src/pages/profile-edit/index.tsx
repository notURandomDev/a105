import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input } from "@taroify/core";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { updateUser } from "@/services/usersService";
import { JXToast } from "@/utils/toast";

import JXAvatar from "@/components/JXAvatar";

export default function ProfileEdit() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const { userInfo, setUserInfo } = useUserStore();
  const [formData, setFormData] = useState({
    nickName: "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({ ...prev, nickName: userInfo.nickName ?? "" }));
    }
  }, []);

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

  return (
    <View className="profile-edit config-page">
      <View
        style={{ justifyContent: "center", alignItems: "center", height: 160 }}
        className="container-v"
      >
        <JXAvatar size="large" shape="rounded">
          {formData.nickName}
        </JXAvatar>
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
