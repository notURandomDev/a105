import { View } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXAvatar from "./JXAvatar";
import JXTitleLabel from "./Labels/JXTitleLabel";
import JXGenreChip from "./JXGenreChip";
import JXSecondaryLabel from "./Labels/JXSecondaryLabel";
import JXBodyLabel from "./Labels/JXBodyLabel";

function JXMusicianCard() {
  return (
    <JXCardContainer style={{ gap: 8 }}>
      <View className="container-h" style={{ gap: 12, alignItems: "center" }}>
        <JXAvatar style={{ height: 45, width: 45 }}>a</JXAvatar>
        <View className="container-v" style={{ gap: 3 }}>
          <JXTitleLabel>Kyle</JXTitleLabel>
          <View className="chip-container">
            <JXGenreChip genre="Blues" />
          </View>
        </View>
      </View>

      <JXBodyLabel>
        乐手简介：这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的乐手简介
      </JXBodyLabel>

      <View
        className="container-h grow"
        style={{ justifyContent: "space-between" }}
      >
        <View
          style={{ flex: 1, justifyContent: "flex-start" }}
          className="container-h"
        >
          <JXSecondaryLabel>加入于：2025-06</JXSecondaryLabel>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center" }}
          className="container-h"
        >
          <JXSecondaryLabel>所属乐队：3</JXSecondaryLabel>
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end" }}
          className="container-h"
        >
          <JXSecondaryLabel>当前年级：大三</JXSecondaryLabel>
        </View>
      </View>
    </JXCardContainer>
  );
}

export default JXMusicianCard;
