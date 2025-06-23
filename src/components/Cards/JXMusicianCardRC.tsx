import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import { Plus } from "@taroify/icons";
import JXEmoji from "../JXEmoji";
import { BandPosition } from "@/models/band-position";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";

interface JXMusicianCardRCProps {
  musician: BandPosition;
  onClick?: () => void;
}

function JXMusicianCardRC({
  musician,
  onClick = () => {},
}: JXMusicianCardRCProps) {
  const { position, recruitNote } = musician;
  const { emoji, label } = MUSICIAN_DISPLAY[position];

  return (
    <JXCardContainer horizontal className="center-v" style={{ gap: 12 }}>
      <View className="container-v grow">
        <View className="container-h center-v" style={{ gap: 10 }}>
          <JXEmoji size="md">{emoji}</JXEmoji>
          <JXTitleLabel>{label}</JXTitleLabel>
        </View>
        <JXSecondaryLabel>{recruitNote}</JXSecondaryLabel>
      </View>
      <View
        onClick={onClick}
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
