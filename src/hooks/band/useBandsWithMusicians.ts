import { Musician } from "@/models/musician";
import { useBandStore } from "@/stores/bandStore";

export const useBandsWithMusicians = (musicians: Musician[]) => {
  const uniqueBandIDs = [...new Set(musicians.flatMap((m) => m.bandIDs))];
  const band = useBandStore((s) => s.bands);
  return band.filter((b) => uniqueBandIDs.includes(b._id));
};
