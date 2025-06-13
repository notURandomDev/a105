// 该组件在预约界面中使用

import { Reservation } from "@/models/reservation";
import { getReservationsByDateRange } from "@/services/reservationsService";
import { getWeekRange, resetTimewithDate } from "@/utils/DatetimeHelper";
import { Calendar } from "@taroify/core";
import { CalendarDayObject } from "@taroify/core/calendar/calendar.shared";
import { Text, View } from "@tarojs/components";
import { ReactNode, useEffect, useState } from "react";

const Top = ({ active, bandNum }: { active: boolean; bandNum: number }) => (
  <View style={{ paddingTop: 5 }}>
    <Text
      style={{
        color: active ? "white" : "black",
      }}
    >
      已预约: {bandNum}
    </Text>
  </View>
);

const Bottom = ({ active }: { active: boolean }) => (
  <View style={{ paddingBottom: 5 }}>
    <Text style={{ color: active ? "white" : "black" }}>今天</Text>
  </View>
);

type ReservationMap = { [timestamp: number]: Reservation[] };

interface JXCalendarProps {
  onChange: (value: Date, reservations: Reservation[]) => void;
}
function JXCalendar({ onChange }: JXCalendarProps) {
  const today = resetTimewithDate(new Date());
  const { monday: _, sunday } = getWeekRange();

  const [reservationsMap, setReservationsMap] = useState<ReservationMap>({});

  const customDayFormatter = (day: CalendarDayObject): CalendarDayObject => {
    const date = day.value;
    if (date >= today && date <= sunday) {
      let top: ReactNode = null;
      let bottom: ReactNode = null;
      const dayYMD = resetTimewithDate(date);

      if (today.getTime() === dayYMD.getTime()) {
        bottom = <Bottom active={day.type === "active"} />;
      }

      const bandNum = reservationsMap[date.getTime()]?.length;
      if (bandNum) {
        top = <Top active={day.type === "active"} bandNum={bandNum} />;
      }

      return { ...day, top, bottom };
    }
    return day;
  };

  const initCalendar = async () => {
    const data = await getReservationsByDateRange(today, sunday);

    const map: ReservationMap = {};
    data.forEach((reservation) => {
      const key = reservation.date.getTime();

      if (!map[key]) map[key] = [];

      map[key].push(reservation);
    });

    setReservationsMap(map);
  };

  useEffect(() => {
    initCalendar();
  }, []);

  return (
    <Calendar
      formatter={customDayFormatter}
      showSubtitle={false}
      defaultValue={new Date()}
      onChange={(date) => {
        onChange(date, reservationsMap[date.getTime()] ?? []);
      }}
      title="时间表"
      style={{
        height: 510,
        "--calendar-active-color": "black",
      }}
      firstDayOfWeek={1}
      min={today}
      max={sunday}
    >
      <Calendar.Footer></Calendar.Footer>
    </Calendar>
  );
}

export default JXCalendar;
