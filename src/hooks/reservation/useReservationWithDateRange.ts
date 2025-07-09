import { selectReservationsByDateRange } from "@/selectors/reservationSelectors";
import { useReservationStore } from "@/stores/reservationStore";

export const useReservationWithDateRange = (startDate: Date, endDate: Date) => {
  const reservations = useReservationStore((s) => s.reservations);
  return selectReservationsByDateRange(reservations, startDate, endDate);
};
