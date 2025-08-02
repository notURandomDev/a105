export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  _id: string | number; // 唯一标识符
  appliedAt: Date; // 申请时间
  status: ApplicationStatus; // 申请状态
  applyingBandPositionID: string | number; // 申请加入的乐队位置ID
  applyingMusicianID: string | number; // 申请人的乐手ID
  targetBandID: string | number; // 申请加入乐队的ID
}

export type CreateApplicationInput = Pick<
  Application,
  | "appliedAt"
  | "applyingMusicianID"
  | "status"
  | "targetBandID"
  | "applyingBandPositionID"
>;
