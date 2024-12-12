import { GedungDataWithImages } from "./gedung";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface CreateBookingType {
  userId: number;
  gedungId: string;
  startDate: string;
  endDate: string;
  totalHarga: number;
  status: BookingStatus;
}

export interface BookingData extends CreateBookingType {
  id: string;
  gedung: GedungDataWithImages;
}
