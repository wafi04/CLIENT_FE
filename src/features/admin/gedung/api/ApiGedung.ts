import { BE_URL } from "@/constant";
import { API_RESPONSE } from "@/types/auth";
import { GedungDataWithImages, GedungForm } from "@/types/gedung";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateGedung() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["gedung"],
    mutationFn: async (data: GedungForm) => {
      const req = await fetch(`${BE_URL}/gedung`, {
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
      queryClient.cancelQueries({ queryKey: "gedung" }),
        toast.error(error.message || "Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "gedung" }),
        toast.success("Create Gedung Succes");
    },
  });
}
export function GetAllGedung() {
  return useQuery({
    queryKey: ["gedung"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/gedung`, {
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
export function getAllGedungWithImages() {
  return useQuery({
    queryKey: ["gedung", "images"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/gedung/image`, {
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

export function getAllGedungWithImagesById(id: string) {
  return useQuery({
    queryKey: ["gedung", "images"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/gedung/gedungs/${id}`, {
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

export function useUpdateGedung(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["gedung"],
    mutationFn: async (data: GedungForm) => {
      console.log(data);
      const req = await fetch(`${BE_URL}/gedung/${id}`, {
        body: JSON.stringify({
          ...data,
          harga: data.harga.toString(),
          kapasitas: data.kapasitas.toString(),
        }),
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return req.json();
    },
    onMutate: async (updatedGedung) => {
      await queryClient.cancelQueries({ queryKey: ["gedung"] });

      const previousProducts = queryClient.getQueryData(["gedung"]);

      queryClient.setQueryData(["gedung"], (oldData: any) => {
        if (Array.isArray(oldData?.data)) {
          return {
            ...oldData,
            data: oldData.data.map((gedung: GedungForm) =>
              gedung.id === id ? { ...gedung, ...updatedGedung } : gedung
            ),
          };
        }
        return oldData;
      });

      queryClient.setQueryData(["gedung", id], (oldData: any) => ({
        ...oldData,
        ...updatedGedung,
      }));

      return { previousProducts };
    },
    onError: (error: Error, context: any) => {
      toast.error(error.message);
      queryClient.setQueryData(["product"], context?.previousProducts);
    },
    onSuccess: (serverResponse) => {
      toast.success("Update Gedung Succes");
      queryClient.setQueryData(["gedung"], (oldData: any) => {
        if (Array.isArray(oldData?.data)) {
          return {
            ...oldData,
            data: oldData.data.map((product: GedungForm) =>
              product.id === id ? serverResponse : product
            ),
          };
        }
        return oldData;
      });

      queryClient.invalidateQueries({
        queryKey: ["gedung"],
        exact: false,
        refetchType: "active",
      });
    },
  });
}

export function useDeleteGedung(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["gedung"],
    mutationFn: async () => {
      const req = await fetch(`${BE_URL}/gedung/${id}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      return req.json();
    },
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: "gedung" }),
        toast.error(error.message || "Internal Server Error");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["gedung"] });

      const previousProducts = queryClient.getQueryData(["gedung"]);

      queryClient.setQueryData(["gedung"], (oldData: any) => {
        if (Array.isArray(oldData?.data)) {
          return {
            ...oldData,
            data: oldData.data.filter(
              (product: GedungForm) => product.id !== id
            ),
          };
        }
        return oldData;
      });

      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gedung"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Delete Gedung Succes");
    },
  });
}

export interface AvailableGedungParams {
  alamat?: string;
  date?: string | Date;
  range?: number;
}

export interface AvailableGedungResponse {
  availableGedung: GedungDataWithImages[];
  searchParams: {
    inputDate: string;
    startDate: string;
    endDate: string;
    alamat: string;
    daysRange: number;
  };
}

export function GetAvailableGedung({
  alamat,
  date,
  range = 1,
}: AvailableGedungParams = {}) {
  // Generate a dynamic query key that includes all parameters
  const queryKey = [
    "gedung",
    "available",
    alamat || "all",
    date ? date.toString() : "today",
    range,
  ];

  return useQuery<API_RESPONSE<AvailableGedungResponse>, Error>({
    queryKey,
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      // Add parameters to URL
      if (alamat) {
        queryParams.append("alamat", decodeURIComponent(alamat));
      }

      if (date) {
        // Ensure date is converted to ISO string if it's a Date object
        const formattedDate =
          date instanceof Date ? date.toISOString().split("T")[0] : date;
        queryParams.append("date", formattedDate);
      }

      console.log(date);

      // Add range parameter
      queryParams.append("range", range.toString());

      const url = `${BE_URL}/gedung/available?${queryParams.toString()}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        return response.json();
      } catch (error) {
        console.error("Failed to fetch available gedung:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Retry once on failure
  });
}
