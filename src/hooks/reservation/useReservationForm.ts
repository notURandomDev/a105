import { BandPickerConfig } from "@/models/band";
import {
  createReservation,
  getReservationsByDate,
  updateReservation,
} from "@/services/reservationsService";
import { compareHM } from "@/utils/DatetimeHelper";
import Taro from "@tarojs/taro";
import { useRef, useState } from "react";

export type PickerType = "startTime" | "endTime" | "date" | "band" | null;

type FormMode = "create" | "edit";

export type FormData = {
  _id?: string | number;
  startTime: Date | null;
  endTime: Date | null;
  date: Date;
  band: BandPickerConfig | null;
};

export interface CheckReservationConflict {
  (params: { date: Date; startTime: Date; endTime: Date }): Promise<boolean>;
}

export const useReservationForm = () => {
  // 表示当前表单是为了 [创建] 还是 [预约] 排练
  const formMode = useRef<FormMode>("create");
  // [Derived] 从 `formMode` 得出
  const createMode = formMode.current === "create";

  const [formData, setFormData] = useState<FormData>({
    startTime: null,
    endTime: null,
    date: new Date(),
    band: null,
  });
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  const isDateTimePickerActive = () => {
    return (
      activePicker === "startTime" ||
      activePicker === "endTime" ||
      activePicker === "date"
    );
  };

  const getPickerTitle = () => {
    if (activePicker === "startTime") return "选择排练开始时间";
    if (activePicker === "endTime") return "选择排练结束时间";
    if (activePicker === "date") return "选择排练日期";

    return "";
  };

  const updatePickerValue = (time: Date) => {
    if (!activePicker) return;
    const { startTime, endTime } = formData;

    // 在更新当前活跃 picker field 的值之前
    // 判断将要更新的值对于表单的其它 field 有没有影响

    // [Auto Adjust - `endTime`] 开始时间晚于结束时间
    if (activePicker === "startTime" && endTime && !compareHM(time, endTime)) {
      const newEndTime = new Date(time.getTime());
      // 自动将结束时间基于新的开始时间往后推延一个小时
      const currentEndHour = newEndTime.getHours();
      let newEndHour = 23;
      if (currentEndHour !== 23) newEndHour = currentEndHour + 1;
      newEndTime.setHours(newEndHour);
      setFormData((prev) => ({ ...prev, endTime: newEndTime }));
    }

    // [Auto Adjust - `startTime`] 结束时间早于开始时间
    if (
      activePicker === "endTime" &&
      startTime &&
      !compareHM(startTime, time)
    ) {
      const newStartTime = new Date(time.getTime());
      // 自动将开始时间基于新的结束时间往前提早一个小时
      const currentStartHour = newStartTime.getHours();
      let newStartHour = 0;
      if (currentStartHour !== 0) newStartHour = currentStartHour - 1;
      newStartTime.setHours(newStartHour);
      setFormData((prev) => ({ ...prev, startTime: newStartTime }));
    }

    // [Auto Adjust - `date`]
    // 更新日期时，开始时间或结束时间如果已经有选中的值
    // 需要更新开始时间或结束时间的日期
    if (activePicker === "date") {
      // 获取当前表单已有日期与待更新日期之间的差值
      const dayDiff = time.getTime() - formData.date.getTime();

      // 如果已经有开始时间，更新开始时间的日期
      if (startTime) {
        const newStartTime = startTime.getTime() + dayDiff;
        setFormData((prev) => ({ ...prev, startTime: new Date(newStartTime) }));
      }

      // 如果已经有结束时间，更新结束时间的日期
      if (endTime) {
        const newEndTime = endTime.getTime() + dayDiff;
        setFormData((prev) => ({ ...prev, endTime: new Date(newEndTime) }));
      }
    }

    // 最后，更新当前选中 field 的值
    setFormData((prev) => ({
      ...prev,
      [activePicker]: time,
    }));
  };

  const updateBandPicker = (band: BandPickerConfig) => {
    setActivePicker(null);
    setFormData((prev) => ({ ...prev, band }));
  };

  // 在点击 picker 的确认按钮时调用
  const updateDatetimePicker = (date: Date) => {
    // 1. 更新表单数据
    updatePickerValue(date);
    // 2. 重置选中的 picker field
    setActivePicker(null);
  };

  // 检查是否与当前已有的排练冲突
  const checkReservationConflict: CheckReservationConflict = async (params) => {
    const { startTime, endTime, date } = params;

    // 在 [Create Mode] 下，`formData._id` 为 `undefined`
    // 在 [Edit Mode] 下检查冲突时，应该忽略当前在云端的排练记录
    const excludeID = formData._id;
    console.log("excludeID", excludeID);

    // 获取当天的排练数据（包含不同模式下查询逻辑的差异）
    const { data: reservationsToday } = await getReservationsByDate({
      date,
      excludeID,
    });

    // 任意已经预约的排练如果满足以下条件，则想要预约的排练时间一定没冲突：
    // - 预约的排练开始时间，比已有的排练结束时间晚；那么预约的结束时间一定也比已有的排练结束时间晚
    // - 预约的排练结束时间，比已有的排练开始时间早；那么预约的开始时间一定也比已有的排练开始时间早
    return reservationsToday.some((reservation) => {
      const noConflict =
        endTime <= reservation.startTime || startTime >= reservation.endTime;
      if (!noConflict) console.log("与该预约冲突：", reservation);
      return !noConflict;
    });
  };

  // 获取排练预约的预览数据
  const getReservationPreview = () => ({
    bandName: formData.band?.name ?? "",
    date: formData.date,
    startTime: formData.startTime ?? new Date(),
    endTime: formData.endTime ?? new Date(),
    bandID: "",
  });

  // 检查表单数据是否有效 (控制CTA按钮是否禁用)
  const formValid = () => {
    const { startTime, endTime, band } = formData;
    return (
      startTime !== null &&
      endTime !== null &&
      startTime.getTime() !== endTime.getTime() &&
      band !== null
    );
  };

  // 提交表单数据
  const submitFormData = async () => {
    const { band, date, startTime, endTime, _id } = formData;
    if (!date || !startTime || !endTime || !band) return;

    // 在提交表单的时候再进行检查，减少请求的数量
    if (await checkReservationConflict({ date, startTime, endTime })) {
      Taro.showToast({ icon: "error", title: "预约时间冲突" });
      return;
    }

    Taro.showLoading();

    let res = true;

    if (formMode.current === "create") {
      res = await createReservation({
        bandName: band.name,
        bandID: band._id,
        date,
        startTime,
        endTime,
      });
    }

    if (formMode.current === "edit" && _id) {
      res = await updateReservation({
        reservationID: _id,
        data: { startTime, endTime, date },
      });
    }

    if (res) {
      Taro.hideLoading();
      Taro.showToast({
        icon: "success",
        title: createMode ? "预约成功" : "修改成功",
      });
      setTimeout(() => Taro.navigateBack(), 1000);
    }
  };

  return {
    formMode,
    createMode,
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    getPickerTitle,
    formValid,
    submitFormData,
    updatePickerValue,
    isDateTimePickerActive,
    updateDatetimePicker,
    updateBandPicker,
    getReservationPreview,
  };
};
