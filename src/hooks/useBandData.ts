import { MOCK_BANDS } from "@/constants/database/bands";
import { Band } from "@/models/band";
import { getBandsByStatus } from "@/services/bandsService";
import { useEffect, useState } from "react";

interface UseBandDataParams {
  production?: boolean;
}
export const useBandData = ({ production = false }: UseBandDataParams = {}) => {
  const [myBands, setMyBands] = useState<Band[]>([]);
  const [activeBands, setActiveBands] = useState<Band[]>(MOCK_BANDS.active);
  const [recruitingBands, setRecruitingBands] = useState<Band[]>(
    MOCK_BANDS.recruiting
  );

  useEffect(() => {
    fetchActiveBands();
    fetchRecruitingBands();
  }, []);

  const fetchActiveBands = async () => {
    const bands = await getBandsByStatus({ status: "active", production });
    if (!bands) return;

    setActiveBands(bands);
  };

  const fetchRecruitingBands = async () => {
    const bands = await getBandsByStatus({ status: "recruiting", production });
    if (!bands) return;

    setRecruitingBands(bands);
  };

  // to-do
  // 根据用户id，获取用户所在的乐队

  return {
    myBands,
    activeBands,
    recruitingBands,
  };
};
