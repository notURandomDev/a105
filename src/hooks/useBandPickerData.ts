import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useEffect, useState } from "react";
import { Band } from "@/models/band";
import { useUserStore } from "@/stores/userStore";
import { getMusiciansByUserID } from "@/services/musicianService";
import { getBandsByIDs } from "@/services/bandsService";
import { selectBandsByStatus } from "@/selectors/bandSelectors";
import { extractMusicianBaseBandIDs } from "@/utils/band";

const mapBandsIntoColumns = (bands: Band[]): PickerOptionData[] =>
  bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

export const useBandPickerData = () => {
  const { userInfo } = useUserStore();
  const [bands, setBands] = useState<Band[]>([]);

  // Derived from `bands`
  const bandColumns = mapBandsIntoColumns(bands);

  // 1. 获取用户的乐手数据
  const fetchMusicians = (userID: string | number) => {
    return getMusiciansByUserID({ userID });
  };

  // 2. 获取用户乐手所在的band
  const fetchBands = (bandIDs: (string | number)[]) => {
    return getBandsByIDs({ bandIDs });
  };

  useEffect(() => {
    const fetchData = async () => {
      const userID = userInfo?._id;
      if (!userID) return;

      const musicians = (await fetchMusicians(userID)) || [];
      const bandIDs = extractMusicianBaseBandIDs(musicians);
      const fetchedBands = (await fetchBands(bandIDs)) || [];
      const activeBands = selectBandsByStatus(fetchedBands, "active");
      setBands(activeBands);
    };

    // 将用户所在的活跃乐队作为 picker 数据源
    fetchData();
  }, []);

  return { bands, bandColumns };
};
