import { BandPosition, PositionStatus } from "@/models/band-position";

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

export const MOCK_BAND_POSITIONS: Record<PositionStatus, BandPosition[]> = {
  occupied: [
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "vocalist",
      bandID: "",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "bassist",
      bandID: "",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "drummer",
      bandID: "",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "guitarist_rhythm",
      bandID: "",
    },
  ],
  recruiting: [
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "vocalist",
      bandID: "",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "bassist",
      bandID: "",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "drummer",
      bandID: "",
    },
    {
      ...MOCK_RECRUITING_BAND_POSITION_BASE_DATA,
      position: "guitarist_rhythm",
      bandID: "",
    },
    {
      ...MOCK_OCCUPIED_BAND_POSITION_BASE_DATA,
      position: "keyboardist",
      bandID: "",
    },
  ],
};
