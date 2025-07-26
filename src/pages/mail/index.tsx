import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
import JXMailCard from "@/components/Cards/JXMailCard";
import { useEffect, useState } from "react";
import { useDidShow, useLoad } from "@tarojs/taro";

const MailCardsData = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Mail() {
  useLoad(() => {
    setScrollIntoId(0);
  });

  const [scrollIntoId, setScrollIntoId] = useState(0);

  useDidShow(() => {
    if (scrollIntoId === MailCardsData.length - 1) setScrollIntoId(0);
    setTimeout(() => {
      setScrollIntoId(MailCardsData.length - 1);
    }, 0);
  });

  return (
    <ScrollView
      style={{ height: "100vh" }}
      enableFlex
      className="mail page bg-gray"
      scrollY
      scrollIntoView={`mail-card-${scrollIntoId}`}
    >
      <View style={{ paddingTop: 16 }}></View>
      {MailCardsData.map((mailCard, index) => (
        <View
          style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }}
          key={`mail-card-${index}`}
          id={`mail-card-${index}`}
        >
          <JXMailCard />
        </View>
      ))}
    </ScrollView>
    // <View disableScroll className="mail page page-padding bg-gray card-gap">

    // </View>
  );
}
