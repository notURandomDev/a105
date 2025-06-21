import { View, Text } from "@tarojs/components";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import JXButton from "../JXButton";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import Taro from "@tarojs/taro";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXEmoji from "../JXEmoji";
import { Band } from "@/models/band";
import { BandPosition } from "@/models/band-position";

const getPositionEmojis = (positions: BandPosition[]) => {
  if (!positions.length) return {};

  const recruitingEmojis = positions
    .filter(({ status }) => status === "recruiting")
    .map(({ position }) => MUSICIAN_DISPLAY[position].emoji);
  const occupiedEmojis = positions
    .filter(({ status }) => status === "occupied")
    .map(({ position }) => MUSICIAN_DISPLAY[position].emoji);

  return { recruitingEmojis, occupiedEmojis };
};

interface JXBandCardHeaderProps {
  isRecruiting: boolean;
  title?: string;
  occupiedEmojis: string[];
  recruitingEmojis?: string[];
}

const JXBandCardEmojis = ({
  isRecruiting,
  occupiedEmojis,
  recruitingEmojis = [],
}: JXBandCardHeaderProps) => {
  const emojiSize = isRecruiting ? 28 : 20;
  const emojiGap = isRecruiting ? 12 : 8;
  return (
    <View
      className="container-h grow"
      style={{
        justifyContent: isRecruiting ? "space-between" : "flex-end",
      }}
    >
      <View className="container-h" style={{ gap: emojiGap }}>
        {occupiedEmojis.map((emoji) => (
          <JXEmoji size={isRecruiting ? "lg" : "sm"}>{emoji}</JXEmoji>
        ))}
      </View>
      {isRecruiting && (
        <View className="container-h" style={{ gap: emojiGap }}>
          {recruitingEmojis.map((emoji) => (
            <Text
              style={{
                fontSize: emojiSize,
                filter: "grayscale(100%)",
                opacity: 0.5,
              }}
            >
              {emoji}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

interface JXBandCardProps {
  band: Band;
  addBtnDisabled?: boolean;
}
const JXBandCard = ({ band, addBtnDisabled }: JXBandCardProps) => {
  const { status, positions, name, genre, description, statusUpdatedAt } = band;

  const { recruitingEmojis, occupiedEmojis } = getPositionEmojis(positions);

  const isRecruiting = status === "recruiting";

  const navigate = () => {
    Taro.navigateTo({ url: `/pages/band-detail/index?name=${name}` });
  };

  return (
    <JXCardContainer onClick={navigate} style={{ gap: 8 }}>
      <View className="container-v" style={{ gap: isRecruiting ? 4 : 0 }}>
        {isRecruiting ? (
          <JXBandCardEmojis
            isRecruiting={isRecruiting}
            occupiedEmojis={occupiedEmojis ?? []}
            recruitingEmojis={recruitingEmojis}
          />
        ) : (
          <JXTitleLabel lg>{name ?? ""}</JXTitleLabel>
        )}

        <View className="chip-container">
          {genre.map((g) => (
            <JXGenreChip genre={g} />
          ))}
        </View>
      </View>

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
          {isRecruiting ? (
            <JXButton disabled={addBtnDisabled}>加入</JXButton>
          ) : (
            <JXBandCardEmojis
              isRecruiting={isRecruiting}
              occupiedEmojis={occupiedEmojis ?? []}
              recruitingEmojis={recruitingEmojis}
            />
          )}
        </View>
      </View>
    </JXCardContainer>
  );
};

export default JXBandCard;
