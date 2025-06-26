import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { useState } from "react";
import { MusicianTabs } from "@/constants/utils/musician";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCard from "@/components/Cards/JXMusicianCard";
import JXMusicianProfileCard from "@/components/Cards/JXMusicianProfileCard";
import JXEmoji from "@/components/JXEmoji";
import { useMusicianData } from "@/hooks/musician/useMusicianData";

export const MUSICIAN_TABS: {
  label: string;
  emoji: string;
  value: MusicianTabs;
}[] = [
  { value: "all", label: "所有乐手", emoji: "👥" },
  { value: "vocalist", label: "主唱", emoji: "🎤" },
  { value: "guitarist", label: "吉他手", emoji: "🎸" },
  { value: "bassist", label: "贝斯手", emoji: "🎛️" },
  { value: "keyboardist", label: "键盘手", emoji: "🎹" },
  { value: "drummer", label: "鼓手", emoji: "🥁" },
];

export default function Musician() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [activeTab, setActiveTab] = useState<MusicianTabs>("all");
  const {} = useMusicianData();

  const activeTabMetaData = MUSICIAN_TABS.find((mt) => mt.value === activeTab);

  return (
    <View className="musician page page-padding card-gap">
      <JXMetricCard
        label={`${activeTabMetaData?.label}人数`}
        emoji={activeTabMetaData?.emoji}
        value={87}
      />
      <Tabs
        lazyRender
        animated
        swipeable
        value={activeTab}
        onChange={setActiveTab}
      >
        {MUSICIAN_TABS.map((tab) => {
          return (
            <Tabs.TabPane
              title={<JXEmoji size="sm">{tab.emoji}</JXEmoji>}
              className="tab-pane"
              value={tab.value}
            >
              <View className="tab-container">
                <JXMusicianProfileCard />
                <JXMusicianCard />
              </View>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </View>
  );
}
