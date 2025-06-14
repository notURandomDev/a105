import { View, Text } from "@tarojs/components";
import { useDidShow, useLoad } from "@tarojs/taro";
import "./index.scss";
import { useUserStore } from "@/stores/userStore";
import { getReservationsByBandIDs } from "@/services/reservationsService";
import { useState } from "react";
import { Reservation } from "@/models/reservation";
import JXReservationCard from "@/components/JXReservationCard";
import { sortReservationsOnState } from "@/utils/reservation";

export default function Index() {
  useLoad(() => {
    console.log("Home Page loaded.");
  });

  useDidShow(() => {
    fetchReservations();
  });

  const { userInfo } = useUserStore();

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    if (!userInfo?.bandIDs) return;

    const res = await getReservationsByBandIDs({
      bandIDs: userInfo?.bandIDs,
      sortByDate: false,
    });
    if (res) {
      const sortedReservations = sortReservationsOnState(res);
      setReservations(sortedReservations);
    }
  };

  return (
    <View className="index page page-padding">
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
      <View className="grow container-v list-gap">
        {reservations.map((reservation) => (
          <JXReservationCard reservation={reservation} />
        ))}
      </View>
    </View>
  );
}
