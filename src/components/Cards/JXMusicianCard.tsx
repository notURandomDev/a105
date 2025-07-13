import { View } from "@tarojs/components";
import JXAvatar from "../JXAvatar";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import { Musician } from "@/models/musician";
import Taro from "@tarojs/taro";

interface JXMusicianCardProps {
  musician: Musician;
}

function JXMusicianCard({ musician }: JXMusicianCardProps) {
  const { bandIDs, nickname, bio, genre } = musician;

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/musician-detail/index?userID=${musician.userID}`,
    });
  };

  return (
    <JXCardContainer onClick={navigate} style={{ gap: 8 }}>
      <View className="container-h" style={{ gap: 12, alignItems: "center" }}>
        <JXAvatar>{nickname}</JXAvatar>
        <View className="container-v">
          <JXTitleLabel>{nickname}</JXTitleLabel>
          <JXSecondaryLabel>
            {bandIDs.length
              ? `TA 是 ${bandIDs.length} 个乐队的吉他手`
              : "TA暂无归属乐队"}
          </JXSecondaryLabel>
        </View>
      </View>

      <View className="chip-container">
        {genre.map((g) => (
          <JXGenreChip genre={g} />
        ))}
      </View>

      <JXBodyLabel>{`乐手简介：${bio}`}</JXBodyLabel>
    </JXCardContainer>
  );
}

export default JXMusicianCard;
