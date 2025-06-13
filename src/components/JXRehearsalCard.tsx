import { Text, View } from "@tarojs/components";
import JXCardContainer from "./JXCardContainer";
import JXTitleLabel from "./Labels/JXTitleLabel";
import JXChip from "./JXChip";
import { JXColor } from "@/constants/colors/theme";
import { Reservation } from "@/models/reservation";
import { getHMfromDate, getMDfromDate } from "@/utils/DatetimeHelper";

export type JXRehearsalState = "pending" | "active" | "over";

type RehearsalStateValue = {
  label: string;
  color: JXColor;
};

const REHEARSAL_STATE: Record<JXRehearsalState, RehearsalStateValue> = {
  pending: { label: "待开始", color: "blue" },
  active: { label: "进行中", color: "green" },
  over: { label: "已结束", color: "gray" },
};

const getRehearsalState = (
  startTime: Date,
  endTime: Date
): RehearsalStateValue => {
  const now = new Date();
  let state: JXRehearsalState;
  if (now < startTime) {
    state = "pending";
  } else if (now >= startTime && now <= endTime) {
    state = "active";
  } else {
    state = "over";
  }

  return REHEARSAL_STATE[state];
};

interface JXRehearsalCardProps {
  reservation: Reservation;
  hideDate?: boolean;
  hideTime?: boolean;
}
function JXRehearsalCard({
  reservation,
  hideDate = false,
  hideTime = false,
}: JXRehearsalCardProps) {
  const { startTime, endTime, bandName, date } = reservation;
  const { color, label } = getRehearsalState(startTime, endTime);

  return (
    <JXCardContainer color={color}>
      <JXTitleLabel>{bandName}</JXTitleLabel>
      <View className="container-h" style={{ alignItems: "center" }}>
        <JXChip color={color}>{label}</JXChip>
        <View
          className="container-h grow"
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
          }}
        >
          {!hideDate && (
            <Text style={{ fontSize: 13 }}>{`${getMDfromDate(date)}`}</Text>
          )}
          {!hideTime && (
            <Text style={{ fontSize: 13 }}>{`${getHMfromDate(
              startTime
            )}-${getHMfromDate(endTime)}`}</Text>
          )}
        </View>
      </View>
    </JXCardContainer>
  );
}

export default JXRehearsalCard;
