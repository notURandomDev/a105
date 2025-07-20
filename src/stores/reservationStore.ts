import { Reservation } from "@/models/reservation";
import { getAllReservations } from "@/services/reservationsService";
import { create } from "zustand";
import { useAppConfigStore } from "./appConfigStore";

interface ReservationStore {
  reservations: Reservation[];
  setReservations: (bands: Reservation[]) => void;
  fetchReservations: () => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  setReservations: (reservations) => set({ reservations }),
  fetchReservations: async () => {
    const { disableRemoteFetch } = useAppConfigStore.getState();
    if (disableRemoteFetch) return;

    const reservations = await getAllReservations();
    if (!reservations) return;
    set({ reservations });
  },
}));
