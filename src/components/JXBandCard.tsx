import { View, Text } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXSecondaryLabel from "./Labels/JXSecondaryLabel";
import JXButton from "./JXButton";
import { BandGenre, BandPreview } from "@/models/band";
import { MUSICIAN_DISPLAY, MusicianType } from "@/constants/utils/musician";
import JXChip from "./JXChip";
import { BAND_GENRE_COLOR_MAP, BAND_GENRES } from "@/constants/utils/genre";

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
  const { status, missingPositions, occupiedPositions, name, genre } = bandInfo;

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

        <View className="container-h" style={{ alignItems: "center", gap: 8 }}>
          {genre.map((g) => (
            <JXGenre genre={g} />
          ))}
        </View>
      </View>

      <View className="container-v">
        <Text style={{ fontSize: 12 }} className="">
          {`${
            isRecruiting ? "招募" : "乐队"
          }简介：${"JOINT诞生于杭州，以撕裂感的吉他音墙为核心，融合Grudge。从地下Livehouse到音乐节舞台，他们的作品像一场失控的午夜公路电影，用音乐探讨都市孤独与少年心气的碰撞。"}`}
        </Text>
        <View
          className="container-h grow"
          style={{
            alignItems: "flex-end",
            justifyContent: isRecruiting ? "space-between" : "flex-start",
          }}
        >
          <JXSecondaryLabel>{`${
            isRecruiting ? "发布" : "成立"
          }时间：${"2025-06"}`}</JXSecondaryLabel>
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

interface JXGenreProps {
  genre: BandGenre;
}
const JXGenre = ({ genre }: JXGenreProps) => (
  <JXChip color={BAND_GENRE_COLOR_MAP[BAND_GENRES[genre].group]}>
    {`${BAND_GENRES[genre].label}`}
  </JXChip>
);

export default JXBandCard;
