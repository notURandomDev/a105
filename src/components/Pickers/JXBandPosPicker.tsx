import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { PositionType } from "@/models/position";
import { Picker, Popup } from "@taroify/core";
import { PickerOptionData } from "@taroify/core/picker/picker.shared";

const BAND_POS_COLUMNS: PickerOptionData[] = Object.keys(MUSICIAN_DISPLAY).map(
  (p) => ({
    label: `${MUSICIAN_DISPLAY[p].emoji} ${MUSICIAN_DISPLAY[p].label}`,
    value: p,
  })
);

interface JXBandPosPickerProps {
  title: string;
  open: boolean;
  onConfirm?: (position: PositionType) => void;
  onCancel?: () => void;
}

function JXBandPosPicker({
  title = "选择乐手位置",
  open,
  onConfirm = () => {},
  onCancel = () => {},
}: JXBandPosPickerProps) {
  const handleConfirm = (position: string) => {
    onConfirm(position as PositionType);
  };

  return (
    <Popup open={open} rounded placement="bottom">
      <Popup.Backdrop />
      <Picker
        title={title}
        cancelText="取消"
        confirmText="确认"
        columns={BAND_POS_COLUMNS}
        onCancel={onCancel}
        onConfirm={(option) => handleConfirm(option[0])}
      />
    </Popup>
  );
}

export default JXBandPosPicker;
