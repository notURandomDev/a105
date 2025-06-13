import { Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXCardContainer from "@/components/JXCardContainer";
import { Button } from "@taroify/core";
import JXSecondaryLabel from "@/components/Labels/JXSecondaryLabel";
import { Arrow } from "@taroify/icons";
import { useUserStore } from "@/stores/userStore";
import JXAvatar from "@/components/JXAvatar";

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

  return (
    <View className="profile page" style={{ gap: 16 }}>
      <View style={{ padding: 16 }}>
        <JXCardContainer
          onClick={userInfo ? handleEditProfile : handleLogin}
          horizontal
          style={{ alignItems: "center" }}
        >
          {/* <Avatar src={userInfo ? userInfo.avatarUrl : AVATAR_PLACEHOLDER} /> */}

          <JXAvatar>{userInfo?.nickName}</JXAvatar>
          <View
            className="container-v grow"
            style={{ gap: 0, padding: "0 8px", justifyContent: "center" }}
          >
            <View
              className="container-h"
              style={{ alignItems: "center", gap: 2 }}
            >
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {getFullNickname()}
                {/* <Image height={100} width={100} src={userProfile.avatarUrl} round /> */}
              </Text>
              {!userInfo && <Arrow />}
            </View>
            <JXSecondaryLabel>
              {userInfo ? "你已经登录" : undefined}
            </JXSecondaryLabel>
          </View>
          {/* <Edit color="#bec0c2" size={20} /> */}
        </JXCardContainer>
      </View>
      <View
        className="container-v grow button-container"
        style={{ justifyContent: "flex-end" }}
      >
        {userInfo && (
          <Button
            variant="outlined"
            color="danger"
            block
            onClick={handleLogout}
          >
            退出登录
          </Button>
        )}
      </View>
    </View>
  );
}
