import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";

// Memoized CustomSquareImageHolder Component
const ImageHolderSquare = React.memo(({ image, handleImageUpdate }: { image: File | string | null; handleImageUpdate?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const imageUrl = useMemo(() => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return image;
    }
    return null;
  }, [image]);

  return (
    <div className="flex justify-center relative w-full md:w-2/5">
      <label htmlFor="image-upload" className={`cursor-pointer w-full ${handleImageUpdate ? "" : "pointer-events-none"}`}>
        <div className="w-full aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Product Image" className="object-cover h-full w-full" />
          ) : (
            <img src={ImageStorageService.productPlaceholderImage} alt="Product Image" className="object-cover h-full w-full" />
          )}
        </div>
        {handleImageUpdate && (
          <Input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpdate}
          />
        )}
      </label>
    </div>
  );
});

ImageHolderSquare.displayName = "ImageHolderSquare";

// Exporting the memoized component
export default ImageHolderSquare;
