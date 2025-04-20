import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface ImageUploadProps {
  initialImageUrl?: string;
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
  className?: string;
  variant?: "square" | "circle";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
}

export function ImageUpload({
  initialImageUrl,
  onImageUpload,
  onImageRemove,
  className = "",
  variant = "square",
  size = "md",
  disabled = false,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass the file to parent component
    onImageUpload(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const containerClasses = `
    ${sizes[size]} 
    ${className} 
    border-2 
    ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
    ${variant === 'circle' ? 'rounded-full' : 'rounded-lg'}
    relative 
    flex 
    flex-col 
    items-center 
    justify-center 
    transition-colors
    overflow-hidden
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
  `;

  return (
    <div
      className={containerClasses}
      onDragEnter={!disabled ? handleDragEnter : undefined}
      onDragLeave={!disabled ? handleDragLeave : undefined}
      onDragOver={!disabled ? handleDragOver : undefined}
      onDrop={!disabled ? handleDrop : undefined}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />

      {previewUrl ? (
        <>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className={`w-full h-full object-cover ${variant === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
          />
          {!disabled && onImageRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-xs text-center font-medium">
              {isDragging ? "Drop image here" : "Click or drag to upload"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}