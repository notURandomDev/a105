import { Application } from "@/models/application";
import { create } from "zustand";
import { useAppConfigStore } from "./appConfigStore";
import { getAllApplications } from "@/services/applicationService";

interface ApplicationStore {
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  fetchApplications: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  fetchApplications: async () => {
    const { disableRemoteFetch } = useAppConfigStore.getState();
    if (disableRemoteFetch) return;

    const applications = await getAllApplications();
    if (!applications) return;
    set({ applications });
  },
}));
