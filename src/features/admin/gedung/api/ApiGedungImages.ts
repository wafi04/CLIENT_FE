import { BE_URL } from "@/constant";
import { storage } from "@/lib/firebaseAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";

export interface GedungImagesForm {
  gedungId: string;
  url: string | File | null;
  id?: string;
}
export class GedungImages {
  constructor() {}

  private async uploadImage(file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw error; // Rethrow error for further handling
    }
  }
  private async getImageUrl(
    image: string | File | null
  ): Promise<string | null> {
    if (image instanceof File) {
      return this.uploadImage(image);
    } else if (typeof image === "string") {
      return image;
    }
    return null;
  }

  async create(data: GedungImagesForm) {
    const processedData = { ...data };

    // Process image upload first
    let imageUrl: string | null = null;
    if (processedData.url) {
      imageUrl = await this.getImageUrl(processedData.url);
    }

    const req = await fetch(`${BE_URL}/gedung/image`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        gedungId: data.gedungId,
        url: imageUrl,
      }),
    });

    return req.json();
  }
}

const gedungImage = new GedungImages();

export function useCreateGedungImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["gedung", "images"],
    mutationFn: (data: GedungImagesForm) => gedungImage.create(data),
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: ["gedung", "images"] }),
        toast.error(error.message || "Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gedung", "images"] }),
        toast.success("Create Gedung image  Succes");
    },
  });
}

export function GetAllGedungImage(id: string) {
  return useQuery({
    queryKey: ["gedung", "images"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/gedung/images/${id}`, {
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
    enabled: !!id,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Add a new mutation for deleting images
export function useDeleteGedungImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`${BE_URL}/gedung/image/${imageId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["gedung", "images"] });

      const previousProducts = queryClient.getQueryData(["gedung", "images"]);

      queryClient.setQueryData(["gedung", "images"], (oldData: any) => {
        if (Array.isArray(oldData?.data)) {
          return {
            ...oldData,
            data: oldData.data.filter(
              (product: GedungImagesForm) => product.id !== oldData.id
            ),
          };
        }
        return oldData;
      });

      return { previousProducts };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["gedung", "images"] });
    },
  });
}
