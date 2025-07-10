import { MusicianTabs } from "@/constants/utils/musician";
import { Musician, MusicianProfile } from "@/models/musician";
import {
  selectMusicianProfiles,
  selectMusiciansWithPositions,
} from "@/selectors/musicianSelectors";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";
import { useEffect, useState } from "react";

export type TabsData = {
  [K in MusicianTabs]: K extends "all" ? MusicianProfile[] : Musician[];
};

export const useMusicianData = () => {
  const [activeTab, setActiveTab] = useState<MusicianTabs>("all");
  const [tabsData, setTabsData] = useState<TabsData>({
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
  }, [activeTab, allMusicians, bands]);

  const getMusicians = async () => {
    let musicians = allMusicians;
    if (activeTab === "all") {
      const mps = selectMusicianProfiles(allMusicians, bands);
      if (!mps) return;
      setTabsData((prev) => ({ ...prev, all: mps }));
      return;
    } else if (activeTab === "guitarist") {
      musicians = selectMusiciansWithPositions(allMusicians, [
        "guitarist_lead",
        "guitarist_rhythm",
      ]);
    } else {
      musicians = selectMusiciansWithPositions(allMusicians, [activeTab]);
    }
    setTabsData((prev) => ({ ...prev, [activeTab]: musicians }));
  };

  return { tabsData, activeTab, setActiveTab };
};
