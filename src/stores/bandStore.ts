import { Band } from "@/models/band";
import { getAllBands } from "@/services/bandsService";
import { create } from "zustand";
import { useAppConfigStore } from "./appConfigStore";

interface BandStore {
  bands: Band[];
  setBands: (bands: Band[]) => void;
  fetchBands: () => Promise<void>;
}

export const useBandStore = create<BandStore>((set) => ({
  bands: [],
  setBands: (bands) => set({ bands }),
  fetchBands: async () => {
    const { disableRemoteFetch } = useAppConfigStore.getState();
    if (disableRemoteFetch) return;

    const bands = await getAllBands({ production: true });
    if (!bands) return;
    set({ bands });
  },
}));
