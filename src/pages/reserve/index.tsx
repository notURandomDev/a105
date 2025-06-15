import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input, Toast } from "@taroify/core";
import { useEffect, useState } from "react";
import JXDateTimePicker from "@/components/JXDateTimePicker";
import { FieldType, FormDataProps } from "./types";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import {
  compareHM,
  getHMfromDate,
  getMDWfromDate,
} from "@/utils/DatetimeHelper";
import {
  createReservation,
  getReservationsByDate,
} from "@/services/reservationsService";
import JXBandPicker from "@/components/JXBandPicker";
import JXReservationCard from "@/components/JXReservationCard";

export default function Reserve() {
  useLoad((options: Record<string, string>) => {
    const dateString = JSON.parse(options.date);
    const parsedDate = new Date(dateString);
    setFormData((prev) => ({
      ...prev,
      date: parsedDate,
    }));
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [bandPickerVisible, setBandPickerVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [activeFieldType, setActiveFieldType] = useState<FieldType | null>(
    null
  );
  const [formData, setFormData] = useState<FormDataProps>({
    startTime: null,
    endTime: null,
    date: new Date(),
    band: null,
  });

  useEffect(() => {
    setCtaEnabled(validateFormFields());
  }, [formData]);

  const showPopup = (title: string, fieldType: FieldType) => {
    // pass data
    setPopupVisible(true);
    setPopupTitle(title);
    setActiveFieldType(fieldType);
  };

  const updateFieldValue = (value: Date) => {
    if (!activeFieldType) return;

    setFormData((prev) => ({
      ...prev,
      [activeFieldType]: value,
    }));
  };

  const validateEndTime = (endTime: Date) => {
    const startTime = formData.startTime;
    if (!startTime) return true;

    if (!compareHM(startTime, endTime)) {
      setToastVisible(true);
      return false;
    }

    return true;
  };

  const validateFormFields = () => {
    return (
      formData.startTime !== null &&
      formData.endTime !== null &&
      formData.band !== null
    );
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

  return (
    <View className="reserve config-page">
      <JXFormLabel>乐队信息</JXFormLabel>
      <Cell.Group inset>
        <Field
          isLink
          label="乐队名称"
          onClick={() => {
            setBandPickerVisible(true);
          }}
        >
          <Input
            readonly
            value={formData.band?.name ?? ""}
            placeholder="选择乐队"
          />
        </Field>
      </Cell.Group>
      <JXBandPicker
        open={bandPickerVisible}
        onConfirm={(band) => {
          console.log(band);
          setBandPickerVisible(false);
          setFormData((prev) => ({ ...prev, band }));
        }}
        onCancel={() => setBandPickerVisible(false)}
      />
      <JXFormLabel>排练信息</JXFormLabel>
      <Cell.Group inset>
        <Field
          label="排练日期"
          isLink
          onClick={() => showPopup("选择排练日期", FieldType.Date)}
        >
          <Input
            readonly
            placeholder="选择日期"
            value={getMDWfromDate(formData.date)}
          />
        </Field>
        <Field
          label="排练开始时间"
          isLink
          onClick={() => showPopup("选择排练开始时间", FieldType.Start)}
        >
          <Input
            readonly
            placeholder="选择时间"
            value={getHMfromDate(formData.startTime)}
          />
        </Field>
        <Field
          label="排练结束时间"
          isLink
          onClick={() => showPopup("选择排练结束时间", FieldType.End)}
        >
          <Input
            readonly
            placeholder="选择时间"
            value={getHMfromDate(formData.endTime)}
          />
        </Field>
      </Cell.Group>
      {ctaEnabled && (
        <>
          <JXFormLabel>请确认预约信息</JXFormLabel>
          <View style={{ padding: "0 16px" }}>
            <JXReservationCard
              hideState
              reservation={{
                bandName: formData.band?.name ?? "",
                date: formData.date,
                startTime: formData.startTime ?? new Date(),
                endTime: formData.endTime ?? new Date(),
                bandID: "",
              }}
            />
          </View>
        </>
      )}

      <JXDateTimePicker
        date={formData.date}
        type={activeFieldType === FieldType.Date ? "month-day" : "hour-minute"}
        title={popupTitle}
        open={popupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={(value) => {
          if (activeFieldType === FieldType.End && !validateEndTime(value))
            return;
          setPopupVisible(false);
          updateFieldValue(value);
        }}
      />

      <View className="button-container">
        <Button
          className="reserve-btn"
          disabled={!ctaEnabled}
          block
          onClick={submitFormData}
        >
          马上预约！
        </Button>
      </View>
      <Toast
        open={toastVisible}
        onClose={setToastVisible}
        type="fail"
        duration={1500}
      >
        结束时间应晚于开始时间
      </Toast>
    </View>
  );
}
