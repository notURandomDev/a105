import { Text, View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";

function JXMusicianCardSM() {
  return (
    <JXCardContainer horizontal style={{ gap: 12, alignItems: "center" }}>
      <Text style={{ fontSize: 28 }}>🎸</Text>
      <View className="container-v grow">
        <JXTitleLabel>Kyle</JXTitleLabel>
        <View
          className="container-h grow"
          style={{ justifyContent: "space-between" }}
        >
          <JXSecondaryLabel>{`主音吉他手`}</JXSecondaryLabel>
          <JXSecondaryLabel>{`加入于：2025-06-12`}</JXSecondaryLabel>
        </View>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCardSM;
