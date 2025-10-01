import { Band } from "@/models/band";
import { useEffect, useState } from "react";
import { useUserMusicians } from "./useUserMusicians";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { getBandsByIDs } from "@/services/bandsService";

export const useUserBands = () => {
  // 使用钩子，获取用户乐手身份
  const { userInfo, userMusicians } = useUserMusicians();
  const [userBands, setUserBands] = useState<Band[]>([]);

  const fetchUserBands = async () => {
    // 如果用户没有乐手身份，提前返回
    if (!userMusicians.length) return [];
    // 从用户乐手身份中，提取出所在的全部乐队ID
    const bandIDs = extractMusicianBaseBandIDs(userMusicians);
    const { data: bands } = await getBandsByIDs({ bandIDs });
    setUserBands(bands);
    return bands;
  };

  useEffect(() => {
    fetchUserBands();
  }, [userMusicians]); // 监听用户乐手身份

  return { userBands, userInfo, userMusicians, fetchUserBands };
};
