import { Band } from "@/models/band";
import { getBandById } from "@/services/bandsService";
import { getPositionsByStatus } from "@/utils/band";
import { useEffect, useState } from "react";

interface UseBandProfileParams {
  production?: boolean;
}

export const useBandProfile = ({
  production = false,
}: UseBandProfileParams = {}) => {
  const [band, setBand] = useState<Band | null>(null);

  useEffect(() => {
    console.log("band data updated", band);
  }, [band]);

  const fetchBand = async (_id: string | number) => {
    const res = await getBandById({ _id, production });
    if (!res) return;

    setBand(res);
  };

  const isRecruiting = band?.status === "recruiting";

  const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
    band?.positions ?? []
  );

  return {
    band,
    fetchBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
  };
};
