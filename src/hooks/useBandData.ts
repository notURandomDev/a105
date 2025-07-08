import { BandWithPositions } from "@/models/band";
import { useState } from "react";
import { useBandsByStatus } from "./band/useBandsByStatus";
import { useBandsWithPositions } from "./band/useBandsWithPositions";

export const useBandData = () => {
  const activeBands = useBandsWithPositions(useBandsByStatus("active"));
  const recruitingBands = useBandsWithPositions(useBandsByStatus("recruiting"));

  const [myBands, setMyBands] = useState<BandWithPositions[]>([]);

  // to-do
  // 根据用户id，获取用户所在的乐队

  return {
    myBands,
    activeBands,
    recruitingBands,
  };
};
