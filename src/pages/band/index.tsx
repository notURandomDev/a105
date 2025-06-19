import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Tabs } from "@taroify/core";
import { useState } from "react";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import JXBandCard from "@/components/Cards/JXBandCard";
import JXMetricCardSM from "@/components/Cards/JXMetricCardSM";
import { useBandPreviewData } from "@/hooks/useBandPreviewData";

export default function Band() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [tabIndex, setTabIndex] = useState(1);

  const { myBands, activeBands, recruitingBands } = useBandPreviewData({
    production: false,
  });

  // 发送网络请求；将从数据库中返回的乐队Band类型，转换为乐队卡片的BandPreview类型

  return (
    <View className="band page page-padding">
      <View className="container-h card-gap">
        <JXMetricCardSM
          active={tabIndex === 0}
          label="我的乐队"
          emoji="👤"
          value={myBands.length}
        />
        <JXMetricCardSM
          active={tabIndex === 1}
          label="活跃乐队"
          emoji="🎉"
          value={activeBands.length}
        />
        <JXMetricCardSM
          active={tabIndex === 2}
          label="乐队招募"
          emoji="🔥"
          value={recruitingBands.length}
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
        <Tabs.TabPane title="我的" className="tab-pane">
          <View className="tab-container">
            {activeBands.map((b) => (
              <JXBandCard bandInfo={b} />
            ))}
          </View>
        </Tabs.TabPane>
        <Tabs.TabPane title="活跃" className="tab-pane">
          <View className="tab-container">
            {activeBands.map((b) => (
              <JXBandCard bandInfo={b} />
            ))}
          </View>
        </Tabs.TabPane>
        <Tabs.TabPane title="招募中" className="tab-pane">
          <View className="tab-container">
            {recruitingBands.map((b) => (
              <JXBandCard bandInfo={b} />
            ))}
          </View>
        </Tabs.TabPane>
      </Tabs>
      <JXFloatingBubble
        onClick={() => Taro.navigateTo({ url: "/pages/band-create/index" })}
      />
    </View>
  );
}
