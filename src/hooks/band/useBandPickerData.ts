import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useEffect, useState } from "react";
import { Band } from "@/models/band";
import { getBandsByIDs } from "@/services/bandsService";
import { extractMusicianBaseBandIDs, filterBandsByStatus } from "@/utils/band";
import { useUserMusicians } from "../musician/useUserMusicians";

const mapBandsIntoColumns = (bands: Band[]): PickerOptionData[] =>
  bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

export const useBandPickerData = () => {
  const [bands, setBands] = useState<Band[]>([]);
  const bandColumns = mapBandsIntoColumns(bands); // Derived from `bands`

  // 1. 获取用户的乐手数据
  const { userMusicians } = useUserMusicians();

  // 2. 获取用户乐手所在的band
  const fetchBands = (bandIDs: (string | number)[]) => {
    return getBandsByIDs({ bandIDs });
  };

  useEffect(() => {
    const fetchData = async () => {
      const bandIDs = extractMusicianBaseBandIDs(userMusicians);
      const fetchedBands = (await fetchBands(bandIDs)) || [];
      const activeBands = filterBandsByStatus(fetchedBands, "active");
      setBands(activeBands);
    };

    // 将用户所在的活跃乐队作为 picker 数据源
    fetchData();
  }, [userMusicians]);

  return { bands, bandColumns };
};
