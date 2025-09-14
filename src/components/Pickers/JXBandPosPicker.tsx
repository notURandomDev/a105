import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";
import { PositionType } from "@/models/position";
import { Picker, Popup } from "@taroify/core";
import { PickerOptionData } from "@taroify/core/picker/picker.shared";

const BAND_POS_COLUMNS: PickerOptionData[] = Object.keys(
  MUSICIAN_DISPLAY_CONFIG
).map((p) => ({
  label: `${MUSICIAN_DISPLAY_CONFIG[p].emoji} ${MUSICIAN_DISPLAY_CONFIG[p].label}`,
  value: p,
}));

interface JXBandPosPickerProps {
  title: string;
  open: boolean;
  onConfirm?: (position: PositionType) => void;
  onCancel?: () => void;
  exclude?: PositionType[];
}

function JXBandPosPicker({
  title = "选择乐手位置",
  open,
  onConfirm = () => {},
  onCancel = () => {},
  exclude,
}: JXBandPosPickerProps) {
  const handleConfirm = (position: string) => {
    onConfirm(position as PositionType);
  };

  const optionsToExclude = new Set(exclude);
  const pickerColumns = BAND_POS_COLUMNS.filter(
    (p) => p.value && !optionsToExclude.has(p.value as PositionType)
  );

  return (
    <Popup open={open} rounded placement="bottom">
      <Popup.Backdrop />
      <Picker
        title={title}
        cancelText="取消"
        confirmText="确认"
        columns={pickerColumns}
        onCancel={onCancel}
        onConfirm={(option) => handleConfirm(option[0])}
      />
    </Popup>
  );
}

export default JXBandPosPicker;
