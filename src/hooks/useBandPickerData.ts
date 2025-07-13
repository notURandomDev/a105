import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useBandsByStatus } from "./band/useBandsByStatus";
import { useEffect, useState } from "react";
import { useBandsWithUser } from "./band/useBandsWithUser";
import { Band } from "@/models/band";

export const useBandPickerData = () => {
  const activeBands = useBandsByStatus("active");
  const userBands = useBandsWithUser();
  const [bands, setBands] = useState<Band[]>([]);

  const bandColumns: PickerOptionData[] = bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

  useEffect(() => {
    const activeUserBands = [...new Set([...activeBands, ...userBands])];
    setBands(activeUserBands);
  }, [activeBands, userBands]);

  return { bands, bandColumns };
};
