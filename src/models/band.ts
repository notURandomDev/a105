import { BandPosition } from "./band-position";

export type BandStatus = "recruiting" | "active" | "paused" | "disbanded";
export type BandStatusLog = {
  status: BandStatus;
  at: Date;
};

interface BandBase {
  name: string;
  description: string;
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

// 与后端完全吻合的数据模型
export interface Band extends BandBase {
  _id: string | number;
  formedAt: Date;
}

// 创建乐队用的表单类型
export type CreateBandRequest = BandBase;

// 用于更新乐队信息
export interface UpdateBandRequest {
  status?: BandStatus;
  statusLogs?: BandStatusLog[];
  statusUpdatedAt?: Date;
  formedAt?: Date;
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
