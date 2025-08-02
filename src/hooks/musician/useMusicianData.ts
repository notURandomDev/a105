import { MusicianTabs } from "@/constants/utils/musician";
import { Musician, MusicianProfile } from "@/models/musician";
import {
  selectMusicianProfiles,
  selectMusiciansWithPositions,
} from "@/selectors/musicianSelectors";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";
import { useEffect, useState } from "react";

export type musicianTabData = {
  [K in MusicianTabs]: K extends "all" ? MusicianProfile[] : Musician[];
};

export const useMusicianData = () => {
  const [activeMusicianTab, setActiveMusicianTab] =
    useState<MusicianTabs>("all");
  const [musicianTabData, setMusicianTabData] = useState<musicianTabData>({
    all: [],
    bassist: [],
    drummer: [],
    guitarist: [],
    keyboardist: [],
    vocalist: [],
  });
  const allMusicians = useMusicianStore((s) => s.musicians);
  const bands = useBandStore((s) => s.bands);

  useEffect(() => {
    if (!allMusicians || !bands) return;
    getMusicians();
  }, [activeMusicianTab, allMusicians, bands]);

  const getMusicians = async () => {
    let musicians = allMusicians;
    if (activeMusicianTab === "all") {
      const mps = selectMusicianProfiles(allMusicians, bands);
      if (!mps) return;
      setMusicianTabData((prev) => ({ ...prev, all: mps }));
      return;
    } else if (activeMusicianTab === "guitarist") {
      musicians = selectMusiciansWithPositions(allMusicians, [
        "guitarist_lead",
        "guitarist_rhythm",
      ]);
    } else {
      musicians = selectMusiciansWithPositions(allMusicians, [
        activeMusicianTab,
      ]);
    }
    setMusicianTabData((prev) => ({ ...prev, [activeMusicianTab]: musicians }));
  };

  return { musicianTabData, activeMusicianTab, setActiveMusicianTab };
};
