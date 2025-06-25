import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXCardContainer from "@/components/JXCardContainer";
import { Cell } from "@taroify/core";
import JXSecondaryLabel from "@/components/Labels/JXSecondaryLabel";
import { Arrow } from "@taroify/icons";
import { useUserStore } from "@/stores/userStore";
import JXAvatar from "@/components/JXAvatar";
import JXTitleLabel from "@/components/Labels/JXTitleLabel";
import { UserOutlined, CashierOutlined, Revoke } from "@taroify/icons";

export default function Profile() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const { userInfo, clearUserInfo } = useUserStore();

  const getFullNickname = () => {
    if (!userInfo) return "登录/注册";

    return userInfo.nickName ?? "请完善资料";
  };

  const handleLogin = () => {
    console.log("userinfo global state", userInfo);
    Taro.navigateTo({
      url: `/pages/auth/index`,
    });
  };

  const handleLogout = () => clearUserInfo();

  const handleEditProfile = () => {
    Taro.navigateTo({
      url: `/pages/profile-edit/index`,
    });
  };

  const handleEditMusician = () => {
    Taro.navigateTo({
      url: `/pages/musician-edit/index`,
    });
  };

  return (
    <View className="profile page config-page" style={{ gap: 16 }}>
      <View style={{ padding: 16 }}>
        <JXCardContainer
          onClick={userInfo ? handleEditProfile : handleLogin}
          horizontal
          style={{ alignItems: "center" }}
        >
          <JXAvatar>{userInfo?.nickName ?? ""}</JXAvatar>
          <View
            className="container-v grow"
            style={{ gap: 0, padding: "0 8px", justifyContent: "center" }}
          >
            <View
              className="container-h"
              style={{ alignItems: "center", gap: 2 }}
            >
              <JXTitleLabel>{getFullNickname()}</JXTitleLabel>
              {!userInfo && <Arrow />}
            </View>
            <JXSecondaryLabel>
              {userInfo ? "你已经登录" : undefined}
            </JXSecondaryLabel>
          </View>
          {/* <Edit color="#bec0c2" size={20} /> */}
        </JXCardContainer>
      </View>
      <Cell.Group inset bordered={false}>
        <Cell
          onClick={handleEditMusician}
          icon={<UserOutlined />}
          title="编辑乐手档案"
          isLink
        />
        <Cell icon={<CashierOutlined />} title="社费缴纳" isLink />
        {userInfo && (
          <Cell
            icon={<Revoke />}
            title="退出登录"
            isLink
            onClick={handleLogout}
          />
        )}
      </Cell.Group>
    </View>
  );
}
