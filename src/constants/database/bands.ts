import { Band, BandStatus, BandWithPositions } from "@/models/band";
import { MOCK_BAND_POSITIONS } from "./band-positions";

const MOCK_BAND_BASE_DATA = {
  name: "乐队名",
  _id: "123",
  statusUpdatedAt: new Date(),
  description:
    "这是一段乐队简介，很长很长很长很长很长很长很长很长很长的乐队简介",
  statusLogs: [],
  formedAt: new Date(),
};

export const MOCK_BAND_ACTIVE: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "active",
  formedAt: new Date(),
};

export const MOCK_BAND_RECRUITING: Band = {
  ...MOCK_BAND_BASE_DATA,
  status: "recruiting",
};

// 完全模拟后端传回的数据
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

// 与乐队位置结合后的模拟数据
export const MOCK_BANDS_WITH_POSITIONS: Record<
  BandStatus,
  BandWithPositions[]
> = {
  recruiting: [
    {
      info: MOCK_BAND_RECRUITING,
      positions: [
        ...MOCK_BAND_POSITIONS.recruiting,
        MOCK_BAND_POSITIONS.occupied[0],
      ],
    },
    {
      info: MOCK_BAND_RECRUITING,
      positions: [
        ...MOCK_BAND_POSITIONS.recruiting,
        MOCK_BAND_POSITIONS.occupied[0],
      ],
    },
    {
      info: MOCK_BAND_RECRUITING,
      positions: [
        ...MOCK_BAND_POSITIONS.recruiting,
        MOCK_BAND_POSITIONS.occupied[0],
      ],
    },
  ],
  active: [
    {
      info: MOCK_BAND_ACTIVE,
      positions: MOCK_BAND_POSITIONS.occupied,
    },
    {
      info: MOCK_BAND_ACTIVE,
      positions: MOCK_BAND_POSITIONS.occupied,
    },
  ],
  paused: [],
  disbanded: [],
};
