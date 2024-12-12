import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Register } from "@/types/auth";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UseRegister } from "../api/UseAuth";

export function RegisterPage() {
  const { register, reset, handleSubmit, control } = useForm<Register>({
    defaultValues: {
      Nik: "",
      alamat: "",
      email: "",
      jenisKelamin: "",
      name: "",
      password: "",
      noTelp: "",
      tanggalLahir: "",
      tempatLahir: "",
    },
  });
  const create = UseRegister();

  const onSubmit = (data: Register) => {
    create.mutate(data);
    reset();
  };
  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NIK */}
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  {...register("Nik")}
                  id="nik"
                  placeholder="Masukkan NIK"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  placeholder="Masukkan Password"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  {...register("noTelp")}
                  id="phone"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Controller
                  name="jenisKelamin"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir</Label>
                <Input
                  {...register("tanggalLahir")}
                  id="birthDate"
                  type="date"
                />
              </div>

              {/* Birth Place */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Tempat Lahir</Label>
                <Input
                  {...register("tanggalLahir")}
                  id="birthPlace"
                  placeholder="Masukkan tempat lahir"
                />
              </div>

              {/* Address - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  {...register("alamat")}
                  id="address"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit">Register</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
