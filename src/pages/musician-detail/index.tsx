import { View } from "@tarojs/components";
import Taro, { options, useLoad } from "@tarojs/taro";
import "./index.scss";
import JXBandCardSM from "@/components/Cards/JXBandCardSM";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianSkillCard from "@/components/Cards/JXMusicianSkillCard";
import JXAvatar from "@/components/JXAvatar";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import { MusicianProfile } from "@/models/musician";
import { useState } from "react";

export default function MusicianDetail() {
  const [musicianProfile, setMusicianProfile] =
    useState<MusicianProfile | null>(null);

  useLoad((options: Record<string, string>) => {
    const mp = JSON.parse(options.mp) as MusicianProfile;
    setMusicianProfile(mp);
    mp.musicians[0].userID;
    Taro.setNavigationBarTitle({
      title: "乐手档案｜" + mp.nickname,
    });
  });

  return (
    <View className="musician-detail page-padding">
      <JXAvatar size="xl" shape="rounded">
        {musicianProfile?.nickname ?? "?"}
      </JXAvatar>

      <JXHugeLabel>{musicianProfile?.nickname ?? "暂无昵称"}</JXHugeLabel>

      <View className="container-h grow" style={{ gap: 16 }}>
        {/* 待完善 */}
        <JXMetricCard label="加入吉协年份" emoji="🗓️" value={2025} />
        <JXMetricCard label="乐手性别" emoji="🚹" value={"男"} />
      </View>

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
