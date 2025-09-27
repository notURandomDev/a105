import { Musician } from "@/models/musician";
import { getMusiciansByPositions } from "@/services/musicianService";
import { MusicianTabKey } from "@/types/components";
import { PaginatedState } from "@/types/ui/shared";
import { useEffect, useState } from "react";

interface MusiciansData extends PaginatedState {
  musicians: Musician[];
}

const DefaultMusiciansData: MusiciansData = {
  musicians: [],
  pagination: {
    hasMore: false,
    pageIndex: 0,
  },
};

export const useMusicianTab = () => {
  // Tab初始值：主唱
  const [activeMusicianTabKey, setActiveMusicianTabKey] =
    useState<MusicianTabKey>("vocalist");
  const [musicianData, setMusicianData] =
    useState<MusiciansData>(DefaultMusiciansData);

  // 根据类型获取乐手数据
  const fetchMusicians = async (auto = false) => {
    let fetchedData;

    const pageIndex = auto ? musicianData.pagination.pageIndex : 0;

    if (activeMusicianTabKey === "guitarist") {
      fetchedData = await getMusiciansByPositions({
        positions: ["guitarist_lead", "guitarist_rhythm"],
      });
    } else {
      fetchedData = await getMusiciansByPositions({
        positions: [activeMusicianTabKey],
      });
    }

    const { data: fetchedMusicians, hasMore } = fetchedData;
    setMusicianData((prev) => {
      const musicians = auto
        ? [...prev.musicians, ...fetchedMusicians]
        : fetchedMusicians;
      return { musicians, pagination: { hasMore, pageIndex: pageIndex + 1 } };
    });
  };

  // 监听乐手Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMusicians();
  }, [activeMusicianTabKey]);

  return {
    activeMusicianTabKey,
    setActiveMusicianTabKey,
    musicianData,
    fetchMusicians,
  };
};
