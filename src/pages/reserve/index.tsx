import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Button, Cell, Field, Input } from "@taroify/core";
import JXDateTimePicker from "@/components/Pickers/JXDateTimePicker";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import { getHMfromDate, getMDWfromDate } from "@/utils/DatetimeHelper";
import JXBandPicker from "@/components/Pickers/JXBandPicker";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { useReservationForm } from "@/hooks/reservation/useReservationForm";

export default function Reserve() {
  useLoad((options: Record<string, string>) => {
    const dateIntent = JSON.parse(options.date);
    const defaultDate = new Date(dateIntent);
    setFormData((prev) => ({
      ...prev,
      date: defaultDate,
    }));
  });

  const {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    getPickerTitle,
    isFormDataValid,
    submitFormData,
    isDateTimePickerActive,
    updateDatetimePicker,
    updateBandPicker,
    getReservationPreview,
  } = useReservationForm();

  return (
    <View className="reserve config-page">
      <JXFormLabel px>乐队信息</JXFormLabel>
      <Cell.Group inset>
        <Field isLink label="乐队名称" onClick={() => setActivePicker("band")}>
          <Input
            readonly
            value={formData.band?.name ?? ""}
            placeholder="选择乐队"
          />
        </Field>
      </Cell.Group>
      <JXBandPicker
        open={activePicker === "band"}
        onConfirm={updateBandPicker}
        onCancel={() => setActivePicker(null)}
      />
      <JXFormLabel px>排练信息</JXFormLabel>
      <Cell.Group inset>
        <Field label="排练日期" isLink onClick={() => setActivePicker("date")}>
          <Input
            readonly
            placeholder="选择日期"
            value={getMDWfromDate(formData.date)}
          />
        </Field>
        <Field
          label="排练开始时间"
          isLink
          onClick={() => setActivePicker("startTime")}
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
          onClick={() => setActivePicker("endTime")}
        >
          <Input
            readonly
            placeholder="选择时间"
            value={getHMfromDate(formData.endTime)}
          />
        </Field>
      </Cell.Group>
      {isFormDataValid() && (
        <>
          <JXFormLabel px>请确认预约信息</JXFormLabel>
          <View style={{ padding: "0 16px" }}>
            <JXReservationCard
              hideState
              reservation={getReservationPreview()}
            />
          </View>
        </>
      )}

      <JXDateTimePicker
        date={formData.date}
        type={activePicker === "date" ? "month-day" : "hour-minute"}
        title={getPickerTitle()}
        open={isDateTimePickerActive()}
        onCancel={() => setActivePicker(null)}
        onConfirm={updateDatetimePicker}
      />

      <View className="button-container">
        <Button
          className="reserve-btn"
          disabled={!isFormDataValid()}
          block
          onClick={submitFormData}
        >
          马上预约！
        </Button>
      </View>
    </View>
  );
}
