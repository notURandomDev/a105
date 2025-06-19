import { View } from "@tarojs/components";
import JXAvatar from "../JXAvatar";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import Taro from "@tarojs/taro";

function JXMusicianProfileCard() {
  const navigate = () => {
    Taro.navigateTo({ url: `/pages/musician-detail/index?name=${"John Doe"}` });
  };

  return (
    <JXCardContainer onClick={navigate} style={{ gap: 8 }}>
      <View className="container-h" style={{ gap: 12, alignItems: "center" }}>
        <JXAvatar>Kyle</JXAvatar>
        <View className="container-v">
          <JXTitleLabel>{"Kyle"}</JXTitleLabel>
          <JXSecondaryLabel>TA 在 5 年前加入了吉协</JXSecondaryLabel>
        </View>
      </View>

      <View className="chip-container">
        <JXGenreChip genre="Blues" />
        <JXGenreChip genre="Blues" />
        <JXGenreChip genre="Blues" />
        <JXGenreChip genre="Blues" />
      </View>

      <View className="container-v">
        <JXBodyLabel>🎸 在 JOINT 乐队中担任主音吉他手</JXBodyLabel>
        <JXBodyLabel>🥁 在 Rockaissance 乐队中担任鼓手</JXBodyLabel>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianProfileCard;
