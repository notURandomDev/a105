import { Band } from "@/models/band";
import { useEffect, useState } from "react";
import { useUserMusicians } from "./useUserMusicians";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { getBandsByIDs } from "@/services/bandsService";

export const useUserBands = () => {
  const [userBands, setUserBands] = useState<Band[]>([]);

  // 使用钩子，获取用户乐手身份
  const { userInfo, userMusicians } = useUserMusicians();

  useEffect(() => {
    // 如果用户没有乐手身份，提前返回
    if (!userMusicians.length) return;

    const fetchData = async () => {
      // 从用户乐手身份中，提取出所在的全部乐队ID
      const bandIDs = extractMusicianBaseBandIDs(userMusicians);
      const { data: bands } = await getBandsByIDs({ bandIDs });
      setUserBands(bands);
    };

    fetchData();
  }, [userMusicians]); // 监听用户乐手身份

  return { userBands, userInfo, userMusicians };
};
