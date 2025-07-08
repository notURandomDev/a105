import { MusicianTabs } from "@/constants/utils/musician";
import { Musician, MusicianProfile } from "@/models/musician";
import { getMusiciansByPositions } from "@/services/musicianService";
import { getMusicianProfiles } from "@/utils/musician";
import { useEffect, useState } from "react";

interface UseMusicianDataParams {
  production?: boolean;
}

type TabsData = {
  [K in MusicianTabs]: K extends "all" ? MusicianProfile[] : Musician[];
};

export const useMusicianData = ({
  production = false,
}: UseMusicianDataParams = {}) => {
  const [activeTab, setActiveTab] = useState<MusicianTabs>("all");
  const [tabsData, setTabsData] = useState<TabsData>({
    all: [],
    bassist: [],
    drummer: [],
    guitarist: [],
    keyboardist: [],
    vocalist: [],
  });

  useEffect(() => {
    if (!tabsData[activeTab].length) fetchMusicians();
  }, [activeTab]);

  const fetchMusicians = async () => {
    let musicians: Musician[] | undefined;
    if (activeTab === "all") {
      const mp = await getMusicianProfiles({ production: true });
      if (!mp) return;

      setTabsData((prev) => ({ ...prev, all: mp }));
      return;
    } else if (activeTab === "guitarist") {
      musicians = await getMusiciansByPositions({
        positions: ["guitarist_lead", "guitarist_rhythm"],
        production,
      });
    } else {
      musicians = await getMusiciansByPositions({
        positions: [activeTab],
        production,
      });
    }

    setTabsData((prev) => ({ ...prev, [activeTab]: musicians }));
  };

  return { tabsData, activeTab, setActiveTab, fetchMusicians };
};
