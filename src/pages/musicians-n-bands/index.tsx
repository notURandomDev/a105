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

type RouteDataFetchingParams = {
  bandFn: () => Promise<void>;
  musicianFn: () => Promise<void>;
};

interface RouteDataFetching {
  (params: RouteDataFetchingParams): void;
}

export default function MusiciansNBands() {
  const [activeTabIndex, setActiveTabIndex] = useState(1);

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

  // 简化判断逻辑
  const routeDataFetching: RouteDataFetching = (params) => {
    const { bandFn, musicianFn } = params;
    activeTabIndex === 0 ? bandFn() : musicianFn();
  };

  useDidShow(() => {
    // TODO: 判断如果是第一次加载页面（载入内存），useEffect 已经处理；此处是重复调用
    routeDataFetching({
      bandFn: fetchBands,
      musicianFn: fetchMusicians,
    });
  });

  const { mutexPullRefresh, pullRefreshing, reachTop } = usePullRefresh();
  const { mutexLoad: mutexFetchMore, loading: fetchingMore } = useMutexLoad();

  const handlePullRefresh = () => {
    routeDataFetching({
      bandFn: () => mutexPullRefresh(() => fetchBands()),
      musicianFn: () => mutexPullRefresh(() => fetchMusicians()),
    });
  };

  const handleFetchMoreData = () => {
    routeDataFetching({
      bandFn: () => mutexFetchMore(() => fetchBands(true)),
      musicianFn: () => mutexFetchMore(() => fetchMusicians(true)),
    });
  };

  const renderTab = () => {
    if (activeTabIndex === 0) {
      // 渲染乐队Tab数据
      return Object.entries(BAND_TAB_CONFIG).map(([key, tab]) => (
        <Tabs.TabPane value={key} title={tab.label}>
          <ScrollView scrollY className="scrollable">
            <PullRefresh
              className="tab-container page-padding-compensate"
              loading={pullRefreshing}
              reachTop={reachTop}
              onRefresh={handlePullRefresh}
            >
              {bands.map((band) => (
                <JXBandCard band={band} />
              ))}
              <JXListBottom
                loadMoreText="加载更多乐队"
                loading={fetchingMore}
                hasMore={bandsData.pagination.hasMore}
                onFetchMore={handleFetchMoreData}
              />
            </PullRefresh>
          </ScrollView>
        </Tabs.TabPane>
      ));
    } else {
      // 渲染乐手Tab数据
      return Object.entries(MUSICIAN_TAB_CONFIG).map(([key, tab]) => (
        <Tabs.TabPane
          value={key}
          title={<JXEmoji size="sm">{tab.emoji}</JXEmoji>}
        >
          <ScrollView scrollY className="scrollable">
            <PullRefresh
              className="tab-container page-padding-compensate"
              loading={pullRefreshing}
              reachTop={reachTop}
              onRefresh={handlePullRefresh}
            >
              {musicians.map((m) => (
                <JXMusicianCard musician={m} />
              ))}
              <JXListBottom
                loadMoreText="加载更多乐手"
                loading={fetchingMore}
                hasMore={musiciansData.pagination.hasMore}
                onFetchMore={handleFetchMoreData}
              />
            </PullRefresh>
          </ScrollView>
        </Tabs.TabPane>
      ));
    }
  };

  return (
    <View className="musicians-n-bands page card-gap">
      <View style={{ padding: "0 24px" }} className="container-h card-gap">
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
      <View className="flex">
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
      </View>
      {activeTabIndex === 0 && <JXFloatingBubble onClick={handleCreateBand} />}
    </View>
  );
}
