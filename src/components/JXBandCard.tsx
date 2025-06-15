import { View, Text } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXSecondaryLabel from "./Labels/JXSecondaryLabel";
import JXButton from "./JXButton";
import { BandPreview } from "@/models/band";
import { MUSICIAN_DISPLAY, MusicianType } from "@/constants/utils/musician";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import JXGenreChip from "./JXGenreChip";
import JXBodyLabel from "./Labels/JXBodyLabel";

const getPositionEmojis = (positions: MusicianType[]): string[] | undefined => {
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
          <Text style={{ fontSize: emojiSize }}>{emoji}</Text>
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

const JXBandCard = ({ bandInfo }: { bandInfo: BandPreview }) => {
  const {
    status,
    missingPositions,
    occupiedPositions,
    name,
    genre,
    description,
    formedOn,
    postedOn,
  } = bandInfo;

  const missingEmojis = getPositionEmojis(missingPositions);
  const occupiedEmojis = getPositionEmojis(occupiedPositions);

  const isRecruiting = status === "recruiting";

  return (
    <JXCardContainer style={{ gap: 8 }}>
      <View className="container-v" style={{ gap: isRecruiting ? 4 : 0 }}>
        {isRecruiting ? (
          <JXBandCardEmojis
            isRecruiting={isRecruiting}
            occupiedEmojis={occupiedEmojis ?? []}
            missingEmojis={missingEmojis}
          />
        ) : (
          <Text style={{ fontWeight: 600, fontSize: 24 }}>{name}</Text>
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
            {isRecruiting
              ? `发布时间：${getYMDfromDate(postedOn)}`
              : `成立时间：${getYMDfromDate(formedOn)}`}
          </JXSecondaryLabel>
          {isRecruiting ? (
            <JXButton>加入</JXButton>
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
