import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { Band } from "@/models/band";
import { Musician } from "@/models/musician";
import { Reservation } from "@/models/reservation";
import { getMusicianBaseBands, mapBandsIntoIds } from "@/utils/band";
import { sortReservationsOnState } from "@/utils/reservation";
import { getReservationsByOptions } from "@/services/reservationsService";
import { useDidShow } from "@tarojs/taro";
import { getWeekRange } from "@/utils/DatetimeHelper";
import { useUserMusicians } from "@/hooks/user/useUserMusicians";

export default function Index() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // 获取数据逻辑：
  // 用户 -> 乐手 -> 乐队 -> 预约记录

  // 1. 获取当前登录用户的所有乐手身份
  const { userInfo, userMusicians } = useUserMusicians();

  // 2. 获取当前登录用户所在的乐队
  const fetchBands = (musicians: Musician[]) => {
    return getMusicianBaseBands(musicians);
  };

  // 3. 获取用户所在乐队预约的排练（本周）
  const fetchReservations = async (bands: Band[]) => {
    const { monday, sunday } = getWeekRange();
    return getReservationsByOptions({
      bandIDs: mapBandsIntoIds(bands),
      timeRange: { startTime: monday, endTime: sunday },
    });
  };

  // 4. wrapper函数
  // TODO：这个函数本质上是聚合查询，应该放在后端执行
  const fetchData = async () => {
    // 如果用户没有 musician 身份，那么就没有加入乐队；没有加入乐队不能进行预约
    if (!userMusicians) return;

    // 如果用户没有加入乐队，那么不能进行预约
    const bands = await fetchBands(userMusicians);
    if (!bands) return;

    const reservations = (await fetchReservations(bands)) || [];
    setReservations(reservations);
  };

  // 页面出现时，重新获取预约数据
  useDidShow(() => {
    fetchData();
  });

  // 监听：用户乐手身份数据发生改变时，重新获取预约数据
  useEffect(() => {
    fetchData();
  }, [userMusicians]);

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
