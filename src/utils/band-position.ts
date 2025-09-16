import { BandPosition, PositionStatus } from "@/models/band-position";

export const filterPositionsByStatus = (
  positions: BandPosition[],
  status: PositionStatus
) => positions.filter((p) => p.status === status);
