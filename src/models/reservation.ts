interface ReservationBase {
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

export interface ReservationConfigs {
  bandName?: string;
  date?: Date;
}
