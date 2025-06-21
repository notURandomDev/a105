import { Genre } from "./genre";
import { PositionType } from "./position";

export type BandStatus = "recruiting" | "active" | "paused" | "disbanded";
export type BandStatusLog = {
  status: BandStatus;
  at: Date;
};

export interface Band {
  _id: string | number;
  name: string;
  members: string[];
  description: string;
  genre: Genre[];
  missingPositions: PositionType[]; // 必须有，可以为空
  occupiedPositions: PositionType[]; // 必须有，可以为空
  formedAt: Date;
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

export interface CreateBandInput {
  name?: string;
  description: string;
  genre: Genre[];
  missingPositions: PositionType[];
  occupiedPositions: PositionType[];
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

export interface BandPickerConfig {
  _id: number | string;
  name: string;
}

// 用于乐队卡片的展示
export interface BandPreview {
  status: BandStatus;
  name?: string;
  genre: Genre[];
  description: string;
  missingPositions: PositionType[];
  occupiedPositions: PositionType[];
  statusUpdatedAt: Date;
}
