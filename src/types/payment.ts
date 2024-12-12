export enum METODE {
  CASH = "CASH",
  QRIS = "QRIS",
  TRANSFER = "TRANSFER",
}

export interface PaymentDto {
  bookingId: string;
  harga: number;
  metode: METODE;
}
