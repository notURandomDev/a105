import { Band } from "@/models/band";
import { selectPositionsByBand } from "@/selectors/bandPositionSelectors";
import { useBandPositionStore } from "@/stores/bandPositionStore";

export const useBandsWithPositions = (bands: Band[]) => {
  if (!bands) return [];
  const bandPositions = useBandPositionStore((s) => s.bandPositions);
  const bandsWithPositions = bands.map((band) => {
    const positions = selectPositionsByBand(bandPositions, band._id);
    return { info: band, positions };
  });
  return bandsWithPositions;
};
