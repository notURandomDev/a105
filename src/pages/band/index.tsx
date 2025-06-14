import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { useState } from "react";
import JXCardContainer from "@/components/JXCardContainer";
import JXMetricCard from "@/components/JXMetricCard";
import JXActiveBand from "@/components/JXBandCard";
import { MOCK_BAND_PREVIEW } from "@/constants/database/bands";

export default function Band() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <View className="band page page-padding">
      <View className="container-h" style={{ gap: 20 }}>
        <JXMetricCard
          active={tabIndex === 0}
          label="活跃乐队"
          emoji="🎉"
          value={14}
        />
        <JXMetricCard
          active={tabIndex === 1}
          label="招募中乐队"
          emoji="🔥"
          value={3}
        />
      </View>
      <Tabs
        shrink
        lazyRender
        animated
        swipeable
        value={tabIndex}
        onChange={setTabIndex}
      >
        <Tabs.TabPane title="活跃" className="tab-pane">
          <View className="tab-container">
            <JXActiveBand bandInfo={MOCK_BAND_PREVIEW.active} />
          </View>
        </Tabs.TabPane>
        <Tabs.TabPane title="招募中" className="tab-pane">
          <JXActiveBand bandInfo={MOCK_BAND_PREVIEW.recruiting} />
        </Tabs.TabPane>
      </Tabs>
    </View>
  );
}
