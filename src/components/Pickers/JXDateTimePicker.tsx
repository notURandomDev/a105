import {
  alignDateWithTime,
  getCurrentTime,
  getWeekRange,
  resetTimewithDate,
} from "@/utils/DatetimeHelper";
import { DatetimePicker, Popup } from "@taroify/core";
import { useState } from "react";

type PickerType = "hour-minute" | "month-day";

interface JXPopupPickerProps {
  title: string;
  type: PickerType;
  open: boolean;
  date?: Date;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}

function JXDateTimePicker({
  title = "默认标题",
  type,
  open = false,
  date = new Date(),
  onConfirm,
  onCancel,
}: JXPopupPickerProps) {
  const [time, setTime] = useState(getCurrentTime());
  const { monday: _, sunday } = getWeekRange();

  const handleConfirm = () => {
    let alignedTime: Date;
    switch (type) {
      case "month-day":
        alignedTime = resetTimewithDate(time);
        break;
      case "hour-minute":
        alignedTime = alignDateWithTime(date, time);
        break;
    }
    onConfirm(alignedTime);
  };

  return (
    <Popup rounded placement="bottom" open={open} style={{ height: "50%" }}>
      <DatetimePicker
        min={type === "month-day" ? new Date() : undefined}
        max={type === "month-day" ? sunday : undefined}
        onChange={(e) => {
          setTime(e);
          console.log("time changed", e);
        }}
        value={time}
        type={type}
        filter={(type, options) => {
          if (type !== "minute") return options;
          return options.filter((option) => Number(option) % 5 === 0);
        }}
        formatter={(type, val) => {
          if (type === "month") return `${Number(val)}月`;
          if (type === "day") return `${Number(val)}号`;
          return val;
        }}
      >
        <DatetimePicker.Toolbar>
          <DatetimePicker.Button onClick={onCancel}>取消</DatetimePicker.Button>
          <DatetimePicker.Title>{title}</DatetimePicker.Title>
          <DatetimePicker.Button onClick={handleConfirm}>
            确认
          </DatetimePicker.Button>
        </DatetimePicker.Toolbar>
      </DatetimePicker>
    </Popup>
  );
}

export default JXDateTimePicker;
