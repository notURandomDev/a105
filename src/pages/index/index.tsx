import { View } from "@tarojs/components";
import "./index.scss";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { sortReservationsOnState } from "@/utils/reservation";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import { useReservationsWithBands } from "@/hooks/reservation/useReservationsWithBand";
import { useMusicianStore } from "@/stores/musicianStore";
import { selectMusiciansByUser } from "@/selectors/musicianSelectors";

export default function Index() {
  const [bandIDs, setBandIDs] = useState<(string | number)[]>([]);
  const { userInfo } = useUserStore();
  const reservations = useReservationsWithBands(bandIDs);
  const allMusicians = useMusicianStore((s) => s.musicians);

  useEffect(() => {
    if (!userInfo?._id || !allMusicians) return;

    const musicians = selectMusiciansByUser(allMusicians, userInfo._id);
    const uniqueBandIDs = [...new Set(musicians.flatMap((m) => m.bandIDs))];
    setBandIDs(uniqueBandIDs);
  }, [userInfo, allMusicians]);

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
        {sortReservationsOnState(reservations).map((reservation) => (
          <JXReservationCard reservation={reservation} />
        ))}
      </View>
    </View>
  );
}
