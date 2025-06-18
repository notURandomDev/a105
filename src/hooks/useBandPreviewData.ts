import { MOCK_BANDS } from "@/constants/database/bands";
import { BandPreview } from "@/models/band";
import { getBandsByStatus } from "@/services/bandsService";
import { useEffect, useState } from "react";

interface UseBandPreviewDataParams {
  production?: boolean;
}
export const useBandPreviewData = ({
  production = false,
}: UseBandPreviewDataParams = {}) => {
  const [myBands, setMyBands] = useState<BandPreview[]>([]);
  const [activeBands, setActiveBands] = useState<BandPreview[]>(
    MOCK_BANDS.active
  );
  const [recruitingBands, setRecruitingBands] = useState<BandPreview[]>(
    MOCK_BANDS.recruiting
  );

  useEffect(() => {
    fetchActiveBands();
    fetchRecruitingBands();
  }, []);

  const fetchActiveBands = async () => {
    const bands = await getBandsByStatus({ status: "active", production });
    if (!bands) return;

    setActiveBands(
      bands.map((b) => ({
        description: b.description,
        genre: b.genre,
        missingPositions: b.missingPositions,
        name: b.name,
        occupiedPositions: b.occupiedPositions,
        status: "active",
        statusUpdatedAt: b.statusUpdatedAt,
      }))
    );
  };

  const fetchRecruitingBands = async () => {
    const bands = await getBandsByStatus({ status: "recruiting", production });
    if (!bands) return;

    setRecruitingBands(
      bands.map((b) => ({
        description: b.description,
        genre: b.genre,
        missingPositions: b.missingPositions,
        occupiedPositions: b.occupiedPositions,
        status: "recruiting",
        statusUpdatedAt: b.statusUpdatedAt,
      }))
    );
  };

  return {
    myBands,
    activeBands,
    recruitingBands,
  };
};
