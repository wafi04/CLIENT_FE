import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { BookingStatus, CreateBookingType } from "@/types/booking";
import { GedungDataWithImages } from "@/types/gedung";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateBooking, useGetBookedtime } from "../api/ApiBooking";

export function DialogBooking({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: GedungDataWithImages;
}) {
  const { user } = useAuth();
  const { data: bookingTimes } = useGetBookedtime(data.id);
  const isDateBooked = (checkDate: Date) => {
    if (!bookingTimes) return false;

    return bookingTimes.some((booking: any) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };
  const validateDateRange = (formData: CreateBookingType) => {
    if (!formData.startDate || !formData.endDate) return false;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isDateBooked(d)) {
        return false;
      }
    }

    return true;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBookingType>({
    defaultValues: {
      endDate: "",
      gedungId: data.id,
      startDate: "",
      status: BookingStatus.PENDING,
      totalHarga: parseFloat(data.harga) || 0,
      userId: user?.id as number,
    },
    resolver: (values) => {
      const errors: Record<string, { type: string; message: string }> = {};

      if (values.startDate && values.endDate) {
        const start = new Date(values.startDate);
        const end = new Date(values.endDate);

        if (start > end) {
          errors.startDate = {
            type: "manual",
            message:
              "Tanggal mulai tidak boleh lebih besok dari tanggal selesai",
          };
          errors.endDate = {
            type: "manual",
            message:
              "Tanggal selesai tidak boleh lebih kemarin dari tanggal mulai",
          };
        }
      }

      if (!validateDateRange(values)) {
        errors.startDate = {
          type: "manual",
          message: "Tanggal ini sudah dibooking",
        };
        errors.endDate = {
          type: "manual",
          message: "Tanggal ini sudah dibooking",
        };
      }

      return {
        values,
        errors,
      };
    },
  });
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const { mutate } = useCreateBooking();

  const calculateTotalDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return daysDiff;
    }
    return 0;
  };

  useEffect(() => {
    const startDateInput = document.getElementById(
      "startDate"
    ) as HTMLInputElement;
    const endDateInput = document.getElementById("endDate") as HTMLInputElement;

    if (startDateInput && bookingTimes) {
      bookingTimes.forEach((booking: any) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const formattedDate = d.toISOString().split("T")[0];
          const disabledOption = document.createElement("option");
          disabledOption.value = formattedDate;
          startDateInput.appendChild(disabledOption);
          endDateInput.appendChild(disabledOption.cloneNode(true));
        }
      });
    }
  }, [bookingTimes]);

  const calculateTotalPrice = () => {
    const dailyRate = parseFloat(data.harga);
    const totalDays = calculateTotalDays();
    return dailyRate * totalDays;
  };

  const onSubmit = (formData: CreateBookingType) => {
    const totalPrice = calculateTotalPrice();
    const finalFormData = {
      ...formData,
      totalHarga: totalPrice,
    };
    mutate(finalFormData);

    console.log("Booking Data:", finalFormData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking {data.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="startDate">Tanggal Mulai</Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate", { required: true })}
              className="col-span-3"
            />
            {errors.startDate && (
              <p className="text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="endDate">Tanggal Selesai</Label>
            <Input
              id="endDate"
              type="date"
              {...register("endDate", { required: true })}
              className="col-span-3"
            />
          </div>

          <div>
            <Label>Total Harga</Label>
            <div>
              {startDate && endDate
                ? formatCurrency(calculateTotalPrice().toString())
                : formatCurrency(data.harga)}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Konfirmasi Booking
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
