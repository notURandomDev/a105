import {
  MUSICIAN_DISPLAY_CONFIG,
  MusicianDisplayConfig,
} from "@/constants/utils/musician";
import { PositionType } from "@/models/position";
import { Picker, Popup } from "@taroify/core";

// 将 乐手位置数组 映射成能被 Picker 使用的 Column 结构数组
const mapPositionsIntoColumns = (positions: PositionType[]) =>
  positions.map((p) => {
    const { emoji, label } = MUSICIAN_DISPLAY_CONFIG[p];
    return {
      label: `${emoji} ${label}`,
      value: p,
    };
  });

// Picker 默认包含所有数组
const allPositions = Object.keys(MUSICIAN_DISPLAY_CONFIG) as PositionType[];

interface JXBandPosPickerProps {
  title: string;
  open: boolean;
  onConfirm?: (position: PositionType) => void;
  onCancel?: () => void;
  exclude?: PositionType[];
  include?: PositionType[];
  defaultPosition?: PositionType;
}

function JXBandPosPicker({
  title = "选择乐手位置",
  open,
  onConfirm = () => {},
  onCancel = () => {},
  exclude,
  include = allPositions,
  defaultPosition,
}: JXBandPosPickerProps) {
  let columns = mapPositionsIntoColumns(include);

  // 过滤掉显式声明需要排除的内容
  if (exclude?.length)
    columns = columns.filter((p) => !exclude.includes(p.value as PositionType));

  // 将默认位置放在 picker 的第一个选项，这样能和表单的值对齐
  if (defaultPosition) {
    const firstOption = columns.find((c) => c.value === defaultPosition);
    if (!firstOption) return;
    columns = [...new Set([firstOption, ...columns])];
  }

  const handleConfirm = (position: string) => {
    onConfirm(position as PositionType);
  };

  return (
    <Popup open={open} rounded placement="bottom">
      <Popup.Backdrop />
      <Picker
        title={title}
        confirmText="确认"
        cancelText="取消"
        columns={columns}
        onCancel={onCancel}
        onConfirm={(option) => handleConfirm(option[0])}
      />
    </Popup>
  );
}

export default JXBandPosPicker;
