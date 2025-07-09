import { Musician } from "@/models/musician";
import { getAllMusicians } from "@/services/musicianService";
import { create } from "zustand";

interface MusicianStore {
  musicians: Musician[];
  setMusicians: (musicians: Musician[]) => void;
  fetchMusicians: () => Promise<void>;
}

export const useMusicianStore = create<MusicianStore>((set) => ({
  musicians: [],
  setMusicians: (musicians) => set({ musicians }),
  fetchMusicians: async () => {
    const musicians = await getAllMusicians({ production: true });
    if (!musicians) return;
    set({ musicians });
  },
}));
