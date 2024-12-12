import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { METODE, PaymentDto } from "@/types/payment";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePayment } from "../../payment/api/PaymentApi";
import { QRCodeCanvas } from "qrcode.react";
import { useCheckPaymentStatus } from "../api/ApiBooking";

export function DialogPayment({
  bookingId,
  totalPrice,
}: {
  bookingId: string;
  totalPrice: number;
}) {
  const [metode, setMetode] = useState<METODE>(METODE.CASH);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const { mutate } = useCreatePayment();
  console.log("booingid", bookingId);
  const { data: bookingByStatus, refetch } = useCheckPaymentStatus(bookingId);
  console.log(bookingByStatus);
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (metode === METODE.QRIS && paymentStatus === "pending") {
      intervalId = setInterval(() => {
        refetch();

        // Jika status sudah terbayar, lakukan mutate
        if (bookingByStatus?.status === "PENDING") {
          const paymentDetails: PaymentDto = {
            bookingId,
            harga: totalPrice,
            metode: METODE.QRIS,
          };

          try {
            mutate(paymentDetails);
            setPaymentStatus("success");
            clearInterval(intervalId);
          } catch (error) {
            console.error("Payment submission failed:", error);
            setPaymentStatus("failed");
            clearInterval(intervalId);
          }
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [metode, paymentStatus, bookingByStatus, bookingId, totalPrice]);

  const handlePaymentSubmit = () => {
    setIsSubmitting(true);
    const paymentDetails: PaymentDto = {
      bookingId,
      harga: totalPrice,
      metode,
    };

    try {
      mutate(paymentDetails);
      setPaymentStatus("success");
    } catch (error) {
      console.error("Payment submission failed:", error);
      setPaymentStatus("failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateQRISPayload = () => {
    return JSON.stringify({
      bookingId,
      amount: totalPrice,
      paymentMethod: METODE.QRIS,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Proceed to Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Select payment method and confirm your transaction
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4  sm:max-h-[60vh] overflow-auto">
          <label className="block text-sm font-medium">Payment Method</label>
          <Select
            value={metode}
            onValueChange={(value) => setMetode(value as METODE)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(METODE).map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm">
          <strong>Total Amount:</strong>{" "}
          {totalPrice.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </div>

        {metode === METODE.QRIS && (
          <div className="flex flex-col items-center mt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Scan QR Code to Complete Payment
            </p>
            <QRCodeCanvas
              value={generateQRISPayload()}
              size={256}
              level="H"
              includeMargin={true}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Please scan with your mobile banking or e-wallet app
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="submit"
            onClick={handlePaymentSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
