import { View, Text } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXSecondaryLabel from "./Labels/JXSecondaryLabel";
import JXButton from "./JXButton";
import { BandPreview } from "@/models/band";

const JXBandCard = ({ bandInfo }: { bandInfo: BandPreview }) => {
  const { status } = bandInfo;

  return (
    <JXCardContainer style={{ gap: 12 }}>
      <View
        className="container-h grow"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Text style={{ fontWeight: 600, fontSize: 24 }}>JOINT</Text>
        <Text
          style={{
            fontWeight: 600,
            fontSize: 24,
            filter: "grayscale(100%)",
            opacity: 0.5,
          }}
        >
          🎤 🎸 🎸 🎛️ 🎹 🥁
        </Text>
      </View>

      <JXSecondaryLabel>
        JOINT
        诞生于杭州，以撕裂感的吉他音墙为核心，融合Grudge。从地下Livehouse到音乐节舞台，他们的作品像一场失控的午夜公路电影，用音乐探讨都市孤独与少年心气的碰撞。
      </JXSecondaryLabel>

      <View
        className="container-h grow"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <View className="container-v">
          <Text style={{ fontSize: 12 }}>{`乐队风格：${"情绪摇滚"}`}</Text>
          <Text style={{ fontSize: 12 }}>{`成立时间：${"2025-06"}`}</Text>
        </View>
        {status === "recruiting" && <JXButton>加入</JXButton>}
      </View>
    </JXCardContainer>
  );
};

export default JXBandCard;
