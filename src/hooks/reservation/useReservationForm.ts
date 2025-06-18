import { BandPickerConfig } from "@/models/band";
import {
  createReservation,
  getReservationsByDate,
} from "@/services/reservationsService";
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

interface UseReservationFormParams {
  production?: boolean;
}

export const useReservationForm = ({
  production = false,
}: UseReservationFormParams = {}) => {
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
    if (!validateTime(date)) return;

    updatePickerValue(date);
    setActivePicker(null);
  };

  const validateTime = (time: Date) => {
    const MODAL_CONFIG = { title: "请重新选择排练时间", showCancel: false };
    const { startTime, endTime } = formData;

    if (activePicker === "startTime" && endTime && !compareHM(time, endTime)) {
      Taro.showModal({
        ...MODAL_CONFIG,
        content: "排练开始时间应早于结束时间",
      });
      return false;
    }
    if (
      activePicker === "endTime" &&
      startTime &&
      !compareHM(startTime, time)
    ) {
      Taro.showModal({
        ...MODAL_CONFIG,
        content: "排练结束时间应晚于开始时间",
      });
      return false;
    }

    return true;
  };

  const checkReservationConflict = async (
    date: Date,
    startTime: Date,
    endTime: Date
  ) => {
    const allReservations = await getReservationsByDate(date);
    return allReservations.some((reservation) => {
      const noConflict =
        endTime <= reservation.startTime || startTime >= reservation.endTime;

      if (!noConflict) console.log("与该预约冲突：", reservation);
      return !noConflict;
    });
  };

  const getReservationPreview = () => ({
    bandName: formData.band?.name ?? "",
    date: formData.date,
    startTime: formData.startTime ?? new Date(),
    endTime: formData.endTime ?? new Date(),
    bandID: "",
  });
  const isFormDataValid = () => {
    return (
      formData.startTime !== null &&
      formData.endTime !== null &&
      formData.band !== null
    );
  };

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
      Taro.hideLoading();
      Taro.showToast({ icon: "success", title: "预约成功" });
      setTimeout(() => Taro.navigateBack(), 2000);
    }
  };

  return {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    getPickerTitle,
    isFormDataValid,
    validateTime,
    submitFormData,
    updatePickerValue,
    isDateTimePickerActive,
    updateDatetimePicker,
    updateBandPicker,
    getReservationPreview,
  };
};
