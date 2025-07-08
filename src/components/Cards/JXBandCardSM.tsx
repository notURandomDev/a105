import { JX_COLOR } from "@/constants/colors/theme";
import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import { Arrow } from "@taroify/icons";
import Taro from "@tarojs/taro";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";
import { BandConfig } from "@/models/musician";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { getBandById } from "@/services/bandsService";
import { mergeBandWithPositions } from "@/utils/band";

interface JXBandCardSMProps {
  bandConfig: BandConfig;
}

function JXBandCardSM({ bandConfig }: JXBandCardSMProps) {
  const { bandID, position, bandName } = bandConfig;

  const navigate = async () => {
    const band = await getBandById({ _id: bandID, production: true });
    if (!band) return;
    // bana-detail界面接受的参数是含乐队位置的，因此要先进行乐队数据的聚合
    const bandWithPositions = await mergeBandWithPositions(band);
    Taro.navigateTo({
      url: `/pages/band-detail/index?band=${JSON.stringify(bandWithPositions)}`,
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
        <JXEmoji>{MUSICIAN_DISPLAY[position].emoji}</JXEmoji>
        <JXTitleLabel lg>{bandName}</JXTitleLabel>
      </View>
      <Arrow size={18} color={JX_COLOR["black"].borderColor} />
    </JXCardContainer>
  );
}

export default JXBandCardSM;
