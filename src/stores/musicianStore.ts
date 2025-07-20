import { Musician } from "@/models/musician";
import { getAllMusicians } from "@/services/musicianService";
import { create } from "zustand";
import { useAppConfigStore } from "./appConfigStore";

interface MusicianStore {
  musicians: Musician[];
  setMusicians: (musicians: Musician[]) => void;
  fetchMusicians: () => Promise<void>;
}

export const useMusicianStore = create<MusicianStore>((set) => ({
  musicians: [],
  setMusicians: (musicians) => set({ musicians }),
  fetchMusicians: async () => {
    const { disableRemoteFetch } = useAppConfigStore.getState();
    if (disableRemoteFetch) return;

    const musicians = await getAllMusicians({ production: true });
    if (!musicians) return;
    set({ musicians });
  },
}));
