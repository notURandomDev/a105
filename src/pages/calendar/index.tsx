import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXCalendar from "@/components/JXCalendar";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useEffect, useState } from "react";
import { getReservationsByDate } from "@/services/reservationsService";
import { Reservation } from "@/models/reservation";
import { getMDWfromDate } from "@/utils/DatetimeHelper";
import { getMockReservation } from "@/constants/database/reservation";
import JXReservationCard from "@/components/Cards/JXReservationCard";

export default function Calendar() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const initReservations = async () => {
    // 生产环境
    // const reservationsToday = await getReservationsByDate(selectedDate);

    // 测试环境
    const reservationsToday = getMockReservation(new Date());
    setReservations([reservationsToday]);
  };

  useEffect(() => {
    initReservations();
  }, []);

  const navigate = () => {
    Taro.navigateTo({
      url: `/pages/reserve/index?date=${JSON.stringify(selectedDate)}`,
    });
  };

  const handleDateChange = async (
    date: Date,
    reservationsOnDate: Reservation[]
  ) => {
    console.log(reservationsOnDate);
    setSelectedDate(date);
    setReservations(reservationsOnDate);
  };

  return (
    <ScrollView className="reserve">
      <JXCalendar onChange={handleDateChange} />
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
