import { db, _ } from "@/cloud/cloudClient";
import { DB_ERRMSG_OK } from "@/constants/database/config";
import { MOCK_RESERVATIONS } from "@/constants/database/reservation";
import { Reservation } from "@/models/reservation";

const reservationsCollection = db.collection("reservation");

/* CREATE */

export const createReservation = async (data: Reservation) => {
  try {
    const res = await reservationsCollection.add({ data: { ...data } });
    console.log("新建了预约记录", res);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/* READ */

export const getReservations = async () => {
  const QUERY_ALL = "获取全部预约数据";
  try {
    const res = await reservationsCollection.get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_ALL + `失败：${res.errMsg}`);
    }

    console.log(QUERY_ALL + "成功：", res);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getReservationByBandName = async (bandName: string) => {
  const QUERY_BY_BAND_NAME = "根据排练乐队名获取预约数据";
  try {
    const res = await reservationsCollection
      .where({ bandName: _.eq(bandName) })
      .get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_BY_BAND_NAME + `失败：${res.errMsg}`);
    }

    console.log(QUERY_BY_BAND_NAME + "成功：", res);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getReservationsByDate = async (
  date: Date
): Promise<Reservation[]> => {
  const QUERY_BY_DATE = "根据排练日期获取预约数据";
  try {
    console.log("查询的排练日期参数", date);
    const res = await reservationsCollection.where({ date: _.eq(date) }).get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_BY_DATE + `失败：${res.errMsg}`);
    }

    console.log(QUERY_BY_DATE + "成功：", res);
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getReservationsByDateRange = async (
  startDate: Date,
  endDate: Date,
  production: boolean = false
): Promise<Reservation[]> => {
  const QUERY_BY_DATE_RANGE = "根据排练日期范围获取预约数据";

  if (!production) return MOCK_RESERVATIONS.DEFAULT;

  try {
    const res = await reservationsCollection
      .where({ date: _.gte(startDate).and(_.lte(endDate)) })
      .get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_BY_DATE_RANGE + `失败：${res.errMsg}`);
    }

    console.log(QUERY_BY_DATE_RANGE + "成功：", res);
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 参数：可以传入单个乐队id，也可以是多个

interface GetReservationsByBandIDsOptions {
  bandIDs: string[];
  production?: boolean;
}
export const getReservationsByBandIDs = async ({
  bandIDs,
  production = false,
}: GetReservationsByBandIDsOptions): Promise<Reservation[] | null> => {
  const QUERY_BY_BAND_IDS = "根据排练乐队ID获取预约数据";

  if (!production)
    return MOCK_RESERVATIONS.DEFAULT.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

  try {
    const res = await reservationsCollection
      .where({ bandID: _.in(bandIDs) })
      .orderBy("date", "desc")
      .get();

    if (res.errMsg !== DB_ERRMSG_OK) {
      throw new Error(QUERY_BY_BAND_IDS + `失败：${res.errMsg}`);
    }

    console.log(QUERY_BY_BAND_IDS + "成功：", res);
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* UPDATE */
/* DELETE */
