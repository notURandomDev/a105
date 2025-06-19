import { JX_COLOR } from "@/constants/colors/theme";
import { View } from "@tarojs/components";
import JXCardContainer from "../JXCardContainer";
import { Arrow } from "@taroify/icons";
import { Position } from "@/models/musician";
import Taro from "@tarojs/taro";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";

interface JXBandCardSMProps {
  positions: Position[];
  name: string;
}

function JXBandCardSM() {
  const navigate = () =>
    Taro.navigateTo({
      url: `/pages/band-detail/index?name=${"if we could stay"}`,
    });

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
        <JXEmoji>🥁</JXEmoji>
        <JXTitleLabel lg>if we could stay</JXTitleLabel>
      </View>
      <Arrow size={18} color={JX_COLOR["black"].borderColor} />
    </JXCardContainer>
  );
}

export default JXBandCardSM;
