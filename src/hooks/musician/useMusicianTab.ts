import { getMusiciansByPositions } from "@/services/musicianService";
import { MusicianTabKey } from "@/types/components";
import { useEffect, useState } from "react";
import { usePaginatedData } from "../util/usePaginatedData";
import { PositionType } from "@/models/position";
import { Musician } from "@/models/musician";

export const useMusicianTab = () => {
  // Tab初始值：主唱
  const [activeMusicianTabKey, setActiveMusicianTabKey] =
    useState<MusicianTabKey>("vocalist");

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
