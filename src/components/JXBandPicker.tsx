import { Band } from "@/models/band";
import { getAllBands } from "@/services/bandsService";
import { JXToast } from "@/utils/toast";
import { Picker, Popup } from "@taroify/core";
import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { useEffect, useRef, useState } from "react";

interface JXBandPickerProps {
  open: boolean;
  onConfirm?: (band: { _id: string; name: string }) => void;
  onCancel?: () => void;
}

function JXBandPicker({
  open,
  onConfirm = () => {},
  onCancel = () => {},
}: JXBandPickerProps) {
  const bands = useRef<Band[]>([]);
  const [columns, setColumns] = useState<PickerOptionData[]>([]);

  const fetchBands = async () => {
    const res = await getAllBands();
    if (!res) {
      JXToast.networkError();
      return;
    }

    bands.current = res;
    const options: PickerOptionData[] = bands.current.map(({ name, _id }) => ({
      label: name,
      value: _id.toString(),
    }));
    setColumns(options);
  };

  useEffect(() => {
    fetchBands();
  }, []);

  const handleConfirm = (_id: string) => {
    const band = bands.current.find((band) => band._id === _id);
    onConfirm({ _id, name: band!.name });
  };

  return (
    <Popup open={open} rounded placement="bottom">
      <Popup.Backdrop />
      <Picker
        title="选择乐队"
        cancelText="取消"
        confirmText="确认"
        columns={columns}
        onCancel={onCancel}
        onConfirm={(value) => handleConfirm(value[0])}
      ></Picker>
    </Popup>
  );
}

export default JXBandPicker;
