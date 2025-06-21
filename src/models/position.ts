export type PositionType =
  | "vocalist"
  | "guitarist_lead"
  | "guitarist_rhythm"
  | "bassist"
  | "keyboardist"
  | "drummer";

export type PositionStatus = "recruiting" | "occupied";

export interface PositionEntry {
  position: PositionType;
  status: PositionStatus;
  userId?: string; // 如果 status 为 filled，则为乐手 ID
  recruitNote?: string; // 招募说明
  joinedAt?: string; // 加入时间（可选）
}
