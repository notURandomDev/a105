import { Band } from "@/models/band";
import { getAllBands } from "@/services/bandsService";
import { create } from "zustand";

interface BandStore {
  bands: Band[];
  setBands: (bands: Band[]) => void;
  fetchBands: () => Promise<void>;
}

export const useBandStore = create<BandStore>((set) => ({
  bands: [],
  setBands: (bands) => set({ bands }),
  fetchBands: async () => {
    const bands = await getAllBands({ production: true });
    if (!bands) return;
    set({ bands });
  },
}));
