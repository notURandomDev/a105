import { db, _ } from "@/cloud/cloudClient";
import { MOCK_RESERVATIONS } from "@/constants/database/reservation";
import { Reservation } from "@/models/reservation";
import { handleDBResult } from "@/utils/database";
import { JxDbCollection, sendJxRequest } from "./shared";
import { TcbService, JxReqParamsBase } from "@/types/service/shared";

const collection: JxDbCollection = "reservation";
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

type GetReservationsByDate = TcbService<
  JxReqParamsBase & { date: Date },
  Reservation
>;

export const getReservationsByDate: GetReservationsByDate = async (params) => {
  const { date, production = true } = params;

  const res = await sendJxRequest<Reservation>({
    collection,
    conditions: [{ name: "排练日期", field: "date", cmd: _.eq(date) }],
    production,
  });

  return res;
};

type GetReservationsByDateRange = TcbService<
  JxReqParamsBase & { startDate: Date; endDate: Date },
  Reservation
>;

export const getReservationsByDateRange: GetReservationsByDateRange = async (
  params
) => {
  const { startDate, endDate, production = true } = params;

  const res = await sendJxRequest<Reservation>({
    collection,
    conditions: [
      {
        name: "排练日期",
        field: "date",
        cmd: _.gte(startDate).and(_.lte(endDate)),
      },
    ],
    production,
    mockData: MOCK_RESERVATIONS.DEFAULT,
  });

  return res;
};

// 聚合查询（时间筛选 + 乐队ID筛选）
// TODO：refactor到后端

interface GetReservationsByOptionsParams {
  timeRange?: { startTime: Date; endTime: Date };
  bandIDs?: (string | number)[];
}

export const getReservationsByOptions = async (
  params: GetReservationsByOptionsParams
) => {
  // 查询参数
  const query: Record<string, any> = {};

  // 筛选条件：日期时间段
  if (params.timeRange) {
    const { startTime, endTime } = params.timeRange;
    query.date = _.gte(startTime).and(_.lte(endTime));
  }

  // 筛选条件：数组中包含的乐队
  if (params.bandIDs) {
    query.bandID = _.in(params.bandIDs);
  }

  try {
    const res = await reservationsCollection.where(query).get();
    handleDBResult(
      res,
      "get",
      `根据查询参数（${
        params.timeRange &&
        "时间：" + params.timeRange.startTime + " - " + params.timeRange.endTime
      }${
        params.bandIDs && "，乐队ID：" + params.bandIDs.join(", ")
      }）获取预约数据`
    );
    return res.data as Reservation[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* UPDATE */
/* DELETE */
