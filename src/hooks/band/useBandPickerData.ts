import { PickerOptionData } from "@taroify/core/picker/picker.shared";
import { Band } from "@/models/band";
import { useUserBands } from "../user/useUserBands";
import { filterBandsByStatus } from "@/utils/band";

const mapBandsIntoColumns = (bands: Band[]): PickerOptionData[] =>
  bands.map(({ name, _id }) => ({
    label: name,
    value: _id.toString(),
  }));

export const useBandPickerData = () => {
  // 获取用户所在的乐队
  const { userBands } = useUserBands();
  // #[Derived(userBands)] 筛选出用户所在的活跃乐队；非活跃乐队不能进行排练预约
  const activeBands = filterBandsByStatus(userBands, "active"); // Derived from
  // #[Derived(userBands)] 将活跃乐队数据映射成 Picker 组件接收的数据类型
  const bandColumns = mapBandsIntoColumns(activeBands); // Derived from `userBands`

  return { userBands, bandColumns };
};
