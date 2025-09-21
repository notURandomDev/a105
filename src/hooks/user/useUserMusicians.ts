import { Musician } from "@/models/musician";
import { getMusiciansByUserID } from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

interface UseUserMusiciansProps {
  production?: boolean;
}

export const useUserMusicians = ({
  production = true,
}: UseUserMusiciansProps = {}) => {
  const { userInfo } = useUserStore();
  const [userMusicians, setUserMusicians] = useState<Musician[]>([]);

  // Derived from `userInfo`
  const userID = userInfo?._id;

  const fetchUserMusicians = async () => {
    if (!userID) return;
    const musicians =
      (await getMusiciansByUserID({ userID, production })) || [];
    setUserMusicians(musicians);
  };

  useEffect(() => {
    fetchUserMusicians();
  }, [userID]);

  return { userInfo, userMusicians, fetchUserMusicians };
};
