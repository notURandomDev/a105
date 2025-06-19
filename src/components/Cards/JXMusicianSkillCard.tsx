import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXEmoji from "../JXEmoji";
import JXTitleLabel from "../Labels/JXTitleLabel";

function JXMusicianSkillCard() {
  return (
    <JXCardContainer style={{ gap: 8 }}>
      <View className="container-v" style={{ gap: 4 }}>
        <View
          className="container-h grow"
          style={{ alignItems: "center", gap: 12 }}
        >
          <JXEmoji>🥁</JXEmoji>
          <JXTitleLabel lg>架子鼓</JXTitleLabel>
        </View>

        <View className="chip-container">
          <JXGenreChip genre="Blues" />
          <JXGenreChip genre="Blues" />
          <JXGenreChip genre="Blues" />
        </View>
      </View>

      <JXBodyLabel>我很喜欢打鼓，如果有兴趣的话可以联系我</JXBodyLabel>
    </JXCardContainer>
  );
}

export default JXMusicianSkillCard;
