import { Application } from "@/models/application";
import { BandWithPositions } from "@/models/band";
import { selectPositionsByStatus } from "@/selectors/bandPositionSelectors";
import { getApplicationsByField } from "@/services/applicationService";
import { getBandPositionsByBand } from "@/services/bandPositionService";
import { getBandById } from "@/services/bandsService";
import { getMusiciansByUserID } from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { mapMusiciansIntoIds } from "@/utils/musician";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

export const useBandProfile = () => {
  const [bandID, setBandID] = useState<string | number | null>(null);
  const [bandProfile, setBandProfile] = useState<BandWithPositions | null>(
    null
  );
  // 用户对这个乐队的位置发送过的申请记录
  const [applications, setApplications] = useState<Application[]>([]);

  const { userInfo } = useUserStore();

  // Derived from `bandProfile`：正在招募的乐队位置
  const recruitingPositions = selectPositionsByStatus(
    bandProfile?.positions ?? [],
    "recruiting"
  );

  // Derived from `bandProfile`：已经被加入的乐队位置
  const occupiedPositions = selectPositionsByStatus(
    bandProfile?.positions ?? [],
    "occupied"
  );

  // Derived from `bandProfile`：乐队是否处于招募状态
  const isRecruiting = bandProfile?.info.status === "recruiting";

  // 聚合操作：查询乐队 + 查询该乐队的位置情况
  const fetchBandProfile = async (bandID: string | number) => {
    const band = await getBandById({ _id: bandID });
    const positions = await getBandPositionsByBand({ bandID });
    if (!band || !positions) return;
    setBandProfile({ info: band, positions: positions });
  };

  // 聚合操作：获取用户对乐队位置的申请记录
  const fetchApplications = async (bandID: string | number) => {
    if (!userInfo?._id) return;
    // 1. 获取用户的乐手身份
    // 如果用户暂时没有乐手身份，代表根本没有发出过申请；直接退出
    const musicians =
      (await getMusiciansByUserID({ userID: userInfo._id })) || [];
    if (!musicians.length) return;
    const musicianIDs = mapMusiciansIntoIds(musicians);

    // 2. 获取对这个乐队的所有申请记录
    const fetchedApplications =
      (await getApplicationsByField({
        field: "targetBandID",
        value: [bandID],
      })) || [];

    // 3. 筛选出由用户发出的申请记录
    const userSentApplications = fetchedApplications.filter((a) =>
      musicianIDs.includes(a.applyingMusicianID)
    );

    setApplications(userSentApplications);
  };

  // 监听：乐队ID变化之后，获取乐队数据
  // 这里通常意味着乐队详情页面被加载
  useEffect(() => {
    if (!bandID) return;
    fetchBandProfile(bandID);
    fetchApplications(bandID);
  }, [bandID]);

  // 监听：获取到乐队信息之后，更新页面标题
  useEffect(() => {
    const title = bandProfile?.info.name || "乐队详情";
    Taro.setNavigationBarTitle({ title });
  }, [bandProfile]);

  return {
    bandProfile,
    fetchBandProfile,
    applications,
    fetchApplications,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
    bandID,
    setBandID,
  };
};
