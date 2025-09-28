import { useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { PullRefresh, Tabs } from "@taroify/core";
import { BandTabKey, MusicianTabKey } from "@/types/components";
import { useMusicianTab } from "@/hooks/musician/useMusicianTab";
import { useBandTab } from "@/hooks/band/useBandTab";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCard from "@/components/Cards/JXMusicianCard";
import JXBandCard from "@/components/Cards/JXBandCard";
import JXEmoji from "@/components/JXEmoji";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import "./index.scss";
import JXListBottom from "@/components/JXListBottom";
import { useMutexLoad } from "@/hooks/util/useMutexLoad";
import { usePullRefresh } from "@/hooks/util/usePullRefresh";

interface TabExeRouterParams {
  bandFn: () => void | Promise<void>;
  musicianFn: () => void | Promise<void>;
}

export const MUSICIAN_TAB_CONFIG: Record<
  MusicianTabKey,
  { label: string; emoji: string }
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
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const isBandTab = () => activeTabIndex === 0;
  const isMusicianTab = () => activeTabIndex === 1;

  const tabValueRouter = (bandValue, musicianValue) => {
    return activeTabIndex === 0 ? bandValue : musicianValue;
  };

  // 简化 callsite 对于当前所处 tab 的判断逻辑
  const tabExeRouter = (params: TabExeRouterParams) => {
    const { bandFn, musicianFn } = params;
    return activeTabIndex === 0 ? bandFn() : musicianFn();
  };

  const {
    activeBandTabKey,
    setActiveBandTabKey,
    bandsData,
    fetchBands,
    handleCreateBand,
  } = useBandTab();

  const { data: bands } = bandsData;

  const {
    activeMusicianTabKey,
    setActiveMusicianTabKey,
    musiciansData,
    fetchMusicians,
  } = useMusicianTab();

  const { data: musicians } = musiciansData;

  useDidShow(() => {
    // TODO: 判断如果是第一次加载页面（载入内存），useEffect 已经处理；此处是重复调用
    tabExeRouter({
      bandFn: fetchBands,
      musicianFn: fetchMusicians,
    });
  });

  const { mutexPullRefresh, pullRefreshing, reachTop } = usePullRefresh();
  const { mutexLoad: mutexFetchMore, loading: fetchingMore } = useMutexLoad();

  const handlePullRefresh = () => {
    tabExeRouter({
      bandFn: () => mutexPullRefresh(() => fetchBands()),
      musicianFn: () => mutexPullRefresh(() => fetchMusicians()),
    });
  };

  const handleFetchMoreData = () => {
    tabExeRouter({
      bandFn: () => mutexFetchMore(() => fetchBands(true)),
      musicianFn: () => mutexFetchMore(() => fetchMusicians(true)),
    });
  };

  const renderTab = () => {
    // 渲染乐队Tab数据
    const renderBandTab = () =>
      Object.entries(BAND_TAB_CONFIG).map(([key, tab]) => (
        <Tabs.TabPane value={key} title={tab.label}>
          <ScrollView scrollY className="scrollable">
            <PullRefresh
              loading={pullRefreshing}
              reachTop={reachTop}
              onRefresh={handlePullRefresh}
            >
              <View className="tab-container page-padding-compensate">
                {bands.map((band) => (
                  <JXBandCard band={band} />
                ))}
                <JXListBottom
                  loadMoreText="加载更多乐队"
                  loading={fetchingMore}
                  hasMore={bandsData.pagination.hasMore}
                  onFetchMore={handleFetchMoreData}
                />
              </View>
            </PullRefresh>
          </ScrollView>
        </Tabs.TabPane>
      ));

    // 渲染乐手Tab数据
    const renderMusicianTab = () =>
      Object.entries(MUSICIAN_TAB_CONFIG).map(([key, tab]) => (
        <Tabs.TabPane
          value={key}
          title={<JXEmoji size="sm">{tab.emoji}</JXEmoji>}
        >
          <ScrollView scrollY className="scrollable">
            <PullRefresh
              loading={pullRefreshing}
              reachTop={reachTop}
              onRefresh={handlePullRefresh}
            >
              <View className="tab-container page-padding-compensate">
                {musicians.map((m) => (
                  <JXMusicianCard musician={m} />
                ))}
                <JXListBottom
                  loadMoreText="加载更多乐手"
                  loading={fetchingMore}
                  hasMore={musiciansData.pagination.hasMore}
                  onFetchMore={handleFetchMoreData}
                />
              </View>
            </PullRefresh>
          </ScrollView>
        </Tabs.TabPane>
      ));

    return isBandTab() ? renderBandTab() : renderMusicianTab();
  };

  const renderCountDisplay = () => {
    const bandCount = bandsData.pagination.hasMore
      ? `${bands.length}+`
      : bands.length;
    const musicianCount = musiciansData.pagination.hasMore
      ? `${musicians.length}+`
      : musicians.length;

    const bandLabel = BAND_TAB_CONFIG[activeBandTabKey].label;
    const musicianLabel = MUSICIAN_TAB_CONFIG[activeMusicianTabKey].label;

    return (
      <View style={{ padding: "0 24px" }} className="container-h card-gap">
        <JXMetricCard
          label={tabValueRouter(`${bandLabel}乐队`, "查看所有乐队")}
          emoji={"🤘"}
          value={tabValueRouter(bandCount, "")}
          active={isBandTab()}
          onClick={() => setActiveTabIndex(0)}
        />
        <JXMetricCard
          label={tabValueRouter("查看所有乐手", `${musicianLabel}人数`)}
          emoji={"🧑‍🎤"}
          value={tabValueRouter("", musicianCount)}
          active={isMusicianTab()}
          onClick={() => setActiveTabIndex(1)}
        />
      </View>
    );
  };

  return (
    <View className="musicians-n-bands page card-gap">
      {renderCountDisplay()}
      <View className="flex">
        <Tabs
          lazyRender
          animated
          swipeable
          value={tabValueRouter(activeBandTabKey, activeMusicianTabKey)}
          onChange={(value) =>
            tabExeRouter({
              bandFn: () => setActiveBandTabKey(value),
              musicianFn: () => setActiveMusicianTabKey(value),
            })
          }
        >
          {renderTab()}
        </Tabs>
      </View>
      {isBandTab() && <JXFloatingBubble onClick={handleCreateBand} />}
    </View>
  );
}
