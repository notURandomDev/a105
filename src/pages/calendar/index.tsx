import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXCalendar from "@/components/JXCalendar";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useState } from "react";
import { getMDWfromDate } from "@/utils/DatetimeHelper";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { useReservationsWithDate } from "@/hooks/reservation/useReservationsWithDate";

export default function Calendar() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const reservations = useReservationsWithDate(selectedDate);

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/reserve/index?date=${JSON.stringify(selectedDate)}`,
    });
  };

  return (
    <ScrollView className="reserve">
      <JXCalendar onChange={setSelectedDate} />
      <View
        className="container-h grow"
        style={{
          padding: 16,

          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: 500 }}>{getMDWfromDate(selectedDate)}</Text>
        <Text style={{ fontWeight: 500 }}>预约乐队：{reservations.length}</Text>
      </View>
      <View
        className="container-v"
        style={{
          paddingBottom: 24,
          padding: "0 12px",
          gap: 12,
        }}
      >
        {reservations.map((reservation) => {
          return <JXReservationCard hideDate reservation={reservation} />;
        })}
      </View>
      <JXFloatingBubble offset={{ x: -1, y: 450 }} onClick={navigate} />
    </ScrollView>
  );
}
