import { BandWithPositions } from "@/models/band";
import {
  selectBandsByMusicians,
  selectBandsWithPositions,
} from "@/selectors/bandSelectors";
import { selectMusiciansByUser } from "@/selectors/musicianSelectors";
import { useBandStore } from "@/stores/bandStore";
import { useMusicianStore } from "@/stores/musicianStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export const useBandsWithUser = () => {
  const allMusicians = useMusicianStore((s) => s.musicians);
  const allBands = useBandStore((s) => s.bands);
  const { userInfo } = useUserStore();
  const [bands, setBands] = useState<BandWithPositions[]>([]);

  useEffect(() => {
    getMyBands();
  }, [allMusicians, userInfo, allBands]);

  const getMyBands = () => {
    if (!allMusicians || !userInfo || !allBands) return;
    const userMusicians = selectMusiciansByUser(allMusicians, userInfo._id);
    const bands = selectBandsByMusicians(allBands, userMusicians);
    const myBands = selectBandsWithPositions(bands);
    setBands(myBands);
  };

  return bands;
};
