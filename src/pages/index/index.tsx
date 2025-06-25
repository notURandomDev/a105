import { View } from "@tarojs/components";
import { useDidShow, useLoad } from "@tarojs/taro";
import "./index.scss";
import { useUserStore } from "@/stores/userStore";
import { getReservationsByBandIDs } from "@/services/reservationsService";
import { useState } from "react";
import { Reservation } from "@/models/reservation";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { sortReservationsOnState } from "@/utils/reservation";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";

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
      <JXAvatar size="xl" shape="rounded">
        {userInfo?.nickName ? userInfo?.nickName[0].toUpperCase() : "?"}
      </JXAvatar>

      <JXHugeLabel>
        {reservations.length
          ? `本周 ${reservations.length} 次排练`
          : "本周暂无排练"}
      </JXHugeLabel>

      <View className="grow container-v list-gap">
        {reservations.map((reservation) => (
          <JXReservationCard reservation={reservation} />
        ))}
      </View>
    </View>
  );
}
