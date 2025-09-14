import { PositionType } from "./position";

// 每一个乐手实体只对应一个职位，一个用户可以映射到多个乐手实体上。
export interface Musician {
  _id: string | number;
  position: PositionType;
  bio: string;
  userID: string | number; // 与[用户]实体的联系
  nickname: string; // [用户]实体的冗余字段
  bandIDs: (string | number)[]; // 与[乐队]实体的联系
}

export type CreateMusicianRequest = Pick<
  Musician,
  "position" | "userID" | "nickname" | "bio" | "bandIDs"
>;

export type UpdateMusicianRequest = Pick<
  Musician,
  "position" | "bio" | "_id"
> & { bandIDs?: (string | number)[] };

export interface MusicianDisplayLG {}

export interface MusicianDisplay {
  bio: string;
  nickname: string;
  joinedAt: Date; // 加入乐队时间
}

export interface MusicianDisplaySM {
  nickname: string;
  position: PositionType;
  joinedAt: Date; // 加入乐队时间
}

export type BandConfig = {
  bandID: string | number;
  bandName: string;
  position: PositionType;
};
export interface MusicianProfile {
  nickname: string;
  musicians: Musician[];
  bandConfigs: BandConfig[];
}
