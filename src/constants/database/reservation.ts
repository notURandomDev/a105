import { Reservation } from "@/models/reservation";
import { MOCK_TYPE } from "./config";

export const MOCK_RESERVATIONS: Record<MOCK_TYPE, Reservation[]> = {
  DEFAULT: [
    {
      bandName: "JOINT",
      date: new Date(2025, 5, 12),
      startTime: new Date(2025, 5, 12, 0, 45),
      endTime: new Date(2025, 5, 12, 1, 0),
    },
    {
      bandName: "JOINT",
      date: new Date(2025, 5, 13),
      startTime: new Date(2025, 5, 13, 18, 0),
      endTime: new Date(2025, 5, 13, 22, 0),
    },
    {
      bandName: "undefine",
      date: new Date(2025, 5, 12),
      startTime: new Date(2025, 5, 13, 10, 45),
      endTime: new Date(2025, 5, 13, 11, 45),
    },
  ],
  EMPTY: [],
};

export const getMockReservation = (date: Date) => ({
  bandName: "JOINT",
  date: date,
  startTime: new Date(date.setHours(18, 0)),
  endTime: new Date(date.setHours(20, 0)),
});
