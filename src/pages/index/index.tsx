import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXTitleLabel from "@/components/Labels/JXTitleLabel";
import JXCardContainer from "@/components/JXCardContainer";
import JXSecondaryLabel from "@/components/Labels/JXSecondaryLabel";
import { useUserStore } from "@/stores/userStore";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const { userInfo } = useUserStore();

  return (
    <View className="index page">
      <View
        className="container-v"
        style={{
          backgroundColor: "#000",
          width: 125,
          height: 125,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 56 }}>
          {userInfo?.nickName ? userInfo?.nickName[0].toUpperCase() : "?"}
        </Text>
      </View>

      <View style={{ padding: "16px 0" }}>
        <Text style={{ fontWeight: 600, fontSize: 40 }}>我的排练预约</Text>
      </View>
      <View className="grow">
        <JXCardContainer>
          <JXTitleLabel>{`${"6月15日"}｜${"21:00-23:00"}`}</JXTitleLabel>
          <JXSecondaryLabel>if we could stay</JXSecondaryLabel>
        </JXCardContainer>
      </View>
    </View>
  );
}
