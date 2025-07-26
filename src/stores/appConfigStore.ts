import { create } from "zustand";

interface AppConfigState {
  disableRemoteFetch: boolean;
  setDisableRemoteFetch: (value: boolean) => void;
}

export const useAppConfigStore = create<AppConfigState>((set) => ({
  disableRemoteFetch: true,
  setDisableRemoteFetch: (value) => set({ disableRemoteFetch: value }),
}));
