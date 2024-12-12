import { BE_URL } from "@/constant";
import { useAuth } from "@/lib/AuthProvider";
import { CreateBookingType } from "@/types/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["booking"],
    mutationFn: async (data: CreateBookingType) => {
      const req = await fetch(`${BE_URL}/Booking`, {
        body: JSON.stringify(data),
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return req.json();
    },
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: "booking" }),
        toast.error(error.message || "Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "booking" }),
        toast.success("Create Booking Succes");
    },
  });
}

export const useCheckPaymentStatus = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const response = await fetch(`${BE_URL}/Booking/booking/${bookingId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return response.json();
    },
    select: (booking) => booking.data,
  });
};

export const useGetBookedtime = (gedungId: string) => {
  return useQuery({
    queryKey: ["booked", gedungId],
    queryFn: async () => {
      const response = await fetch(`${BE_URL}/gedung/booked/${gedungId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return response.json();
    },
    select: (booked) => booked.data,
  });
};

export function GetAllBookingByUser() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["booking", user?.id],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/Booking/user/${user?.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    select: (booking) => booking.data,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 100,
    refetchIntervalInBackground: true,
  });
}

export function updateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["booking", "confirmed"],
    mutationFn: async (id: string) => {
      const req = await fetch(`${BE_URL}/Booking/status/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: ["booking", "confirmed"] }),
        toast.error(error.message || "Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", "confirmed"] }),
        toast.success("Update Booking Succes");
    },
  });
}
export function DeleteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["booking", "confirmed"],
    mutationFn: async (id: string) => {
      const req = await fetch(`${BE_URL}/Booking/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: ["booking", "confirmed"] }),
        toast.error(error.message || "Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", "confirmed"] }),
        toast.success("Delete Booking Succes");
    },
  });
}

export function GetAllBooking() {
  return useQuery({
    queryKey: ["booking"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/Booking`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },

    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function GetAllBookingConfirmed() {
  return useQuery({
    queryKey: ["booking", "confirmed"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/Booking/confirmed`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },

    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
