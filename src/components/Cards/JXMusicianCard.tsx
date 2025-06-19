import { View } from "@tarojs/components";
import JXAvatar from "../JXAvatar";
import JXCardContainer from "../JXCardContainer";
import JXGenreChip from "../JXGenreChip";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";

interface JXMusicianCardProps {
  nickName: string;
}

function JXMusicianCard({ nickName = "Musician Name" }: JXMusicianCardProps) {
  return (
    <JXCardContainer style={{ gap: 8 }}>
      <View className="container-h" style={{ gap: 12, alignItems: "center" }}>
        <JXAvatar>a</JXAvatar>
        <View className="container-v">
          <JXTitleLabel>{nickName}</JXTitleLabel>
          <JXSecondaryLabel>TA 是 2 个乐队的吉他手</JXSecondaryLabel>
        </View>
      </View>

      <View className="chip-container">
        <JXGenreChip genre="Blues" />
      </View>

      <JXBodyLabel>
        乐手简介：这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的乐手简介
      </JXBodyLabel>
    </JXCardContainer>
  );
}

export default JXMusicianCard;
