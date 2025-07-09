import { selectReservationsByBands } from "@/selectors/reservationSelectors";
import { useReservationStore } from "@/stores/reservationStore";

export const useReservationsWithBands = (bandIDs: (string | number)[]) => {
  const reservations = useReservationStore((s) => s.reservations);
  return selectReservationsByBands(reservations, bandIDs);
};
