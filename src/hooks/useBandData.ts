import {
  MOCK_BANDS,
  MOCK_BANDS_WITH_POSITIONS,
} from "@/constants/database/bands";
import { Band, BandWithPositions } from "@/models/band";
import { getBandsByStatus } from "@/services/bandsService";
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

  useEffect(() => {
    fetchActiveBands();
    fetchRecruitingBands();
  }, []);

  const fetchActiveBands = async () => {
    const bands = await getBandsByStatus({ status: "active", production });
    if (!bands) return;

    // 聚合成 BandWithPositions 类型
    // setActiveBands(bands);
  };

  const fetchRecruitingBands = async () => {
    const bands = await getBandsByStatus({ status: "recruiting", production });
    if (!bands) return;

    // 聚合成 BandWithPositions 类型
    // setRecruitingBands(bands);
  };

  // to-do
  // 根据用户id，获取用户所在的乐队

  return {
    myBands,
    activeBands,
    recruitingBands,
  };
};
