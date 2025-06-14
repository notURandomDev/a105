import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { useMemo, useState } from "react";
import JXCardContainer from "@/components/JXCardContainer";
import JXMetricCard from "@/components/JXMetricCard";
import { MusicianType } from "@/models/user";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";

const MUSICIAN_TAB: MusicianType[] = [
  "vocalist",
  "guitarist",
  "bassist",
  "keyboardist",
  "drummer",
];

export default function Musician() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <View className="musician page page-padding">
      <View className="container-h" style={{ gap: 20 }}>
        <JXMetricCard label="吉协总人数" emoji="🧑‍🧑‍🧒" value={87} />
        <JXMetricCard
          active
          label={`${MUSICIAN_DISPLAY[MUSICIAN_TAB[tabIndex]].label}人数`}
          emoji={MUSICIAN_DISPLAY[MUSICIAN_TAB[tabIndex]].emoji}
          value={87}
        />
      </View>
      <Tabs
        lazyRender
        animated
        swipeable
        value={tabIndex}
        onChange={setTabIndex}
      >
        {MUSICIAN_TAB.map((type) => {
          const { label } = MUSICIAN_DISPLAY[type];
          return (
            <Tabs.TabPane title={label} className="tab-pane"></Tabs.TabPane>
          );
        })}
      </Tabs>
    </View>
  );
}
