import { Band } from "@/models/band";
import { getAllBands } from "@/services/bandsService";
import { JXToast } from "@/utils/toast";
import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useEffect, useState } from "react";

export const useBandPickerData = () => {
  const [bands, setBands] = useState<Band[]>([]);
  const bandColumns: PickerOptionData[] = bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

  const fetchBands = async () => {
    const bands = await getAllBands();
    if (!bands) {
      JXToast.networkError();
      return;
    }
    setBands(bands);
  };

  useEffect(() => {
    fetchBands();
  }, []);

  return { bands, bandColumns };
};
