import { Musician } from "@/models/musician";

export const selectMusiciansByUser = (
  musicians: Musician[],
  userID: string | number
) => musicians.filter((m) => m.userID === userID);
