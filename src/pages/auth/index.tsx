import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { Button, Image } from "@taroify/core";
import { useUserStore } from "@/stores/userStore";
import { createUser, getUserByOpenid } from "@/services/usersService";
import { JXToast } from "@/utils/toast";
import { getOpenid } from "@/services/cloudService";

export default function Auth() {
  const { setUserInfo } = useUserStore();

  const signUserUp = async () => {
    const docId = await createUser();
    if (!docId) return;

    Taro.hideLoading();
    return docId;
  };

  const handleDismiss = () => {
    Taro.navigateBack();
  };

  const handleAuth = async () => {
    const openid = await getOpenid(); // 获取用户openid
    if (!openid) {
      JXToast.networkError();
      return;
    }

    // 获取用户数据
    Taro.showLoading();
    const { data: user } = await getUserByOpenid({ openid });
    if (!user.length) {
      // 用户不存在，说明未注册
      const docId = await signUserUp();
      if (!docId) {
        Taro.hideLoading();
        JXToast.networkError();
        return; // 提前退出
      }

      // 只初始化 docId 字段
      setUserInfo({
        _id: docId,
        avatarUrl: null,
        nickName: null,
      });
    } else {
      // 用户已注册，根据返回的用户数据初始化全局 userInfo
      setUserInfo(user[0]);
    }

    Taro.hideLoading();
    setTimeout(() => Taro.navigateBack(), 500);
  };

  return (
    <View className="auth page">
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "100px 0",
          gap: 24,
        }}
        className="container-v"
      >
        <Image
          round
          height={145}
          width={145}
          src={require("../../../assets/Black-4096x4096.png")}
        />
        <Text style={{ fontWeight: 500, fontSize: 20 }}>欢迎登录杭电吉协</Text>
      </View>
      <View
        className="container-v grow button-container"
        style={{ justifyContent: "flex-end", gap: 12 }}
      >
        <Button
          onClick={handleAuth}
          variant="text"
          block
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          微信一键登录
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outlined"
          style={{ borderColor: "#000" }}
        >
          暂不登录
        </Button>
      </View>
    </View>
  );
}
