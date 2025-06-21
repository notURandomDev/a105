import { View, Text } from "@tarojs/components";
import { BandPreview } from "@/models/band";
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
import { PositionType } from "@/models/position";

const getPositionEmojis = (positions: PositionType[]): string[] | undefined => {
  if (!positions.length) return undefined;
  return positions.map((p) => MUSICIAN_DISPLAY[p].emoji);
};

interface JXBandCardHeaderProps {
  isRecruiting: boolean;
  title?: string;
  occupiedEmojis: string[];
  missingEmojis?: string[];
}

const JXBandCardEmojis = ({
  isRecruiting,
  occupiedEmojis,
  missingEmojis = [],
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
          {missingEmojis.map((emoji) => (
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
  bandInfo: BandPreview;
  addBtnDisabled?: boolean;
}
const JXBandCard = ({ bandInfo, addBtnDisabled }: JXBandCardProps) => {
  const {
    status,
    missingPositions,
    occupiedPositions,
    name,
    genre,
    description,
    statusUpdatedAt,
  } = bandInfo;

  const missingEmojis = getPositionEmojis(missingPositions);
  const occupiedEmojis = getPositionEmojis(occupiedPositions);

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
            missingEmojis={missingEmojis}
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
              missingEmojis={missingEmojis}
            />
          )}
        </View>
      </View>
    </JXCardContainer>
  );
};

export default JXBandCard;
