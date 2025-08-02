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
import { useBandData } from "@/hooks/useBandData";
import JXBandCard from "@/components/Cards/JXBandCard";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";

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

export const BAND_TABS: {
  value: string;
  label: string;
}[] = [
  { value: "myBands", label: "我的" },
  { value: "activeBands", label: "活跃" },
  { value: "recruitingBands", label: "招募中" },
];

export default function MusiciansNBands() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeBandTab, setActiveBandTab] = useState("myBands");
  const { bandTabData, handleCreateBand } = useBandData();
  const { activeMusicianTab, setActiveMusicianTab, musicianTabData } =
    useMusicianData();
  const { bands } = useBandStore();
  const { musicians } = useMusicianStore();

  return (
    <View className="musicians-n-bands page page-padding card-gap">
      <View className="container-h card-gap">
        <JXMetricCard
          label={"乐队总数"}
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
        value={activeIndex ? activeMusicianTab : activeBandTab}
        onChange={activeIndex ? setActiveMusicianTab : setActiveBandTab}
      >
        {activeIndex === 0
          ? BAND_TABS.map((tab) => (
              <Tabs.TabPane
                value={tab.value}
                title={tab.label}
                className="tab-pane"
              >
                <View className="tab-container">
                  {bandTabData[tab.value].map((band) => (
                    <JXBandCard band={band} />
                  ))}
                </View>
              </Tabs.TabPane>
            ))
          : MUSICIAN_TABS.map((tab) => (
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
            ))}
      </Tabs>
      {activeIndex === 0 && <JXFloatingBubble onClick={handleCreateBand} />}
    </View>
  );
}
