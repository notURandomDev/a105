import { Musician } from "@/models/musician";

export const MOCK_MUSICIAN_PROFILE: Musician = {
  _id: "fake-doc-id",
  position: "bassist",
  bio: "这是一条测试数据",
  genre: ["Blues"],
  userID: "fake-user-id",
  nickname: "fake-user-name",
  bandIDs: ["fake-band-id"],
};
