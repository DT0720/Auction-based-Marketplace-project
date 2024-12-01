import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";

// Memoized ImageHolder Component
const ImageHolder = React.memo(({ image, handleImageUpdate }: { image: File | null; handleImageUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const imageUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  
    return (
      <div className="flex justify-center relative">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Avatar className="h-24 w-24">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt="User Avatar" />
            ) : (
              <AvatarImage src={ImageStorageService.productPlaceholderImage} alt="User Avatar" />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
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

  ImageHolder.displayName = "ImageHolder";

// Exporting the memoized component
export default ImageHolder;
