import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useBandsByStatus } from "./band/useBandsByStatus";

export const useBandPickerData = () => {
  const bands = useBandsByStatus("active");

  const bandColumns: PickerOptionData[] = bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

  return { bands, bandColumns };
};
