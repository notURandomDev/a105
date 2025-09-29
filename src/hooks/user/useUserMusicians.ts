import { Musician } from "@/models/musician";
import { getMusiciansByUserID } from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

interface UseUserMusiciansProps {
  production?: boolean;
  lazyLoad?: boolean;
}

export const useUserMusicians = (params: UseUserMusiciansProps = {}) => {
  const { production = true, lazyLoad = false } = params;

  const { userInfo } = useUserStore();
  const [userMusicians, setUserMusicians] = useState<Musician[]>([]);

  // Derived from `userInfo`
  const userID = userInfo?._id;

  const fetchUserMusicians = async () => {
    if (!userID) return [];
    const musicians =
      (await getMusiciansByUserID({ userID, production })) || [];
    setUserMusicians(musicians);
    return musicians;
  };

  useEffect(() => {
    // 通常在只使用获取用户乐手数据能力时，开启 `lazyLoad`
    if (lazyLoad) return;
    fetchUserMusicians();
  }, [userID]);

  return { userInfo, userMusicians, fetchUserMusicians };
};
