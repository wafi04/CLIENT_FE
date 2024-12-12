import { GedungForm } from "@/types/gedung";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateGedung, useUpdateGedung } from "../api/ApiGedung";

export function FormGedung({
  initialData,
  id,
}: {
  initialData?: GedungForm;
  id?: string;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<GedungForm>({
    defaultValues: {
      alamat: initialData?.alamat || "",
      deskripsi: initialData?.deskripsi || "",
      harga: initialData?.harga || 0,
      kapasitas: initialData?.kapasitas || 0,
      ketersediaan: initialData?.ketersediaan || "",
      name: initialData?.name || "",
    },
  });
  const create = useCreateGedung();
  const update = useUpdateGedung(id as string);

  const onSubmit = (data: GedungForm) => {
    if (initialData) {
      update.mutate({
        ...data,
        id,
      });
    } else {
      create.mutate(data);
    }
    reset();
  };

  return (
    <Card className="w-full max-w-2xl max-h-[60vh]  overflow-y-auto mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Gedung</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Nama gedung wajib diisi",
              })}
              placeholder="Masukkan nama gedung"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              {...register("alamat", {
                required: "Alamat wajib diisi",
              })}
              placeholder="Masukkan alamat gedung"
            />
            {errors.alamat && (
              <p className="text-sm text-red-500">{errors.alamat.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              {...register("deskripsi", {
                required: "Deskripsi wajib diisi",
              })}
              placeholder="Masukkan deskripsi gedung"
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500">{errors.deskripsi.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harga">Harga</Label>
              <Input
                id="harga"
                type="number"
                {...register("harga", {
                  required: "Harga wajib diisi",
                  min: { value: 0, message: "Harga tidak boleh negatif" },
                })}
                placeholder="Masukkan harga sewa"
              />
              {errors.harga && (
                <p className="text-sm text-red-500">{errors.harga.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kapasitas">Kapasitas</Label>
              <Input
                id="kapasitas"
                type="number"
                {...register("kapasitas", {
                  required: "Kapasitas wajib diisi",
                  min: { value: 1, message: "Kapasitas minimal 1 orang" },
                })}
                placeholder="Masukkan kapasitas"
              />
              {errors.kapasitas && (
                <p className="text-sm text-red-500">
                  {errors.kapasitas.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ketersediaan">Ketersediaan</Label>
            <Input
              id="ketersediaan"
              {...register("ketersediaan", {
                required: "Status ketersediaan wajib diisi",
              })}
              placeholder="Status ketersediaan gedung"
            />
            {errors.ketersediaan && (
              <p className="text-sm text-red-500">
                {errors.ketersediaan.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default FormGedung;
