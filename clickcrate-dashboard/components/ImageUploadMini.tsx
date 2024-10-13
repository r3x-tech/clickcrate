import React, { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";

interface ImageUploadProps {
  onImageChange: (image: string, file: File | null) => void;
  initialImage?: string;
  imageType?: string;
  identifier: string;
}

export const ImageUploadMini: React.FC<ImageUploadProps> = ({
  onImageChange,
  initialImage,
  imageType = "",
  identifier,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (initialImage) {
      setImageUrl(initialImage);
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageChange(objectUrl, file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (isValidImageUrl(url)) {
      setPreviewUrl(url);
      onImageChange(url, null);
    } else {
      setPreviewUrl("");
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setPreviewUrl("");
    onImageChange("", null);
  };

  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
  };

  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength / 2 - 3);
    const end = url.substring(url.length - maxLength / 2 + 3);
    return `${start}...${end}`;
  };

  return (
    <div className="flex items-center space-x-4 flex-1 h-full">
      <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs border-[1px] border-white rounded-xl">
            NO IMAGE
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-xs text-white font-bold mb-2">
          {imageType && `${imageType.toUpperCase()} `}IMAGE (.svg, .png only)
        </p>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500 truncate max-w-[200px]">
            {imageFile
              ? imageFile.name
              : truncateUrl(imageUrl, 30) || "No file selected"}
          </p>
          {(imageFile || imageUrl) && (
            <button
              onClick={handleClearImage}
              className="text-red-500 hover:text-red-700"
              aria-label="Clear image"
            >
              <IconTrash size={20} />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center justify-between mt-4">
          <div className="flex flex-1 items-center justify-start w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id={`imageUpload-${identifier}`} // Use the identifier here
            />
            <label
              htmlFor={`imageUpload-${identifier}`} // And here
              className="btn btn-xs lg:btn-sm btn-outline w-full py-3"
            >
              Upload Image
            </label>
          </div>
          <p className="flex-none text-sm my-2">OR</p>
          <div className="flex flex-1 items-center w-full justify-end">
            <input
              type="url"
              placeholder="Enter Image URL"
              value={imageUrl}
              onChange={handleUrlChange}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
