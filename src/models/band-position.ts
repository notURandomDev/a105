import { PositionType } from "./position";

export type PositionStatus = "recruiting" | "occupied";

export interface BandPosition {
  _id: string | number;
  position: PositionType;
  userId?: string; // 如果 status 为 occupied，则为乐手 ID

  status: PositionStatus;
  recruitNote?: string; // 招募说明
  joinedAt?: string; // 加入时间（可选）
}

export type CreateBandPositionInput = Pick<
  BandPosition,
  "position" | "status" | "recruitNote"
>;
