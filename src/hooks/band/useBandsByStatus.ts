import { BandStatus } from "@/models/band";
import { selectBandsByStatus } from "@/selectors/bandSelectors";
import { useBandStore } from "@/stores/bandStore";

export const useBandsByStatus = (status: BandStatus) => {
  const bands = useBandStore((s) => s.bands);
  // return useMemo(() => selectBandsByStatus(bands, status), [bands, status]);
  return selectBandsByStatus(bands, status);
};
