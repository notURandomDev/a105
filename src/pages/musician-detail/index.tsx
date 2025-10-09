import { View } from "@tarojs/components";
import JXBandCardSM from "@/components/Cards/JXBandCardSM";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianSkillCard from "@/components/Cards/JXMusicianSkillCard";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import { useMusicianProfile } from "@/hooks/musician/useMusicianProfile";
import "./index.scss";

export default function MusicianDetail() {
  const { musicianProfile } = useMusicianProfile();

  return (
    <View className="musician-detail page-padding">
      <JXAvatar size="xl" shape="rounded" />

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
