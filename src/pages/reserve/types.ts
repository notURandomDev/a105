import { Band } from "@/models/band";

export enum FieldType {
  Start = "startTime",
  End = "endTime",
  Date = "date",
}

export type FormDataProps = {
  startTime: Date | null;
  endTime: Date | null;
  date: Date;
  band: Band | null;
};
