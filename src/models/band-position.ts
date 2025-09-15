import { PositionType } from "./position";

export type PositionStatus = "recruiting" | "occupied";

export interface BandPosition {
  _id: string | number;
  position: PositionType;
  musicianID?: string | number; // 如果 status 为 occupied，则为乐手 ID
  nickname?: string;
  bandID: string | number;
  status: PositionStatus;
  recruitNote?: string; // 招募说明
  joinedAt?: Date; // 加入时间（可选）
}

export type CreateBandPositionRequest = Pick<
  BandPosition,
  "position" | "status" | "recruitNote" | "musicianID" | "nickname" | "joinedAt"
>;
