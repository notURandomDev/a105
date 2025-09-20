import { Musician } from "@/models/musician";
import { getMusiciansByUserID } from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export const useUserMusicians = () => {
  const { userInfo } = useUserStore();
  const [userMusicians, setUserMusicians] = useState<Musician[]>([]);

  // Derived from `userInfo`
  const userID = userInfo?._id;

  const fetchUserMusicians = async () => {
    if (!userID) return;
    const musicians = (await getMusiciansByUserID({ userID })) || [];
    setUserMusicians(musicians);
  };

  useEffect(() => {
    fetchUserMusicians();
  }, [userID]);

  return { userInfo, userMusicians, fetchUserMusicians };
};
