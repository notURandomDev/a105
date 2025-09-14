import { db, _ } from "@/cloud/cloudClient";
import { MOCK_RESERVATIONS } from "@/constants/database/reservation";
import { Reservation } from "@/models/reservation";
import { handleDBResult } from "@/utils/database";
import { DB } from "@tarojs/taro";

const reservationsCollection = db.collection("reservation");

/* CREATE */

export const createReservation = async (data: Reservation) => {
  try {
    const res = await reservationsCollection.add({ data: { ...data } });
    handleDBResult(res, "add", "新建预约记录");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* READ */

export const getAllReservations = async (): Promise<
  Reservation[] | undefined
> => {
  try {
    const res = await reservationsCollection.get();
    handleDBResult(res, "get", "获取全部预约数据");
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
  }
};

export const getReservationByBandName = async (bandName: string) => {
  try {
    const res = await reservationsCollection
      .where({ bandName: _.eq(bandName) })
      .get();
    handleDBResult(res, "get", "根据排练乐队名获取预约数据");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getReservationsByDate = async (
  date: Date
): Promise<Reservation[] | null> => {
  try {
    const res = await reservationsCollection.where({ date: _.eq(date) }).get();
    handleDBResult(res, "get", "根据排练日期获取预约数据");
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getReservationsByDateRange = async (
  startDate: Date,
  endDate: Date,
  production: boolean = true
): Promise<Reservation[] | null> => {
  if (!production) return MOCK_RESERVATIONS.DEFAULT;

  try {
    const res = await reservationsCollection
      .where({ date: _.gte(startDate).and(_.lte(endDate)) })
      .get();
    handleDBResult(res, "get", "根据排练日期范围获取预约数据");
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 参数：可以传入单个乐队id，也可以是多个

interface GetReservationsByBandIDsOptions {
  bandIDs: (string | number)[];
  production?: boolean;
  sortByDate?: boolean;
}
export const getReservationsByBandIDs = async ({
  bandIDs,
  production = true,
  sortByDate = true,
}: GetReservationsByBandIDsOptions): Promise<Reservation[] | null> => {
  if (!production)
    return MOCK_RESERVATIONS.DEFAULT.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

  try {
    let res: DB.Query.IQueryResult;
    if (sortByDate) {
      res = await reservationsCollection
        .where({ bandID: _.in(bandIDs) })
        .orderBy("date", "desc")
        .get();
    } else {
      res = await reservationsCollection.where({ bandID: _.in(bandIDs) }).get();
    }
    handleDBResult(res, "get", "根据排练乐队ID获取预约数据");

    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* UPDATE */
/* DELETE */
