import { Reservation } from "@/models/reservation";
import { resetTimewithDate } from "@/utils/DatetimeHelper";

export const selectReservationsByDateRange = (
  reservations: Reservation[],
  startDate: Date,
  endDate: Date
) => {
  const filtered = reservations.filter(
    (r) =>
      r.date.getTime() >= startDate.getTime() &&
      r.date.getTime() <= endDate.getTime()
  );
  return filtered;
};

export const selectReservationsByDate = (
  reservations: Reservation[],
  date: Date
) =>
  reservations.filter(
    (r) =>
      resetTimewithDate(r.date).getTime() === resetTimewithDate(date).getTime()
  );
