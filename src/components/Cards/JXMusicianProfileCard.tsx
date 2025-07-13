import { View } from "@tarojs/components";
import JXAvatar from "../JXAvatar";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import Taro from "@tarojs/taro";
import { MusicianProfile } from "@/models/musician";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";

interface JXMusicianProfileCardProps {
  musicianProfile: MusicianProfile;
}

function JXMusicianProfileCard({
  musicianProfile,
}: JXMusicianProfileCardProps) {
  const { nickname, combinedGenres, bandConfigs } = musicianProfile;

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/musician-detail/index?userID=${musicianProfile.musicians[0].userID}`,
    });
  };

  return (
    <JXCardContainer onClick={navigate} style={{ gap: 8 }}>
      <View className="container-h" style={{ gap: 12, alignItems: "center" }}>
        <JXAvatar>{nickname}</JXAvatar>
        <View className="container-v">
          <JXTitleLabel>{nickname}</JXTitleLabel>
          <JXSecondaryLabel>TA 在 n 年前加入了吉协</JXSecondaryLabel>
        </View>
      </View>

      <View className="chip-container">
        {combinedGenres.map((g) => (
          <JXGenreChip genre={g} />
        ))}
      </View>

      <View className="container-v">
        {bandConfigs.map(({ position, bandName }) => {
          const { label, emoji } = MUSICIAN_DISPLAY[position];
          return (
            <JXBodyLabel>{`${emoji} 在 ${bandName} 乐队中担任${label}`}</JXBodyLabel>
          );
        })}
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianProfileCard;
