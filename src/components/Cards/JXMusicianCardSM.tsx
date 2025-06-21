import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";

interface JXMusicianCardSMProps {
  title?: string;
  emoji?: string;
  leftLabel?: string;
  rightLabel?: string;
}

function JXMusicianCardSM({
  title = "标题",
  emoji = "😃",
  leftLabel = "左侧内容",
  rightLabel,
}: JXMusicianCardSMProps) {
  return (
    <JXCardContainer horizontal style={{ gap: 12, alignItems: "center" }}>
      <JXEmoji size="lg">{emoji}</JXEmoji>
      <View className="container-v grow">
        <JXTitleLabel>{title}</JXTitleLabel>
        <View className="container-h">
          <View className="container-h grow">
            <JXSecondaryLabel>{leftLabel}</JXSecondaryLabel>
          </View>
          {rightLabel && <JXSecondaryLabel>{rightLabel}</JXSecondaryLabel>}
        </View>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCardSM;
