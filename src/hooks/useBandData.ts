import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { BandWithPositions } from "@/models/band";
import { getBandWithPositions } from "@/utils/band";
import { useEffect, useState } from "react";

interface UseBandDataParams {
  production?: boolean;
}
export const useBandData = ({ production = false }: UseBandDataParams = {}) => {
  const [myBands, setMyBands] = useState<BandWithPositions[]>([]);
  const [activeBands, setActiveBands] = useState<BandWithPositions[]>(
    MOCK_BANDS_WITH_POSITIONS.active
  );
  const [recruitingBands, setRecruitingBands] = useState<BandWithPositions[]>(
    MOCK_BANDS_WITH_POSITIONS.recruiting
  );

  const fetchActiveBands = async () => {
    const bands = await getBandWithPositions({ status: "active", production });
    if (!bands) return;

    setActiveBands(bands);
  };

  const fetchRecruitingBands = async () => {
    const bands = await getBandWithPositions({
      status: "recruiting",
      production,
    });
    if (!bands) return;

    setRecruitingBands(bands);
  };

  // to-do
  // 根据用户id，获取用户所在的乐队

  return {
    myBands,
    activeBands,
    recruitingBands,
    fetchActiveBands,
    fetchRecruitingBands,
  };
};
