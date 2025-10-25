import {
  alignDateWithTime,
  getSteppedTime,
  getWeekRange,
  resetTimewithDate,
} from "@/utils/DatetimeHelper";
import { DatetimePicker, Popup } from "@taroify/core";
import { useEffect, useState } from "react";

type PickerType = "hour-minute" | "month-day";

interface JXPopupPickerProps {
  title: string;
  type: PickerType;
  open: boolean;
  value: Date | null;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}

// 支持 「Hour-Minute」 和 「Month-Day」 两种时间选择方式
function JXDateTimePicker(props: JXPopupPickerProps) {
  const { title = "默认标题", type, open = false, value } = props;

  const [time, setTime] = useState(getSteppedTime(new Date()));
  const { monday: _, sunday } = getWeekRange();

  const handleConfirm = () => {
    let alignedTime: Date;
    switch (type) {
      case "month-day":
        alignedTime = resetTimewithDate(time);
        break;
      case "hour-minute":
        alignedTime = alignDateWithTime(props.value ?? new Date(), time);
        break;
    }
    props.onConfirm(alignedTime);
  };

  // 由于传入的 `value` 在上层组件中也是一个状态
  // 因此需要对其进行监听，当其值变化时，更新当前组件中的时间值
  useEffect(() => {
    if (value) setTime(getSteppedTime(value));
  }, [value]);

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
          <DatetimePicker.Button onClick={props.onCancel}>
            取消
          </DatetimePicker.Button>
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
