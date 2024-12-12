import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Trash, Plus, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GedungImagesForm,
  GetAllGedungImage,
  useCreateGedungImages,
  useDeleteGedungImage,
} from "../api/ApiGedungImages";

type ImageUploadStep = {
  id: number;
  imageFile?: File | null;
  uploadedImage?: GedungImagesForm;
};

export function FormGedungImage({ gedungId }: { gedungId: string }) {
  const [uploadSteps, setUploadSteps] = useState<ImageUploadStep[]>([]);

  const {
    data: images,
    isLoading: isImagesLoading,
    error: imagesError,
  } = GetAllGedungImage(gedungId);

  const createGedungImageMutation = useCreateGedungImages();
  const deleteGedungImageMutation = useDeleteGedungImage();

  // Initialize with existing images
  useEffect(() => {
    if (images && images.length > 0) {
      const initialImages = images.map((image: GedungImagesForm) => ({
        id: Math.random(),
        uploadedImage: image,
      }));
      setUploadSteps(initialImages);
    }
  }, [images]);

  const handleFileChange = (stepId: number, file: File | null) => {
    setUploadSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === stepId ? { ...step, imageFile: file } : step
      )
    );
  };

  const handleUpload = async (stepId: number) => {
    const step = uploadSteps.find((s) => s.id === stepId);
    if (!step?.imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      createGedungImageMutation.mutate(
        {
          gedungId,
          url: step.imageFile,
        },
        {
          onSuccess: (uploadedImage) => {
            setUploadSteps((currentSteps) =>
              currentSteps.map((s) =>
                s.id === stepId ? { ...s, uploadedImage, imageFile: null } : s
              )
            );
            toast.success("Image uploaded successfully");
          },
          onError: (error) => {
            toast.error("Failed to upload image");
            console.error("Upload error:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    deleteGedungImageMutation.mutate(imageId, {
      onSuccess: () => {
        // Remove from uploadSteps or update
        setUploadSteps((currentSteps) =>
          currentSteps.filter((step) => step.uploadedImage?.id !== imageId)
        );
        toast.success("Image deleted successfully");
      },
      onError: (error) => {
        toast.error("Failed to delete image");
        console.error("Delete image error:", error);
      },
    });
  };

  const handleAddNewUploadStep = () => {
    setUploadSteps((current) => [...current, { id: Math.random() }]);
  };

  return (
    <div className="space-y-6 max-h-[60vh]  overflow-y-auto p-2">
      {/* Add Images Button */}
      <Button
        variant="outline"
        onClick={handleAddNewUploadStep}
        className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add New Image
      </Button>

      {/* Upload Steps */}
      {uploadSteps.map((step) => (
        <div key={step.id} className="border p-4 rounded-lg mb-4 relative">
          {step.uploadedImage ? (
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                <span>Image Uploaded</span>
              </div>
              <img
                src={step.uploadedImage.url as string}
                alt="Uploaded"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(step.id, e.target.files?.[0] || null)
                }
              />

              {step.imageFile && (
                <img
                  src={URL.createObjectURL(step.imageFile)}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              )}

              <Button
                onClick={() => handleUpload(step.id)}
                disabled={
                  !step.imageFile || createGedungImageMutation.isPending
                }
                className="w-full">
                {createGedungImageMutation.isPending
                  ? "Uploading..."
                  : "Upload"}
              </Button>
            </div>
          )}

          {step.uploadedImage && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() =>
                handleDeleteImage(step.uploadedImage?.id as string)
              }
              disabled={deleteGedungImageMutation.isPending}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default FormGedungImage;
