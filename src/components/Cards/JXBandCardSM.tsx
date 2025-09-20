import { JX_COLOR } from "@/constants/colors/theme";
import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import { Arrow } from "@taroify/icons";
import Taro from "@tarojs/taro";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";
import { BandConfig } from "@/models/musician";
import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";

interface JXBandCardSMProps {
  bandConfig: BandConfig;
}

function JXBandCardSM({ bandConfig }: JXBandCardSMProps) {
  const { bandID, position, bandName } = bandConfig;

  const navigate = async () => {
    Taro.navigateTo({
      url: `/pages/band-detail/index?bandID=${bandID}`,
    });
  };

  return (
    <JXCardContainer
      onClick={navigate}
      horizontal
      style={{ alignItems: "center" }}
    >
      <View
        className="container-h grow"
        style={{ alignItems: "center", gap: 12 }}
      >
        <JXEmoji>{MUSICIAN_DISPLAY_CONFIG[position].emoji}</JXEmoji>
        <JXTitleLabel lg>{bandName}</JXTitleLabel>
      </View>
      <Arrow size={18} color={JX_COLOR["black"].borderColor} />
    </JXCardContainer>
  );
}

export default JXBandCardSM;
