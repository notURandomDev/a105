import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import "./index.scss";
import JXCalendar from "@/components/JXCalendar";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useState } from "react";
import {
  getMDWfromDate,
  getWeekRange,
  resetTimewithDate,
} from "@/utils/DatetimeHelper";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { Reservation } from "@/models/reservation";
import { getReservationsByDateRange } from "@/services/reservationsService";

export default function Calendar() {
  // 一整周的预约记录
  const [weekReservations, setWeekReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(
    resetTimewithDate(new Date())
  );

  const today = resetTimewithDate(new Date());
  const { monday: _, sunday } = getWeekRange();

  // Derived from `weekReservations`
  // 根据周预约记录推断出当天的预约记录
  const dayReservations = weekReservations.filter((r) => {
    return resetTimewithDate(r.date).getTime() === selectedDate.getTime();
  });

  // 【更新日历组件数据】获取当前一周的所有排练预约记录
  const fetchCurrentWeekReservations = async () => {
    const reservations =
      (await getReservationsByDateRange(today, sunday)) || [];
    setWeekReservations(reservations);
  };

  // 页面出现时，更新日历组件的数据
  useDidShow(() => {
    fetchCurrentWeekReservations();
  });

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/reserve/index?date=${JSON.stringify(selectedDate)}`,
    });
  };

  return (
    <ScrollView className="reserve">
      {/* 处理日历组件的上抛事件，更新选择日期 */}
      <JXCalendar onChange={setSelectedDate} reservations={weekReservations} />
      <View
        className="container-h grow"
        style={{
          padding: 16,

          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: 500 }}>{getMDWfromDate(selectedDate)}</Text>
        <Text style={{ fontWeight: 500 }}>
          预约乐队：{dayReservations.length}
        </Text>
      </View>
      <View
        className="container-v"
        style={{
          paddingBottom: 24,
          padding: "0 12px",
          gap: 12,
        }}
      >
        {dayReservations.map((r) => {
          return <JXReservationCard hideDate reservation={r} />;
        })}
      </View>
      <JXFloatingBubble offset={{ x: -1, y: 450 }} onClick={navigate} />
    </ScrollView>
  );
}
