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
import { useUserBands } from "@/hooks/user/useUserBands";
import { BandPickerConfig } from "@/models/band";
import Taro from "@tarojs/taro";

export default function Reserve() {
  useLoad((options: Record<string, string>) => {
    // 如果接收的参数为 `date`，说明是从日历界面来的，想要创建预约
    if (options.date) {
      formMode.current = "create";
      Taro.setNavigationBarTitle({ title: "创建排练预约" });

      const dateIntent = JSON.parse(options.date);
      // 该日期已经重置到当日凌晨
      const defaultDate = new Date(dateIntent);

      setFormData((prev) => ({
        ...prev,
        date: defaultDate,
      }));
    }

    // 如果接收的参数为 `reservation`，说明是从首页来的，想要编辑已有的预约
    if (options.reservation) {
      formMode.current = "edit";
      Taro.setNavigationBarTitle({ title: "编辑预约记录" });

      const reservation = JSON.parse(options.reservation);
      const { startTime, endTime, date, bandName, bandID, _id } = reservation;
      const band: BandPickerConfig = { _id: bandID, name: bandName };

      setFormData({
        _id,
        band,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        date: new Date(date),
      });
    }
  });

  const {
    formMode,
    createMode,
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    getPickerTitle,
    formValid,
    submitFormData,
    isDateTimePickerActive,
    updateDatetimePicker,
    updateBandPicker,
    getReservationPreview,
  } = useReservationForm();

  const { userBands, fetchUserBands } = useUserBands({ status: "active" });

  const routeLabelText = ({ create, edit }) => {
    if (createMode) return create;
    return edit;
  };

  return (
    <View className="reserve config-page">
      <JXFormLabel px>
        {`为你的乐队${routeLabelText({
          create: "预约",
          edit: "修改",
        })}排练`}
      </JXFormLabel>
      <Cell.Group inset>
        <Field
          isLink={formMode.current === "create"}
          label="乐队名称"
          onClick={async () => {
            if (!createMode) return;

            await fetchUserBands();
            setActivePicker("band");
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
        bands={userBands}
        open={activePicker === "band"}
        onConfirm={updateBandPicker}
        onCancel={() => setActivePicker(null)}
      />
      <JXFormLabel px>{`${routeLabelText({
        create: "填写",
        edit: "编辑",
      })}排练的时间信息`}</JXFormLabel>
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
      {formValid() && (
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
          disabled={!formValid()}
          block
          onClick={submitFormData}
        >
          {routeLabelText({ create: "马上预约！", edit: "更新预约" })}
        </Button>
      </View>
    </View>
  );
}
