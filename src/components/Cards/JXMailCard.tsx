import JXCardContainer from "../JXCardContainer";
import { View } from "@tarojs/components";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXButton from "../JXButton";

export default function JXMailCard() {
  return (
    <View className="container-v" style={{ gap: 4 }}>
      <View
        className="container-h"
        style={{ justifyContent: "center", paddingTop: 4, paddingBottom: 4 }}
      >
        <View className="">
          <JXSecondaryLabel>6/17 13:29</JXSecondaryLabel>
        </View>
      </View>
      <JXCardContainer style={{ gap: 16 }}>
        <View
          className="container-h"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }} className="container-v">
            <JXTitleLabel>Kyle</JXTitleLabel>
            <JXBodyLabel>主音吉他手 🎸</JXBodyLabel>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center" }}
            className="container-h"
          >
            <JXSecondaryLabel>申请加入乐队</JXSecondaryLabel>
          </View>

          <View
            className="container-v"
            style={{ alignItems: "flex-end", flex: 1 }}
          >
            <JXTitleLabel>JOINT</JXTitleLabel>
            <JXBodyLabel>🎸 🥁 🎤</JXBodyLabel>
          </View>
        </View>

        <JXButton>同意</JXButton>
      </JXCardContainer>
    </View>
  );
}
