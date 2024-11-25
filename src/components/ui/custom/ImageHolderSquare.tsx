import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";

// Memoized CustomSquareImageHolder Component
const ImageHolderSquare = React.memo(({ image, handleImageUpdate }: { image: File | null; handleImageUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const imageUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

  return (
    <div className="flex justify-center relative w-full md:w-2/5">
      <label htmlFor="image-upload" className="cursor-pointer w-full">
        <div className="w-full aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Product Image" className="object-cover h-full w-full" />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>
        <Input
          id="image-upload"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpdate}
        />
      </label>
    </div>
  );
});

// Exporting the memoized component
export default ImageHolderSquare;
