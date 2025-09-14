import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXEmoji from "../JXEmoji";
import JXTitleLabel from "../Labels/JXTitleLabel";
import { Musician } from "@/models/musician";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";

interface JXMusicianSkillCardProps {
  musician: Musician;
}

function JXMusicianSkillCard({ musician }: JXMusicianSkillCardProps) {
  return (
    <JXCardContainer style={{ gap: 8 }}>
      <View className="container-v" style={{ gap: 4 }}>
        <View
          className="container-h grow"
          style={{ alignItems: "center", gap: 12 }}
        >
          <JXEmoji>{MUSICIAN_DISPLAY[musician.position].emoji}</JXEmoji>
          <JXTitleLabel lg>
            {MUSICIAN_DISPLAY[musician.position].label}
          </JXTitleLabel>
        </View>
      </View>

      <JXBodyLabel>{musician.bio}</JXBodyLabel>
    </JXCardContainer>
  );
}

export default JXMusicianSkillCard;
