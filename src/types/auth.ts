export interface Register {
  name: string;
  email: string;
  Nik: string;
  alamat: string;
  password: string;
  tempatLahir: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noTelp: string;
}

export interface UserData extends Register {
  id: number;
  role: "admin" | "user";
}

export type API_RESPONSE<T> = {
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
};
