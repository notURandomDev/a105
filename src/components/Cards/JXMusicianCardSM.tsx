import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";
import { BandPosition } from "@/models/band-position";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { getYMDfromDate } from "@/utils/DatetimeHelper";

interface JXMusicianCardSMProps {
  musician: BandPosition;
}

function JXMusicianCardSM({ musician }: JXMusicianCardSMProps) {
  const { position, nickname, joinedAt } = musician;
  const { emoji, label } = MUSICIAN_DISPLAY[position];

  return (
    <JXCardContainer horizontal style={{ gap: 12, alignItems: "center" }}>
      <JXEmoji size="lg">{emoji}</JXEmoji>
      <View className="container-v grow">
        <JXTitleLabel>{nickname ?? ""}</JXTitleLabel>
        <View className="container-h">
          <View className="container-h grow">
            <JXSecondaryLabel>{label}</JXSecondaryLabel>
          </View>
          <JXSecondaryLabel>
            {`加入时间：${getYMDfromDate(joinedAt ?? new Date())}`}
          </JXSecondaryLabel>
        </View>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCardSM;
