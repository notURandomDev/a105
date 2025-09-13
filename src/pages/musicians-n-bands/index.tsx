import { useState } from "react";
import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { Tabs } from "@taroify/core";
import { BandTabKey, MusicianTabKey } from "@/types/components";
import { useMusicianTab } from "@/hooks/musician/useMusicianTab";
import { useBandTab } from "@/hooks/useBandTab";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCard from "@/components/Cards/JXMusicianCard";
import JXBandCard from "@/components/Cards/JXBandCard";
import JXEmoji from "@/components/JXEmoji";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import "./index.scss";

export const MUSICIAN_TAB_CONFIG: Record<
  MusicianTabKey,
  {
    label: string;
    emoji: string;
  }
> = {
  vocalist: { label: "主唱", emoji: "🎤" },
  guitarist: { label: "吉他手", emoji: "🎸" },
  bassist: { label: "贝斯手", emoji: "🎛️" },
  keyboardist: { label: "键盘手", emoji: "🎹" },
  drummer: { label: "鼓手", emoji: "🥁" },
};

export const BAND_TAB_CONFIG: Record<BandTabKey, { label: string }> = {
  // myBands: { label: "我的" },
  activeBands: { label: "活跃" },
  recruitingBands: { label: "招募中" },
};

export default function MusiciansNBands() {
  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const {
    activeBandTabKey,
    setActiveBandTabKey,
    bands,
    fetchBands,
    handleCreateBand,
  } = useBandTab();
  const {
    activeMusicianTabKey,
    setActiveMusicianTabKey,
    musicians,
    fetchMusicians,
  } = useMusicianTab();

  useDidShow(() => {
    fetchBands(activeBandTabKey);
    fetchMusicians(activeMusicianTabKey);
  });

  const renderTab = () => {
    if (activeTabIndex === 0) {
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
      return Object.entries(MUSICIAN_TAB_CONFIG).map(([key, tab]) => (
        <Tabs.TabPane
          title={<JXEmoji size="sm">{tab.emoji}</JXEmoji>}
          className="tab-pane"
          value={key}
        >
          <View className="tab-container">
            {musicians.map((m) => (
              <JXMusicianCard musician={m} />
            ))}
          </View>
        </Tabs.TabPane>
      ));
    }
  };

  return (
    <View className="musicians-n-bands page page-padding card-gap">
      <View className="container-h card-gap">
        <JXMetricCard
          label={
            activeTabIndex === 0
              ? `${BAND_TAB_CONFIG[activeBandTabKey].label}乐队`
              : "查看所有乐队"
          }
          emoji={"🤘"}
          value={activeTabIndex === 0 ? bands.length : ""}
          active={activeTabIndex === 0}
          onClick={() => setActiveTabIndex(0)}
        />
        <JXMetricCard
          label={
            activeTabIndex === 1
              ? `${MUSICIAN_TAB_CONFIG[activeMusicianTabKey].label}人数`
              : "查看所有乐手"
          }
          emoji={"🧑‍🎤"}
          value={activeTabIndex === 1 ? musicians.length : ""}
          active={activeTabIndex === 1}
          onClick={() => setActiveTabIndex(1)}
        />
      </View>
      <Tabs
        lazyRender
        animated
        swipeable
        value={activeTabIndex ? activeMusicianTabKey : activeBandTabKey}
        onChange={
          activeTabIndex ? setActiveMusicianTabKey : setActiveBandTabKey
        }
      >
        {renderTab()}
      </Tabs>
      {activeTabIndex === 0 && <JXFloatingBubble onClick={handleCreateBand} />}
    </View>
  );
}
