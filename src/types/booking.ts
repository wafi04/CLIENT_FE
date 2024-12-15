import { GedungDataWithImages } from "./gedung";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}
type BookingStatuss = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export interface CreateBookingType {
  userId: number;
  gedungId: string;
  startDate: string;
  endDate: string;
  totalHarga: number;
  status: BookingStatuss;
}

export interface BookingData extends CreateBookingType {
  id: string;
  gedung: GedungDataWithImages;
}
