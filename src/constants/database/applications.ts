import { Application } from "@/models/application";

export const MOCK_APPLICATION: Application = {
  _id: "",
  appliedAt: new Date(),
  status: "approved",
  applyingMusicianID: "",
  targetBandID: "",
  applyingBandPositionID: "",
};

export const MOCK_APPLICATIONS: Application[] = [
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
  MOCK_APPLICATION,
];
