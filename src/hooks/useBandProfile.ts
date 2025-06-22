import { BandWithPositions } from "@/models/band";
import { getBandWithPositions, getPositionsByStatus } from "@/utils/band";
import { useEffect, useState } from "react";

interface UseBandProfileParams {
  production?: boolean;
}

export const useBandProfile = ({
  production = false,
}: UseBandProfileParams = {}) => {
  const [band, setBand] = useState<BandWithPositions | null>(null);

  useEffect(() => {
    console.log("band data updated", band);
  }, [band]);

  const fetchBand = async (_id: string | number) => {
    const res = await getBandWithPositions({ bandID: "" });
    if (!res) return;

    setBand(res);
  };

  const isRecruiting = band?.info.status === "recruiting";

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
