import { Genre } from "./genre";
import { PositionType } from "./position";

// 每一个乐手实体只对应一个职位，一个用户可以映射到多个乐手实体上。
export interface Musician {
  _id: string | number;
  userId: string | number;
  position: PositionType;
  bio: string;
  nickname: string;
  startedLearningAt: Date; // 只展示年份
}

export interface MusicianDisplayLG {}

export interface MusicianDisplay {
  nickname: string;
  genre: Genre[];
  bio: string;
  joinedAt: Date; // 加入乐队时间
}

export interface MusicianDisplaySM {
  nickname: string;
  position: PositionType;
  joinedAt: Date; // 加入乐队时间
}
