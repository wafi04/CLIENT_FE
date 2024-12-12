import { GetAllGedung } from "../api/ApiGedung";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, BadgeCheck, Users, Info, Loader2, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import ButtonOtherGedung from "./ButtonOtherGedung";
import { GedungData } from "@/types/gedung";

export function AllGedung() {
  const { data, error, isLoading } = GetAllGedung();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading data
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((gedung: GedungData) => (
          <Card key={gedung.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="relative">
              <div className="flex w-full">
                <div className="space-y-1 mt-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="size-10" />
                    {gedung.name}
                  </CardTitle>
                </div>
                <Badge
                  variant={
                    gedung.ketersediaan === "Tersedia" ? "default" : "secondary"
                  }
                  className="flex items-center gap-1  absolute  top-2 right-2">
                  <BadgeCheck className="h-3 w-3" />
                  {gedung.ketersediaan}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex items-center gap-2 border-t pt-3">
                <Pin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{gedung.alamat}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Kapasitas: <strong>{gedung.kapasitas} orang</strong>
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  {gedung.deskripsi}
                </p>
              </div>

              <div className="pt-4 border-t flex justify-between items-center  ">
                <div className="text-lg font-bold text-primary flex items-center space-x-2">
                  <p>{formatCurrency(gedung.harga)}</p>
                  <p className="text-xs text-muted-foreground"> /per hari</p>
                </div>
                <ButtonOtherGedung
                  id={gedung.id}
                  initialData={{
                    id: gedung.id,
                    alamat: gedung.alamat,
                    deskripsi: gedung.deskripsi,
                    harga: parseFloat(gedung.harga),
                    kapasitas: gedung.kapasitas,
                    ketersediaan: gedung.ketersediaan,
                    name: gedung.name,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default AllGedung;
