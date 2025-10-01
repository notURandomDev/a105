import { Application } from "@/models/application";
import { BandWithPositions } from "@/models/band";
import { getApplicationsByField } from "@/services/applicationService";
import { getBandPositionsByBand } from "@/services/bandPositionService";
import { getBandsByField } from "@/services/bandsService";
import { filterPositionsByStatus } from "@/utils/band-position";
import { mapMusiciansIntoIds } from "@/utils/musician";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { useUserMusicians } from "../user/useUserMusicians";
import { _ } from "@/cloud/cloudClient";

export const useBandProfile = () => {
  const [bandID, setBandID] = useState<string | number | null>(null);
  const [bandProfile, setBandProfile] = useState<BandWithPositions | null>(
    null
  );
  // [用户] 对 [这个乐队] 的位置发送过的 [正在处理] 的申请记录
  const [applications, setApplications] = useState<Application[]>([]);

  // 获取用户的乐手身份
  const { userMusicians } = useUserMusicians();

  // Derived from `bandProfile`：正在招募的乐队位置
  const recruitingPositions = filterPositionsByStatus(
    bandProfile?.positions ?? [],
    "recruiting"
  );

  // Derived from `bandProfile`：已经被加入的乐队位置
  const occupiedPositions = filterPositionsByStatus(
    bandProfile?.positions ?? [],
    "occupied"
  );

  // Derived from `bandProfile`：乐队是否处于招募状态
  const isRecruiting = bandProfile?.info.status === "recruiting";

  // 聚合操作：查询乐队 + 查询该乐队的位置情况
  const fetchBandProfile = async (bandID: string | number) => {
    const { data: bands } = await getBandsByField({
      conditions: [{ name: "乐队ID", field: "_id", cmd: _.eq(bandID) }],
    });
    const { data: positions } = await getBandPositionsByBand({ bandID });
    if (!bands.length || !positions.length) return;
    const band = bands[0];
    setBandProfile({ info: band, positions: positions });
  };

  // 聚合操作：获取用户对乐队位置的申请记录
  const fetchApplications = async (bandID: string | number) => {
    // 如果用户暂时没有乐手身份，代表根本没有发出过申请；直接退出
    if (!userMusicians.length) return;
    const musicianIDs = mapMusiciansIntoIds(userMusicians);

    // 获取用户对这个乐队的所有正在处理的申请记录
    const { data } = await getApplicationsByField({
      query: {
        targetBandID: [bandID],
        status: ["pending"],
        applyingMusicianID: musicianIDs,
      },
      pageIndex: 0,
    });

    setApplications(data);
  };

  // 监听：乐队ID变化之后，获取乐队数据
  // 这里通常意味着乐队详情页面被加载
  useEffect(() => {
    if (!bandID) return;
    fetchBandProfile(bandID);
    fetchApplications(bandID);
  }, [bandID, userMusicians]);

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
