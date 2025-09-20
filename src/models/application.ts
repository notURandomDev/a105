export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface ApplicationBase {
  appliedAt: Date; // 申请时间
  status: ApplicationStatus; // 申请状态
  applyingBandPositionID: string | number; // 申请加入的乐队位置ID
  applyingMusicianID: string | number; // 申请人的乐手ID
  targetBandID: string | number; // 申请加入的乐队ID
  targetBandName: string | number; // 申请加入的乐队名（冗余 + 新增）
}

// 与TCB上的数据模型一致
export interface Application extends ApplicationBase {
  _id: string | number; // 唯一标识符
}

export type CreateApplicationRequest = ApplicationBase;
