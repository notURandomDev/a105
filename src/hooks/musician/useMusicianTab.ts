import { getMusiciansByPositions } from "@/services/musicianService";
import { MusicianTabKey } from "@/types/components";
import { useEffect, useState } from "react";
import { usePaginatedData } from "../util/usePaginatedData";
import { PositionType } from "@/models/position";
import { Musician } from "@/models/musician";

// Tab初始值：主唱
const DefaultMusicianTabKey = "vocalist";

export const useMusicianTab = () => {
  const [activeMusicianTabKey, setActiveMusicianTabKey] =
    useState<MusicianTabKey>(DefaultMusicianTabKey);

  const { data: musiciansData, fetchPaginatedData } =
    usePaginatedData<Musician>();

  const fetchMusicians = async (autoPagination = false) => {
    return fetchPaginatedData({
      autoPagination,
      fetchFn: (pageIndex: number) => {
        const positions =
          activeMusicianTabKey === "guitarist"
            ? (["guitarist_lead", "guitarist_rhythm"] as PositionType[])
            : ([activeMusicianTabKey] as PositionType[]);
        // 根据类型获取乐手数据
        return getMusiciansByPositions({ positions, pageIndex });
      },
    });
  };

  // 监听乐手Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMusicians();
  }, [activeMusicianTabKey]);

  return {
    activeMusicianTabKey,
    setActiveMusicianTabKey,
    musiciansData,
    fetchMusicians,
  };
};
