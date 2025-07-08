import { Band, BandStatus } from "@/models/band";

export const selectBandsByStatus = (bands: Band[], status: BandStatus) =>
  bands.filter((b) => b.status === status);
