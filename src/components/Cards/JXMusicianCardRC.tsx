import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import { Plus } from "@taroify/icons";
import JXEmoji from "../JXEmoji";

function JXMusicianCardRC() {
  return (
    <JXCardContainer horizontal className="center-v" style={{ gap: 12 }}>
      <View className="container-v grow">
        <View className="container-h center-v" style={{ gap: 4 }}>
          <JXEmoji size="md">🥁</JXEmoji>
          <JXTitleLabel>{"鼓手"}</JXTitleLabel>
        </View>
        <JXSecondaryLabel>
          {
            "这是一串招募信息，招募的乐手应该符合这些条件;这是一串招募信息，招募的乐手应该符合这些条件"
          }
        </JXSecondaryLabel>
      </View>
      <View
        className="container-v cc"
        style={{
          backgroundColor: "#000",
          borderRadius: 50,
          padding: 8,
        }}
      >
        <Plus color="#fff" />
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCardRC;
