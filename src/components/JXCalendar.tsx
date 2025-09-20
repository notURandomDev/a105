// 该组件在预约界面中使用

import { ReactNode, useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Calendar } from "@taroify/core";
import { CalendarDayObject } from "@taroify/core/calendar/calendar.shared";
import { Reservation } from "@/models/reservation";
import { getWeekRange, resetTimewithDate } from "@/utils/DatetimeHelper";

type ReservationMap = { [timestamp: number]: Reservation[] };

interface JXCalendarProps {
  // 日历组件的选择日期发生变化时，将事件上抛给日历页面，同时附带最新的选择日期
  onChange: (value: Date) => void;
  reservations: Reservation[];
}

function JXCalendar({ onChange, reservations }: JXCalendarProps) {
  const [reservationsMap, setReservationsMap] = useState({});

  const today = resetTimewithDate(new Date());
  const { monday: _, sunday } = getWeekRange();

  // 自定义的单元格格式化处理器
  const customDayFormatter = (day: CalendarDayObject): CalendarDayObject => {
    const date = day.value;
    // 只处理当前一周的单元格
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

  // 初始化日历数据
  const initCalendar = async () => {
    const map: ReservationMap = {};
    reservations.forEach((reservation) => {
      // 预约时间是当天的 0 点
      const key = resetTimewithDate(reservation.date).getTime();
      if (!map[key]) map[key] = [];
      map[key].push(reservation);
    });

    // 深比较，如果 map 本身没有变化，就不重新给 reservationMap 赋值，避免循环渲染
    setReservationsMap((prev) => {
      const prevStr = JSON.stringify(prev);
      const nextStr = JSON.stringify(map);
      if (prevStr === nextStr) return prev;
      return map;
    });
  };

  useEffect(() => {
    initCalendar();
  }, [reservations]);

  return (
    <Calendar
      formatter={customDayFormatter}
      showSubtitle={false}
      defaultValue={new Date()}
      onChange={onChange}
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

export default JXCalendar;
