import { BandWithPositions } from "@/models/band";
import { getPositionsByStatus } from "@/utils/band";
import { useEffect, useState } from "react";

export const useBandProfile = () => {
  const [band, setBand] = useState<BandWithPositions | null>(null);

  useEffect(() => {
    console.log("band data updated", band);
  }, [band]);

  const isRecruiting = band?.info.status === "recruiting";

  const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
    band?.positions ?? []
  );

  return {
    band,
    setBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
  };
};
