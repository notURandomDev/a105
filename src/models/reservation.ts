export interface Reservation {
  bandName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
}

export interface ReservationConfigs {
  bandName?: string;
  date?: Date;
}
