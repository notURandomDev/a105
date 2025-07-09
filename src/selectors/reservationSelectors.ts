import { Reservation } from "@/models/reservation";
import { resetTimewithDate } from "@/utils/DatetimeHelper";

// 筛选当前一周的预约记录
export const selectReservationsByDateRange = (
  reservations: Reservation[],
  startDate: Date,
  endDate: Date
) =>
  reservations.filter(
    (r) =>
      r.date.getTime() >= startDate.getTime() &&
      r.date.getTime() <= endDate.getTime()
  );

// 筛选当前一天的预约记录
export const selectReservationsByDate = (
  reservations: Reservation[],
  date: Date
) =>
  reservations.filter(
    (r) =>
      resetTimewithDate(r.date).getTime() === resetTimewithDate(date).getTime()
  );

// 筛选符合乐队ID的所有预约记录
export const selectReservationsByBands = (
  reservations: Reservation[],
  bandIDs: (string | number)[]
) => reservations.filter((r) => bandIDs.includes(r.bandID));
