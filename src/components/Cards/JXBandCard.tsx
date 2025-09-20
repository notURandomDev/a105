import { View } from "@tarojs/components";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import JXButton from "../JXButton";
import JXCardContainer from "../JXCardContainer";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import Taro from "@tarojs/taro";
import JXTitleLabel from "../Labels/JXTitleLabel";
import { Band } from "@/models/band";

interface JXBandCardProps {
  band: Band;
  addBtnDisabled?: boolean;
}
const JXBandCard = ({ band, addBtnDisabled }: JXBandCardProps) => {
  const { status, name, description, statusUpdatedAt, _id } = band;

  const isRecruiting = status === "recruiting";

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/band-detail/index?bandID=${_id}`,
    });
  };

  return (
    <JXCardContainer onClick={navigate} style={{ gap: 8 }}>
      <JXTitleLabel lg>{name ?? ""}</JXTitleLabel>

      <View className="container-v">
        <JXBodyLabel>
          {`${isRecruiting ? "招募" : "乐队"}简介：${description}`}
        </JXBodyLabel>
        <View
          className="container-h grow"
          style={{
            alignItems: "flex-end",
            justifyContent: isRecruiting ? "space-between" : "flex-start",
          }}
        >
          <JXSecondaryLabel>
            {`${isRecruiting ? "发布时间" : "成立时间"}：${getYMDfromDate(
              statusUpdatedAt
            )}`}
          </JXSecondaryLabel>
          {isRecruiting && <JXButton disabled={addBtnDisabled}>加入</JXButton>}
        </View>
      </View>
    </JXCardContainer>
  );
};

export default JXBandCard;
