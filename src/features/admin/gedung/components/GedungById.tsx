import { useState } from "react";
import { ProtectedLayout } from "@/components/layouts/AuthLayout";
import { useParams } from "react-router-dom";
import { getAllGedungWithImagesById } from "../api/ApiGedung";
import { MapPin, Users, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DialogBooking } from "@/features/user/booking/components/DialogBooking";

export function GedungByIdPage() {
  const { id } = useParams();
  const { data } = getAllGedungWithImagesById(id as string);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  if (!data) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin text-blue-500 size-20" />
        </div>
      </ProtectedLayout>
    );
  }

  const handleBookNow = () => {
    setIsBookingDialogOpen(true);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="relative pt-[56.25%]">
                {" "}
                {/* 16:9 Aspect Ratio */}
                <img
                  src={data.images[0]?.url || "/placeholder.jpg"}
                  alt={data.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {data.name}
                    </h1>
                    <div className="flex items-center text-white/80">
                      <MapPin className="mr-2 w-5 h-5" />
                      <span>{data.alamat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details and Booking Section */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                  Detail Gedung
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Informasi lengkap tentang {data.name}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <Users className="mx-auto w-8 h-8 text-blue-600 mb-2" />
                  <span className="block text-sm text-gray-600">Kapasitas</span>
                  <span className="text-xl font-bold text-blue-800">
                    {data.kapasitas} Orang
                  </span>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <DollarSign className="mx-auto w-8 h-8 text-green-600 mb-2" />
                  <span className="block text-sm text-gray-600">Harga</span>
                  <span className="text-xl font-bold text-green-800">
                    {formatCurrency(data.harga)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Deskripsi
                </h3>
                <p className="text-gray-600">{data.deskripsi}</p>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={data.ketersediaan !== "Tersedia"}>
                {data.ketersediaan === "Tersedia"
                  ? "Booking Sekarang"
                  : "Tidak Tersedia"}
              </Button>
            </div>
          </div>
        </div>
        <DialogBooking
          data={data}
          open={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
        />
      </div>
    </ProtectedLayout>
  );
}

export default GedungByIdPage;
