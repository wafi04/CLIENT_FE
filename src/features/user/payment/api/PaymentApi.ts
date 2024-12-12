import { BE_URL } from "@/constant";
import { PaymentDto } from "@/types/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["payment"],
    mutationFn: async (data: PaymentDto) => {
      const req = await fetch(`${BE_URL}/payment`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "payment" });
      toast.success("payment success");
    },
    onError: (erorr: Error) => {
      queryClient.cancelQueries({ queryKey: "payment" });
      toast.error(erorr.message || "internal server error");
    },
  });
}
