import { Band, BandPickerConfig } from "@/models/band";
import { filterBandsByStatus } from "@/utils/band";
import { Picker, Popup } from "@taroify/core";
import { PickerOptionData } from "@taroify/core/picker/picker.shared";

const mapBandsIntoColumns = (bands: Band[]): PickerOptionData[] =>
  bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

interface JXBandPickerProps {
  open: boolean;
  onConfirm?: (band: BandPickerConfig) => void;
  onCancel?: () => void;
  bands: Band[];
}

function JXBandPicker({
  open,
  onConfirm = () => {},
  onCancel = () => {},
  bands,
}: JXBandPickerProps) {
  const handleConfirm = (_id: number | string) => {
    const band = bands.find((band) => band._id === _id);
    onConfirm({ _id, name: band!.name } as BandPickerConfig);
  };

  // #[Derived(userBands)] 筛选出用户所在的活跃乐队；非活跃乐队不能进行排练预约
  const activeBands = filterBandsByStatus(bands, "active"); // Derived from `userBands`
  // #[Derived(userBands)] 将活跃乐队数据映射成 Picker 组件接收的数据类型
  const bandColumns = mapBandsIntoColumns(activeBands); // Derived from `userBands`

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
      />
    </Popup>
  );
}

export default JXBandPicker;
