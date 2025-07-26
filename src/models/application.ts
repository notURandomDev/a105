import { BandPosition } from "./band-position";
import { PositionType } from "./position";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  _id: string | number; // 唯一标识符
  appliedAt: Date; // 申请时间
  status: ApplicationStatus; // 申请状态
  applicantName: string; // 申请人名称
  applicantPosition: PositionType; // 申请人职位
  bandName: string; // 乐队名称
  bandPositions: BandPosition[];
}
