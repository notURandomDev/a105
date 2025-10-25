import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import JXAvatar from "@/components/JXAvatar";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXReservationCard from "@/components/Cards/JXReservationCard";
import { Band } from "@/models/band";
import { Reservation } from "@/models/reservation";
import { mapBandsIntoIds } from "@/utils/band";
import {
  getReservationState,
  sortReservationsOnState,
} from "@/utils/reservation";
import {
  deleteReservation,
  getReservationsByOptions,
} from "@/services/reservationsService";
import { useDidShow } from "@tarojs/taro";
import { getWeekRange } from "@/utils/DatetimeHelper";
import { useUserBands } from "@/hooks/user/useUserBands";
import { SwipeCell } from "@taroify/core";
import { Pencil, Trash2 } from "lucide";
import JXActionButton from "@/components/JXActionButton";
import Taro from "@tarojs/taro";
import { useMutexLoad } from "@/hooks/util/useMutexLoad";

export default function Index() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const { mutexLoad } = useMutexLoad({ showLoading: true });

  // 获取数据逻辑：
  // 用户 -> 乐手 -> 乐队 -> 预约记录

  // 1. 获取当前登录用户的所有乐手身份 + 所有所在的乐队
  const { userInfo, userBands } = useUserBands();

  // 2. 获取用户所在乐队预约的排练（本周）
  const fetchReservations = async (bands: Band[]) => {
    const { monday, sunday } = getWeekRange();
    return getReservationsByOptions({
      bandIDs: mapBandsIntoIds(bands),
      timeRange: { startTime: monday, endTime: sunday },
    });
  };

  // 1+2: wrapper函数
  // TODO：这个函数本质上是聚合查询，应该放在后端执行
  const fetchData = async () => {
    // 如果用户没有加入乐队，那么不能进行预约
    if (!userBands.length) return;
    const reservations = (await fetchReservations(userBands)) || [];
    setReservations(reservations);
  };

  const handleEditReservation = (reservation: Reservation) => {
    Taro.navigateTo({
      url: `/pages/reserve/index?reservation=${JSON.stringify(reservation)}`,
    });
  };

  const handleDeleteReservation = async (docId: string | number) => {
    const res = await Taro.showModal({
      title: "取消排练预约",
      content: "你确定要取消本次预约的排练?",
    });
    if (res.cancel) return;

    mutexLoad(async () => {
      await deleteReservation(docId); // 删除预约记录
      await fetchData(); // 更新预约数据
    });
  };

  // 页面出现时，重新获取预约数据
  useDidShow(() => {
    fetchData();
  });

  // 监听：用户乐手乐队数据发生改变时，重新获取预约数据
  useEffect(() => {
    fetchData();
  }, [userBands]);

  return (
    <View className="index page page-padding">
      <JXAvatar
        size="xl"
        shape="rounded"
        src={userInfo?.avatarUrl ?? undefined}
      />
      <JXHugeLabel>
        {reservations.length
          ? `本周 ${reservations.length} 次排练`
          : "本周暂无排练"}
      </JXHugeLabel>
      <View className="grow container-v list-gap">
        {sortReservationsOnState(reservations).map((reservation) => {
          const { startTime, endTime } = reservation;
          // 只能删除尚未开始的排练
          const disabled =
            getReservationState(startTime, endTime) !== "pending";
          return (
            <SwipeCell
              beforeClose={(position) => {
                return true;
              }}
              defaultOpen="right"
              open="right"
            >
              <JXReservationCard reservation={reservation} />
              <SwipeCell.Actions
                className="container-h"
                side="right"
                style={{
                  gap: 16,
                  paddingLeft: 16,
                  alignItems: "center",
                }}
              >
                <JXActionButton
                  disabled={disabled}
                  onClick={() => handleEditReservation(reservation)}
                  icon={Pencil}
                />
                <JXActionButton
                  disabled={disabled}
                  onClick={() => handleDeleteReservation(reservation._id)}
                  icon={Trash2}
                  color="red"
                />
              </SwipeCell.Actions>
            </SwipeCell>
          );
        })}
      </View>
    </View>
  );
}
