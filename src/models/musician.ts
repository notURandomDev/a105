import { Genre } from "./genre";
import { PositionType } from "./position";

// 每一个乐手实体只对应一个职位，一个用户可以映射到多个乐手实体上。
export interface Musician {
  _id: string | number;
  position: PositionType;
  bio: string;
  genre: Genre[];
  userID: string | number; // 与[用户]实体的联系
  nickname: string; // [用户]实体的冗余字段
  bandIDs: (string | number)[]; // 与[乐队]实体的联系
}

export type CreateMusicianInput = Pick<
  Musician,
  "genre" | "position" | "userID" | "nickname" | "bio" | "bandIDs"
>;

export type UpdateMusicianInput = Pick<
  Musician,
  "genre" | "position" | "bio" | "_id"
>;

export interface MusicianDisplayLG {}

export interface MusicianDisplay {
  genre: Genre[];
  bio: string;
  nickname: string;
  joinedAt: Date; // 加入乐队时间
}

export interface MusicianDisplaySM {
  nickname: string;
  position: PositionType;
  joinedAt: Date; // 加入乐队时间
}
