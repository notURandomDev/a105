import { Reservation } from "@/models/reservation";

export const MOCK_RESERVATIONS: Record<"DEFAULT" | "EMPTY", Reservation[]> = {
  DEFAULT: [
    {
      bandID: "eae5dc2d684aca03008393631fc8ab28",
      bandName: "JOINT",
      date: new Date(2025, 5, 12),
      startTime: new Date(2025, 5, 12, 0, 45),
      endTime: new Date(2025, 5, 12, 1, 0),
    },
    {
      bandID: "eae5dc2d684aca03008393631fc8ab28",
      bandName: "JOINT",
      date: new Date(2025, 5, 14),
      startTime: new Date(2025, 5, 14, 10, 0),
      endTime: new Date(2025, 5, 14, 12, 0),
    },
    {
      bandID: "53c0f997684aca480083e8a9190f1153",
      bandName: "Rockaissance",
      date: new Date(2025, 5, 15),
      startTime: new Date(2025, 5, 15, 21, 0),
      endTime: new Date(2025, 5, 15, 22, 30),
    },
  ],
  EMPTY: [],
};

export const getMockReservation = (date: Date) => ({
  bandID: "eae5dc2d684aca03008393631fc8ab28",
  bandName: "JOINT",
  date: date,
  startTime: new Date(date.setHours(18, 0)),
  endTime: new Date(date.setHours(20, 0)),
});
