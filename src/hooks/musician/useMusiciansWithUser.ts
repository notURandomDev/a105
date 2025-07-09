import { selectMusiciansByUser } from "@/selectors/musicianSelectors";
import { useMusicianStore } from "@/stores/musicianStore";

export const useMusiciansWithUser = (userID: string | number) => {
  const musicians = useMusicianStore((s) => s.musicians);
  return selectMusiciansByUser(musicians, userID);
};
