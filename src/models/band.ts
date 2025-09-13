import { Genre } from "./genre";
import { BandPosition } from "./band-position";

export type BandStatus = "recruiting" | "active" | "paused" | "disbanded";
export type BandStatusLog = {
  status: BandStatus;
  at: Date;
};

// 与后端完全吻合的数据模型
export interface Band {
  _id: string | number;
  name: string;
  description: string;
  genre: Genre[];
  formedAt: Date;
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

// 创建乐队用的表单类型
export interface CreateBandInput {
  name: string;
  description: string;
  genre: Genre[];
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

// 乐队卡片用到的类型
export interface BandWithPositions {
  info: Band;
  positions: BandPosition[];
}

export interface BandPickerConfig {
  _id: number | string;
  name: string;
}
