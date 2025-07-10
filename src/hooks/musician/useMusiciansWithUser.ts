import { Musician } from "@/models/musician";
import { selectMusiciansByUser } from "@/selectors/musicianSelectors";
import { useMusicianStore } from "@/stores/musicianStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export const useMusiciansWithUser = () => {
  const { musicians, fetchMusicians } = useMusicianStore();
  const { userInfo } = useUserStore();

  const [userMusicians, setUserMusicians] = useState<Musician[]>([]);

  useEffect(() => {
    if (!userInfo) return;
    setUserMusicians(selectMusiciansByUser(musicians, userInfo._id));
  }, [userInfo, musicians]);

  return { userMusicians, fetchMusicians };
};
