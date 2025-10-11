export interface ReservationBase {
  bandName: string;
  bandID: string | number;
  date: Date;
  startTime: Date;
  endTime: Date;
}

// 与TCB上的数据模型一致
export interface Reservation extends ReservationBase {
  _id: string | number;
}

// 用于创建预约
export type CreateReservationRequest = ReservationBase;

// 用于更新预约，不能更新乐队信息
export interface UpdateReservationRequest {
  date?: Date;
  startTime?: Date;
  endTime?: Date;
}

export interface ReservationConfigs {
  bandName?: string;
  date?: Date;
}
