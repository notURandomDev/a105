import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXCalendar from "@/components/JXCalendar";
import JXFloatingBubble from "@/components/JXFloatingBubble";
import { useEffect, useState } from "react";
import { getReservationsByDate } from "@/services/reservationsService";
import { Reservation } from "@/models/reservation";
import { getHMfromDate, getMDfromDate } from "@/utils/DatetimeHelper";
import { getMockReservation } from "@/constants/database/reservation";
import JXCardContainer from "@/components/JXCardContainer";
import JXSecondaryLabel from "@/components/Labels/JXSecondaryLabel";
import JXTitleLabel from "@/components/Labels/JXTitleLabel";

export default function Table() {
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
      <View className="container-h" style={{ paddingTop: 16, paddingLeft: 16 }}>
        <Text style={{ fontWeight: 500 }}>
          {getMDfromDate(selectedDate)}｜{reservations.length}支已预约乐队
        </Text>
      </View>
      <View
        className="container-v"
        style={{
          padding: "24px 12px",
          gap: 12,
        }}
      >
        {reservations.map(({ bandName, startTime, endTime }) => {
          const startHM = getHMfromDate(startTime);
          const endHM = getHMfromDate(endTime);

          return (
            <JXCardContainer>
              <JXTitleLabel>{`${startHM} - ${endHM}`}</JXTitleLabel>
              <JXSecondaryLabel>{bandName}</JXSecondaryLabel>
            </JXCardContainer>
          );
        })}
      </View>
      <JXFloatingBubble onClick={navigate} />
    </ScrollView>
  );
}
