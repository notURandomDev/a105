import { Application, ApplicationStatus } from "@/models/application";
import { Band } from "@/models/band";
import { Musician } from "@/models/musician";

// 对申请记录的时间进行排序
export const selectApplicationsByTime = (applications: Application[]) =>
  applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());

// 根据申请的乐队，筛选申请记录
export const selectApplicationsByBands = (
  applications: Application[],
  bands: Band[]
) => {
  const bandIDs = bands.map((b) => b._id);
  return applications.filter((a) => {
    return bandIDs.includes(a.targetBandID);
  });
};

// 根据申请者的乐手ID，筛选申请记录
export const selectApplicationsByMusicians = (
  applications: Application[],
  musicians: Musician[]
) => {
  const musicianIDs = musicians.map((m) => m._id);
  return applications.filter((a) => musicianIDs.includes(a.applyingMusicianID));
};

// 根据申请的乐队位置ID，筛选申请记录
export const selectApplicationsByPositionID = (
  application: Application[],
  bandPositionID: string | number
) => application.filter((a) => a.applyingBandPositionID == bandPositionID);

// 根据申请的状态，筛选申请记录
export const selectApplicationByStatus = (
  application: Application[],
  status: ApplicationStatus
) => application.filter((a) => a.status === status);

// 传参：
// 1、userMusicianIDs：当前用户的乐手ID
// 2、applyingBandPositionID：申请的乐队位置ID（可能由不同的用户申请）
//
// 筛选条件：申请记录由用户发出，并且申请的乐队位置与传入的参数相符合
export const selectApplicationsByUserPendingBp = (
  applications: Application[],
  userMusicianIDs: (string | number)[],
  applyingBandPositionID: string | number
) =>
  applications.filter((a) => {
    const isUserApplying = userMusicianIDs.includes(a.applyingMusicianID);
    const isApplyingBp = a.applyingBandPositionID == applyingBandPositionID;
    return isUserApplying && isApplyingBp && a.status === "pending";
  });
