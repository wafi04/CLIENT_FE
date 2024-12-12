import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Building2 } from "lucide-react";
import { GetAllBookingByUser } from "../api/ApiBooking";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { ProtectedLayout } from "@/components/layouts/AuthLayout";
import { BookingData } from "@/types/booking";
import { formatCurrency } from "@/lib/utils";
import { DialogPayment } from "./DialogPayment";

export function BookingUser() {
  const { data, isLoading } = GetAllBookingByUser();

  if (isLoading) {
    return <LoadingOverlay />;
  }
  console.log(data);

  return (
    <ProtectedLayout title="My Bookings">
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data &&
            data.map((booking: BookingData) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="space-y-3 p-4">
                  <CardTitle className="text-2xl font-semibold">
                    <h1>{booking.gedung.name}</h1>
                  </CardTitle>
                  <div className="max-h-[30vw]  w-full">
                    {booking.gedung && (
                      <img
                        src={
                          booking.gedung.images.length > 0
                            ? booking.gedung.images[0].url
                            : "https://images.unsplash.com/photo-1706264473113-3036fd904c35?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2VkdW5nfGVufDB8fDB8fHww"
                        }
                        className="rounded-2xl  object-center  max-h-[20vw] w-full"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>{booking.gedung.alamat}</span>
                    </div>
                    <div className="flex items-center text-xs space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>
                        {format(parseISO(booking.startDate), "PPP")} -
                        {format(parseISO(booking.endDate), "PPP")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <span>Capacity: {booking.gedung.kapasitas} people</span>
                    </div>
                    <div className="text-xl font-bold text-right text-primary">
                      {formatCurrency(booking.totalHarga)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <DialogPayment
                    bookingId={booking.id}
                    totalPrice={booking.totalHarga}
                  />
                </CardFooter>
              </Card>
            ))}
        </div>
        {data && data.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            You have no bookings yet.
          </div>
        )}
      </section>
    </ProtectedLayout>
  );
}

export default BookingUser;
