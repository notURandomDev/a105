import { Genre } from "./genre";
import { BandPosition, CreateBandPositionInput } from "./band-position";

export type BandStatus = "recruiting" | "active" | "paused" | "disbanded";
export type BandStatusLog = {
  status: BandStatus;
  at: Date;
};

export interface Band {
  _id: string | number;
  name: string;
  description: string;
  genre: Genre[];
  positions: BandPosition[];
  formedAt: Date;
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

export interface CreateBandInput {
  name: string;
  description: string;
  genre: Genre[];
  positions: CreateBandPositionInput[];
  status: BandStatus;
  statusUpdatedAt: Date;
  statusLogs: BandStatusLog[];
}

export interface BandPickerConfig {
  _id: number | string;
  name: string;
}
