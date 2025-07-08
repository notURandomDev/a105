import { BandPosition, PositionStatus } from "@/models/band-position";

export const selectPositionsByBand = (
  allBandPositions: BandPosition[],
  bandID: string | number
) => {
  return allBandPositions.filter((bp) => bp.bandID == bandID);
};

export const selectPositionsByStatus = (
  positions: BandPosition[],
  status: PositionStatus
) => positions.filter((p) => p.status === status);
