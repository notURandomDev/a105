import { Reservation } from "@/models/reservation";

export type JXReservationState = "pending" | "active" | "over";

export const getReservationState = (
  startTime: Date,
  endTime: Date
): JXReservationState => {
  const now = new Date();
  let state: JXReservationState;
  if (now < startTime) {
    state = "pending";
  } else if (now >= startTime && now <= endTime) {
    state = "active";
  } else {
    state = "over";
  }

  return state;
};

const sortReservationsOnStartTime = (
  reservations: Reservation[],
  orderBy: "desc" | "asc" = "asc"
) => {
  if (orderBy === "desc") {
    return reservations.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );
  } else {
    return reservations.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
  }
};

export const sortReservationsOnState = (reservations: Reservation[]) => {
  const groupedReservations = {
    active: [] as Reservation[],
    pending: [] as Reservation[],
    over: [] as Reservation[],
  };

  reservations.forEach((reservation) => {
    const state = getReservationState(
      new Date(reservation.startTime),
      new Date(reservation.endTime)
    );
    groupedReservations[state].push(reservation);
  });

  return [
    ...sortReservationsOnStartTime(groupedReservations.active),
    ...sortReservationsOnStartTime(groupedReservations.pending),
    ...sortReservationsOnStartTime(groupedReservations.over, "desc"),
  ];
};
