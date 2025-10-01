import { Band, BandStatus } from "@/models/band";
import { useEffect, useState } from "react";
import { useUserMusicians } from "./useUserMusicians";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { getBandsByField } from "@/services/bandsService";
import { JxQueryCondition } from "@/services/shared";
import { _ } from "@/cloud/cloudClient";

interface UseUserBandsParams {
  status?: BandStatus;
}

export const useUserBands = (params: UseUserBandsParams = {}) => {
  const { status } = params;

  // 使用钩子，获取用户乐手身份
  const { userInfo, userMusicians } = useUserMusicians();
  const [userBands, setUserBands] = useState<Band[]>([]);

  const fetchUserBands = async () => {
    // 如果用户没有乐手身份，提前返回
    if (!userMusicians.length) return [];
    // 从用户乐手身份中，提取出所在的全部乐队ID
    const bandIDs = extractMusicianBaseBandIDs(userMusicians);

    const conditions: JxQueryCondition[] = [
      { name: "乐队ID", field: "_id", cmd: _.in(bandIDs) },
    ];
    if (status)
      conditions.push({ name: "乐队状态", field: "status", cmd: _.eq(status) });

    const { data: bands } = await getBandsByField({ conditions });
    setUserBands(bands);
    return bands;
  };

  useEffect(() => {
    fetchUserBands();
  }, [userMusicians]); // 监听用户乐手身份

  return { userBands, userInfo, userMusicians, fetchUserBands };
};
