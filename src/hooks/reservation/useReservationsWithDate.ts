import { selectReservationsByDate } from "@/selectors/reservationSelectors";
import { useReservationStore } from "@/stores/reservationStore";

export const useReservationsWithDate = (date: Date) => {
  const reservations = useReservationStore((s) => s.reservations);
  return selectReservationsByDate(reservations, date);
};
