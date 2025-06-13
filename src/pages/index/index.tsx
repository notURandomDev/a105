import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { useUserStore } from "@/stores/userStore";
import { getReservationsByBandIDs } from "@/services/reservationsService";
import { useEffect, useState } from "react";
import { Reservation } from "@/models/reservation";
import { getHMfromDate, getMDfromDate } from "@/utils/DatetimeHelper";
import JXRehearsalCard, {
  JXRehearsalState,
} from "@/components/JXRehearsalCard";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const { userInfo } = useUserStore();

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    if (!userInfo?.bandIDs) return;

    const res = await getReservationsByBandIDs({
      bandIDs: userInfo?.bandIDs,
    });
    if (res) setReservations(res);
  };

  const getRehearsalState = (
    startTime: Date,
    endTime: Date
  ): JXRehearsalState => {
    const now = new Date();
    let state: JXRehearsalState;
    if (now < startTime) {
      state = "pending";
    } else if (now >= startTime && now <= endTime) {
      state = "active";
    } else {
      state = "over";
    }

    return state;
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <View className="index page">
      <View
        className="container-v"
        style={{
          backgroundColor: "#000",
          width: 125,
          height: 125,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 56 }}>
          {userInfo?.nickName ? userInfo?.nickName[0].toUpperCase() : "?"}
        </Text>
      </View>

      <View style={{ padding: "16px 0" }}>
        <Text style={{ fontWeight: 600, fontSize: 40 }}>
          {reservations.length
            ? `本周 ${reservations.length} 次排练`
            : "本周暂无排练"}
        </Text>
      </View>
      <View className="grow container-v" style={{ gap: 16 }}>
        {reservations.map((reservation) => (
          <JXRehearsalCard reservation={reservation} />
        ))}
      </View>
    </View>
  );
}
