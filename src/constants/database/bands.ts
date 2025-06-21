import { Band, BandStatus } from "@/models/band";
import { PositionStatus } from "@/models/band-position";
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

const MOCK_RECRUITING_BAND_POSITION_BASE_DATA = {
  _id: "",
  nickname: "Kyle",
  status: "recruiting" as PositionStatus,
  recruitNote:
    "这是一串招募信息，招募的乐手应该符合这些条件;这是一串招募信息，招募的乐手应该符合这些条件",
};

const MOCK_OCCUPIED_BAND_POSITION_BASE_DATA = {
  _id: "",
  nickname: "Kyle",
  status: "occupied" as PositionStatus,
};

export const MOCK_BAND_ACTIVE: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "active",
  formedAt: new Date(),
  positions: [
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "vocalist",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "bassist",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "drummer",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "guitarist_rhythm",
    },
  ],
};

export const MOCK_BAND_RECRUITING: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "recruiting",
  positions: [
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "vocalist",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "bassist",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "drummer",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "guitarist_rhythm",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "keyboardist",
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
