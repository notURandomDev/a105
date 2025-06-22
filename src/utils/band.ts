import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";

export const getPositionsByStatus = (
  positions: CreateBandPositionInput[] | BandPosition[]
) => {
  const recruitingPositions = positions.filter(
    (p) => p.status === "recruiting"
  );
  const occupiedPositions = positions.filter((p) => p.status === "occupied");
  return { recruitingPositions, occupiedPositions };
};

interface GetBandWithPositionsParams {
  bandID: string;
  production?: boolean;
}

export const getBandWithPositions = async ({
  bandID,
  production = false,
}: GetBandWithPositionsParams) => {
  if (!production) return MOCK_BANDS_WITH_POSITIONS.active[0];
};
