import { View } from "@tarojs/components";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { MusicianTabs } from "@/constants/utils/musician";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCard from "@/components/Cards/JXMusicianCard";
import JXMusicianProfileCard from "@/components/Cards/JXMusicianProfileCard";
import JXEmoji from "@/components/JXEmoji";
import { useMusicianData } from "@/hooks/musician/useMusicianData";
import { useState } from "react";
import JXBandCard from "@/components/Cards/JXBandCard";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useMusicianStore } from "@/stores/musicianStore";
import { useBandTab } from "@/hooks/useBandTab";
import { BandTabKey } from "@/types/components";
import { useDidShow } from "@tarojs/taro";

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

export const BAND_TAB_CONFIG: Record<BandTabKey, { label: string }> = {
  // myBands: { label: "我的" },
  activeBands: { label: "活跃" },
  recruitingBands: { label: "招募中" },
};

export default function MusiciansNBands() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    activeBandTabKey,
    setActiveBandTabKey,
    bands,
    fetchBands,
    handleCreateBand,
  } = useBandTab();
  const { activeMusicianTab, setActiveMusicianTab, musicianTabData } =
    useMusicianData();
  const { musicians } = useMusicianStore();

  useDidShow(() => {
    fetchBands(activeBandTabKey);
  });

  const renderTab = () => {
    if (activeIndex === 0) {
      // 渲染乐队Tab数据
      return Object.entries(BAND_TAB_CONFIG).map(([tab, config]) => (
        <Tabs.TabPane value={tab} title={config.label} className="tab-pane">
          <View className="tab-container">
            {bands.map((band) => (
              <JXBandCard band={band} />
            ))}
          </View>
        </Tabs.TabPane>
      ));
    } else {
      // 渲染乐手Tab数据
      return MUSICIAN_TABS.map((tab) => (
        <Tabs.TabPane
          title={<JXEmoji size="sm">{tab.emoji}</JXEmoji>}
          className="tab-pane"
          value={tab.value}
        >
          <View className="tab-container">
            {musicianTabData[activeMusicianTab].map((mp) =>
              activeMusicianTab === "all" ? (
                <JXMusicianProfileCard musicianProfile={mp} />
              ) : (
                <JXMusicianCard musician={mp} />
              )
            )}
          </View>
        </Tabs.TabPane>
      ));
    }
  };

  return (
    <View className="musicians-n-bands page page-padding card-gap">
      <View className="container-h card-gap">
        <JXMetricCard
          label={`${BAND_TAB_CONFIG[activeBandTabKey].label}乐队`}
          emoji={"🤘"}
          value={bands.length}
          active={activeIndex === 0}
          onClick={() => setActiveIndex(0)}
        />
        <JXMetricCard
          label={"乐手人数"}
          emoji={"🧑‍🎤"}
          value={musicians.length}
          active={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
        />
      </View>
      <Tabs
        lazyRender
        animated
        swipeable
        value={activeIndex ? activeMusicianTab : activeBandTabKey}
        onChange={activeIndex ? setActiveMusicianTab : setActiveBandTabKey}
      >
        {renderTab()}
      </Tabs>
      {activeIndex === 0 && <JXFloatingBubble onClick={handleCreateBand} />}
    </View>
  );
}
