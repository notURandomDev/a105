import { Band, BandStatus } from "@/models/band";

const MOCK_BAND: Band = {
  _id: "123",
  status: "active",
  statusUpdatedAt: new Date(),
  name: "乐队名",
  description:
    "这是一段乐队简介，很长很长很长很长很长很长很长很长很长的乐队简介",
  genre: ["Rock", "Pop"],
  members: [],
  missingPositions: [],
  occupiedPositions: [
    "bassist",
    "guitarist_lead",
    "drummer",
    "keyboardist",
    "vocalist",
  ],
  formedAt: new Date(),
  statusLogs: [],
};

export const MOCK_BANDS: Record<BandStatus, Band[]> = {
  recruiting: [MOCK_BAND, MOCK_BAND, MOCK_BAND],
  active: [MOCK_BAND],
  paused: [],
  disbanded: [],
};
