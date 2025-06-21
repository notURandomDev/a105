import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianCardSM from "@/components/Cards/JXMusicianCardSM";
import { Image } from "@taroify/core";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXGenreChip from "@/components/JXGenreChip";
import JXMusicianCardRC from "@/components/Cards/JXMusicianCardRC";

export default function BandDetail() {
  useLoad((options: Record<string, string>) => {
    Taro.setNavigationBarTitle({ title: "乐队档案｜" + options.name });
  });

  return (
    <View className="band-detail page-padding">
      <Image
        style={{ borderRadius: 16 }}
        height={300}
        width={"100%"}
        mode="aspectFill"
        src={require("../../../assets/grok.jpg")}
      />
      <JXHugeLabel>JOINT</JXHugeLabel>
      <JXMetricCard label="成立时间" emoji="🗓️" value={"2025-06-23"} />
      <JXFormLabel>乐队风格</JXFormLabel>
      <View className="chip-container">
        <JXGenreChip genre="Alternative" />
        <JXGenreChip genre="Rock" />
      </View>

      <JXFormLabel>招募乐手位置</JXFormLabel>
      <View className="card-gap container-v">
        <JXMusicianCardRC />
      </View>

      <JXFormLabel>乐队成员</JXFormLabel>
      <View className="card-gap container-v">
        <JXMusicianCardSM />
      </View>
    </View>
  );
}
