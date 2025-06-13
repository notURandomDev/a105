import { Band } from "@/models/band";
import { MOCK_TYPE } from "./config";

export const MOCK_BANDS: Record<MOCK_TYPE, Band[]> = {
  DEFAULT: [
    {
      _id: "asdf",
      name: "JOINT",
      members: [],
    },
    {
      _id: "asd",
      name: "Rockaissance",
      members: [],
    },
    {
      _id: "as",
      name: "Blacknails",
      members: [],
    },
  ],
  EMPTY: [],
};
