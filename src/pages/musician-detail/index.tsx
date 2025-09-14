import { View } from "@tarojs/components";
import JXBandCardSM from "@/components/Cards/JXBandCardSM";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianSkillCard from "@/components/Cards/JXMusicianSkillCard";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import { useLoad } from "@tarojs/taro";
import { useMusicianProfile } from "@/hooks/musician/useMusicianProfile";
import "./index.scss";

export default function MusicianDetail() {
  const { setUserID, musicianProfile } = useMusicianProfile();

  useLoad((options: Record<string, string>) => {
    if (!options.userID) return;
    setUserID(options.userID);
  });

  return (
    <View className="musician-detail page-padding">
      <JXAvatar size="xl" shape="rounded">
        {musicianProfile?.nickname ?? "?"}
      </JXAvatar>

      <JXHugeLabel>{musicianProfile?.nickname ?? "暂无昵称"}</JXHugeLabel>

      <JXFormLabel>乐手身份</JXFormLabel>
      <View className="container-v card-gap">
        {musicianProfile?.musicians &&
          musicianProfile.musicians.map((m) => (
            <JXMusicianSkillCard musician={m} />
          ))}
      </View>

      <JXFormLabel>所在乐队</JXFormLabel>
      <View className="container-v card-gap">
        {musicianProfile?.bandConfigs &&
          musicianProfile.bandConfigs.map((bc) => (
            <JXBandCardSM bandConfig={bc} />
          ))}
      </View>
    </View>
  );
}
