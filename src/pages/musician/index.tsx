import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { useState } from "react";
import { MUSICIAN_TAB_DISPLAY, MusicianTabs } from "@/constants/utils/musician";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCard from "@/components/Cards/JXMusicianCard";
import JXMusicianProfileCard from "@/components/Cards/JXMusicianProfileCard";
import JXEmoji from "@/components/JXEmoji";

const MUSICIAN_TABS: MusicianTabs[] = [
  "all",
  "vocalist",
  "guitarist",
  "keyboardist",
  "bassist",
  "drummer",
];

export default function Musician() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <View className="musician page page-padding card-gap">
      <JXMetricCard
        label={`${MUSICIAN_TAB_DISPLAY[MUSICIAN_TABS[tabIndex]].label}人数`}
        emoji={MUSICIAN_TAB_DISPLAY[MUSICIAN_TABS[tabIndex]].emoji}
        value={87}
      />
      <Tabs
        lazyRender
        animated
        swipeable
        value={tabIndex}
        onChange={setTabIndex}
      >
        {MUSICIAN_TABS.map((type) => {
          const { emoji } = MUSICIAN_TAB_DISPLAY[type];
          return (
            <Tabs.TabPane
              title={<JXEmoji size="sm">{emoji}</JXEmoji>}
              className="tab-pane"
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
