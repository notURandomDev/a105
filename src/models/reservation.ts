export interface Reservation {
  _id?: string | number;
  bandName: string;
  bandID: string | number;
  date: Date;
  startTime: Date;
  endTime: Date;
}

export interface ReservationConfigs {
  bandName?: string;
  date?: Date;
}
