import { PositionType } from "./position";

export type PositionStatus = "recruiting" | "occupied";

interface BandPositionBase {
  position: PositionType;
  status: PositionStatus;
  musicianID?: string | number; // 如果 status 为 occupied，则为乐手 ID
  joinedAt?: Date; // 加入时间（可选）
  nickname?: string;
  recruitNote?: string; // 招募说明
}

export interface BandPosition extends BandPositionBase {
  _id: string | number;
  bandID: string | number;
}

export type CreateBandPositionRequest = BandPositionBase;
