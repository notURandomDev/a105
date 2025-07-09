import { BandPickerConfig } from "@/models/band";
import { selectReservationsByDate } from "@/selectors/reservationSelectors";
import { createReservation } from "@/services/reservationsService";
import { useReservationStore } from "@/stores/reservationStore";
import { compareHM } from "@/utils/DatetimeHelper";
import Taro from "@tarojs/taro";
import { useState } from "react";

export type PickerType = "startTime" | "endTime" | "date" | "band" | null;

export type FormData = {
  startTime: Date | null;
  endTime: Date | null;
  date: Date;
  band: BandPickerConfig | null;
};

export const useReservationForm = () => {
  const { reservations, fetchReservations } = useReservationStore();
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

  const updatePickerValue = (value: Date) => {
    if (!activePicker) return;

    setFormData((prev) => ({
      ...prev,
      [activePicker]: value,
    }));
  };

  const updateBandPicker = (band: BandPickerConfig) => {
    setActivePicker(null);
    setFormData((prev) => ({ ...prev, band }));
  };

  const updateDatetimePicker = (date: Date) => {
    autoAdjustTime(date);
    updatePickerValue(date);
    setActivePicker(null);
  };

  // 自动调整预约时间
  const autoAdjustTime = (time: Date) => {
    const { startTime, endTime } = formData;

    // 开始时间晚于结束时间
    if (activePicker === "startTime" && endTime && !compareHM(time, endTime)) {
      const newEndTime = new Date(time.getTime());
      // 自动将结束时间基于新的开始时间往后推延一个小时
      const currentEndHour = newEndTime.getHours();
      let newEndHour = 23;
      if (currentEndHour !== 23) newEndHour = currentEndHour + 1;
      newEndTime.setHours(newEndHour);
      setFormData((prev) => ({ ...prev, endTime: newEndTime }));
    }

    // 结束时间早于开始时间

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
  };

  // 检查是否与当前已有的排练冲突
  const checkReservationConflict = async (
    date: Date,
    startTime: Date,
    endTime: Date
  ) => {
    const reservationsToday = selectReservationsByDate(reservations, date);
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
  const isFormDataValid = () => {
    const { startTime, endTime, band } = formData;
    return (
      startTime !== null &&
      endTime !== null &&
      band !== null &&
      startTime.getTime() !== endTime.getTime()
    );
  };

  // 提交表单数据
  const submitFormData = async () => {
    const { band, date, startTime, endTime } = formData;
    if (!date || !startTime || !endTime || !band) return;

    if (await checkReservationConflict(date, startTime, endTime)) {
      Taro.showToast({ icon: "error", title: "预约时间冲突" });
      return;
    }

    Taro.showLoading();
    const res = await createReservation({
      bandName: band.name,
      bandID: band._id,
      date,
      startTime,
      endTime,
    });

    if (res) {
      await fetchReservations();
      Taro.hideLoading();
      Taro.showToast({ icon: "success", title: "预约成功" });
      setTimeout(() => Taro.navigateBack(), 1000);
    }
  };

  return {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    getPickerTitle,
    isFormDataValid,
    submitFormData,
    updatePickerValue,
    isDateTimePickerActive,
    updateDatetimePicker,
    updateBandPicker,
    getReservationPreview,
  };
};
