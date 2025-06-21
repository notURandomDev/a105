import { Band, BandStatus } from "@/models/band";
import { Genre } from "@/models/genre";

const MOCK_BAND_BASE_DATA = {
  name: "乐队名",
  _id: "123",
  statusUpdatedAt: new Date(),
  description:
    "这是一段乐队简介，很长很长很长很长很长很长很长很长很长的乐队简介",
  genre: ["Rock", "Pop"] as Genre[],
  statusLogs: [],
  formedAt: new Date(),
};

const MOCK_BAND_ACTIVE: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "active",
  formedAt: new Date(),
  positions: [
    {
      _id: "",
      position: "vocalist",
      status: "occupied",
    },
    {
      _id: "",
      position: "bassist",
      status: "occupied",
    },
    {
      _id: "",
      position: "drummer",
      status: "occupied",
    },
    {
      _id: "",
      position: "guitarist_rhythm",
      status: "occupied",
    },
  ],
};

const MOCK_BAND_RECRUITING: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "recruiting",
  positions: [
    {
      _id: "",
      position: "vocalist",
      status: "recruiting",
    },
    {
      _id: "",
      position: "bassist",
      status: "recruiting",
    },
    {
      _id: "",
      position: "drummer",
      status: "recruiting",
    },
    {
      _id: "",
      position: "guitarist_rhythm",
      status: "recruiting",
    },
    {
      _id: "",
      position: "keyboardist",
      status: "occupied",
    },
  ],
};

export const MOCK_BANDS: Record<BandStatus, Band[]> = {
  recruiting: [
    MOCK_BAND_RECRUITING,
    MOCK_BAND_RECRUITING,
    MOCK_BAND_RECRUITING,
  ],
  active: [MOCK_BAND_ACTIVE],
  paused: [],
  disbanded: [],
};
