import { View } from "@tarojs/components";
import Taro, { options, useLoad } from "@tarojs/taro";
import "./index.scss";
import JXBandCardSM from "@/components/Cards/JXBandCardSM";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianSkillCard from "@/components/Cards/JXMusicianSkillCard";
import JXAvatar from "@/components/JXAvatar";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";

export default function MusicianDetail() {
  useLoad((options: Record<string, string>) => {
    Taro.setNavigationBarTitle({ title: "乐手档案｜" + options.name });
  });

  return (
    <View className="musician-detail page-padding">
      <JXAvatar size="xl" shape="rounded">
        {"j"}
      </JXAvatar>

      <JXHugeLabel>{options.name ?? "John Doe"}</JXHugeLabel>

      <View className="container-h grow" style={{ gap: 16 }}>
        <JXMetricCard label="加入吉协年份" emoji="🗓️" value={2025} />
        <JXMetricCard label="乐手性别" emoji="🚹" value={"男"} />
      </View>

      <JXFormLabel>乐器技能</JXFormLabel>
      <View className="container-v card-gap">
        <JXMusicianSkillCard />
      </View>

      <JXFormLabel>所在乐队</JXFormLabel>
      <View className="container-v card-gap">
        <JXBandCardSM />
      </View>
    </View>
  );
}
