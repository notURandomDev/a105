import { useBandPickerData } from "@/hooks/band/useBandPickerData";
import { BandPickerConfig } from "@/models/band";
import { Picker, Popup } from "@taroify/core";

interface JXBandPickerProps {
  open: boolean;
  onConfirm?: (band: BandPickerConfig) => void;
  onCancel?: () => void;
}

function JXBandPicker({
  open,
  onConfirm = () => {},
  onCancel = () => {},
}: JXBandPickerProps) {
  const { bands, bandColumns } = useBandPickerData();

  const handleConfirm = (_id: number | string) => {
    const band = bands.find((band) => band._id === _id);
    onConfirm({ _id, name: band!.name } as BandPickerConfig);
  };

  return (
    <Popup open={open} rounded placement="bottom">
      <Popup.Backdrop />
      <Picker
        title="选择乐队"
        cancelText="取消"
        confirmText="确认"
        columns={bandColumns}
        onCancel={onCancel}
        onConfirm={(value) => handleConfirm(value[0])}
      ></Picker>
    </Popup>
  );
}

export default JXBandPicker;
