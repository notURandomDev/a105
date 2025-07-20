import { BandPosition } from "@/models/band-position";
import { getAllBandPositions } from "@/services/bandPositionService";
import { create } from "zustand";
import { useAppConfigStore } from "./appConfigStore";

interface BandPositionStore {
  bandPositions: BandPosition[];
  setBandPositions: (bandPositions: BandPosition[]) => void;
  fetchBandPositions: () => Promise<void>;
}

export const useBandPositionStore = create<BandPositionStore>((set) => ({
  bandPositions: [],
  setBandPositions: (bandPositions) => set({ bandPositions }),
  fetchBandPositions: async () => {
    const { disableRemoteFetch } = useAppConfigStore.getState();
    if (disableRemoteFetch) return;

    const bandPositions = await getAllBandPositions();
    if (!bandPositions) return;
    set({ bandPositions });
  },
}));
