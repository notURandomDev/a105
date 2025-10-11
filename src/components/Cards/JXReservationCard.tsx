import { Text, View } from "@tarojs/components";

import { ReservationBase } from "@/models/reservation";
import { getHMfromDate, getMDWfromDate } from "@/utils/DatetimeHelper";
import { getReservationState, JXReservationState } from "@/utils/reservation";
import { JXColor } from "@/constants/colors/theme";
import JXCardContainer from "../JXCardContainer";
import JXChip from "../JXChip";
import JXTitleLabel from "../Labels/JXTitleLabel";

type ReservationStateValue = {
  label: string;
  color: JXColor;
};

const RESERVATION_STATE: Record<JXReservationState, ReservationStateValue> = {
  active: { label: "进行中", color: "green" },
  pending: { label: "待开始", color: "blue" },
  over: { label: "已结束", color: "gray" },
};

interface JXReservationCardProps {
  reservation: ReservationBase;
  hideDate?: boolean;
  hideTime?: boolean;
  hideState?: boolean;
}
function JXReservationCard({
  reservation,
  hideDate = false,
  hideTime = false,
  hideState = false,
}: JXReservationCardProps) {
  const { startTime, endTime, bandName, date } = reservation;
  const { color, label } =
    RESERVATION_STATE[
      hideState ? "over" : getReservationState(startTime, endTime)
    ];

  return (
    <JXCardContainer color={color}>
      <JXTitleLabel>{bandName}</JXTitleLabel>
      <View className="container-h" style={{ alignItems: "center" }}>
        {!hideState && <JXChip color={color}>{label}</JXChip>}
        <View
          className="container-h grow"
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
          }}
        >
          {!hideDate && (
            <Text style={{ fontSize: 13 }}>{`${getMDWfromDate(date)}`}</Text>
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

export default JXReservationCard;
