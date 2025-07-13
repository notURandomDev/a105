import { MusicianProfile } from "@/models/musician";
import { selectBandsByMusicians } from "@/selectors/bandSelectors";
import {
  selectMusicianProfiles,
  selectMusiciansByUser,
} from "@/selectors/musicianSelectors";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

export const useMusicianProfile = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const [musicianProfile, setMusicianProfile] =
    useState<MusicianProfile | null>(null);
  const allMusicians = useMusicianStore((s) => s.musicians);
  const allBands = useBandStore((s) => s.bands);

  useEffect(() => {
    if (!userID || !allMusicians || !allBands) return;

    const userMusicians = selectMusiciansByUser(allMusicians, userID);
    const userBands = selectBandsByMusicians(allBands, userMusicians);
    const mps = selectMusicianProfiles(userMusicians, userBands);
    setMusicianProfile(mps[0]);

    Taro.setNavigationBarTitle({
      title: "乐手档案｜" + userMusicians[0].nickname,
    });
  }, [userID, allMusicians, allBands]);

  return { userID, setUserID, musicianProfile };
};
