export interface GedungForm {
  id?: string;
  name: string;
  deskripsi: string;
  harga: number;
  alamat: string;
  kapasitas: number;
  ketersediaan: string;
}

export interface GedungData {
  id: string;
  name: string;
  alamat: string;
  harga: string;
  deskripsi: string;
  kapasitas: number;
  ketersediaan: string;
  createdAt: string;
  updatedAt: string;
}

export interface GedungDataWithImages extends GedungData {
  images: GedungImage[];
}

export interface GedungImage {
  id: string;
  url: string;
  gedungId: string;
}
