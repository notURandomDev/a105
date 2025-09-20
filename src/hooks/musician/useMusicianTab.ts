import { Musician } from "@/models/musician";
import { getMusiciansByPositions } from "@/services/musicianService";
import { MusicianTabKey } from "@/types/components";
import { useEffect, useState } from "react";

export const useMusicianTab = () => {
  // Tab初始值：主唱
  const [activeMusicianTabKey, setActiveMusicianTabKey] =
    useState<MusicianTabKey>("vocalist");
  const [musicians, setMusicians] = useState<Musician[]>([]);

  // 根据类型获取乐手数据
  const fetchMusicians = async (tabKey: MusicianTabKey) => {
    let musicians;
    if (tabKey === "guitarist") {
      musicians = await getMusiciansByPositions({
        positions: ["guitarist_lead", "guitarist_rhythm"],
      });
    } else {
      musicians = await getMusiciansByPositions({
        positions: [tabKey],
      });
    }
    if (musicians) setMusicians(musicians);
  };

  // 监听乐手Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMusicians(activeMusicianTabKey);
  }, [activeMusicianTabKey]);

  return {
    activeMusicianTabKey,
    setActiveMusicianTabKey,
    musicians,
    fetchMusicians,
  };
};
