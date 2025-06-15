import { Text, View } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXTitleLabel from "./Labels/JXTitleLabel";
import JXSecondaryLabel from "./Labels/JXSecondaryLabel";

function JXMusicianCardSM() {
  return (
    <JXCardContainer horizontal style={{ gap: 12, alignItems: "center" }}>
      <Text style={{ fontSize: 28 }}>🎸</Text>
      <View className="container-v">
        <JXTitleLabel>Kyle</JXTitleLabel>
        <JXSecondaryLabel>{`主音吉他手｜加入于：2025-06-12`}</JXSecondaryLabel>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCardSM;
