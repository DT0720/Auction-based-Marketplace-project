import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";

/**
 * ImageHolderSquare Component.
 * A memoized component that displays a square image with an optional file input for updating the image.
 *
 * @param {Object} props - The props for the ImageHolderSquare component.
 * @param {File | string | null} props.image - The current image to be displayed, which can be a file, a string (URL), or null if no image is selected.
 * @param {Function} [props.handleImageUpdate] - Optional function that handles the image update when a user selects a new image.
 *
 * @returns {JSX.Element} - The rendered ImageHolderSquare component, which displays the image or a placeholder if no image is provided.
 */

const ImageHolderSquare = React.memo(
    ({
        image,
        handleImageUpdate,
    }: {
        image: File | string | null;
        handleImageUpdate?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => {
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
                <label
                    htmlFor="image-upload"
                    className={`cursor-pointer w-full ${handleImageUpdate ? "" : "pointer-events-none"
                        }`}
                >
                    <div className="w-full aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Product Image"
                                className="object-cover h-full w-full"
                            />
                        ) : (
                            <img
                                src={ImageStorageService.productPlaceholderImage}
                                alt="Product Image"
                                className="object-cover h-full w-full"
                            />
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
    }
);

ImageHolderSquare.displayName = "ImageHolderSquare";

// Exporting the memoized component
export default ImageHolderSquare;
