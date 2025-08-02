import { View } from "@tarojs/components";
import JXCardContainer from "../../JXCardContainer";
import JXSecondaryLabel from "../../Labels/JXSecondaryLabel";
import JXTitleLabel from "../../Labels/JXTitleLabel";
import { Plus } from "@taroify/icons";
import JXEmoji from "../../JXEmoji";
import { BandPosition } from "@/models/band-position";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { Button } from "@taroify/core";

interface JXMusicianCardRCProps {
  bandPosition: BandPosition;
  onClick?: () => void;
  readonly: boolean;
}

function JXMusicianCardRC({
  bandPosition,
  onClick = () => {},
  readonly = false,
}: JXMusicianCardRCProps) {
  const { position, recruitNote } = bandPosition;
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
      <Button
        disabled={readonly}
        className="container-v cc"
        style={{
          backgroundColor: "#000",
          borderRadius: 50,
          height: 35,
          width: 35,
        }}
      >
        <Plus style={{ zIndex: 2 }} onClick={onClick} color="#fff" />
      </Button>
    </JXCardContainer>
  );
}

export default JXMusicianCardRC;
