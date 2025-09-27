import { ScrollView, View } from "@tarojs/components";
import { useLoad, usePageScroll } from "@tarojs/taro";
import "./index.scss";
import { PullRefresh, Tabs } from "@taroify/core";
import { useState } from "react";

const data = Array.from({ length: 40 }, (_, index) => index);

export default function Demo() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [loading, setLoading] = useState(false);
  const [reachTop, setReachTop] = useState(true);

  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  return (
    <View className="page">
      <View className="border">Header Here</View>
      <View>
        <Tabs>
          <Tabs.TabPane title="滚动测试" className="border">
            <ScrollView
              scrollY
              style={{ flex: 1, height: "70vh", display: "flex" }}
            >
              <PullRefresh
                loading={loading}
                reachTop={reachTop}
                onRefresh={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                }}
              >
                {data.map((item) => (
                  <View className="flex">{item}</View>
                ))}
              </PullRefresh>
            </ScrollView>
            {/* <PullRefresh style={{ height: "70vh", display: "flex", flex: 1 }}>
              <View className="tab-container">
                {data.map((item) => (
                  <View className="flex">{item}</View>
                ))}
              </View>
            </PullRefresh> */}
          </Tabs.TabPane>
        </Tabs>
      </View>
    </View>
  );
}
