import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  maxSize?: number; // in MB
  allowedFormats?: string[];
  aspectRatio?: number; // e.g., 1 for square, 16/9 for widescreen
}

export default function ImageUploader({
  onImageSelect,
  onClose,
  title = "Upload Image",
  description = "Select an image to upload",
  maxSize = 5,
  allowedFormats = ["image/jpeg", "image/png", "image/webp"],
  aspectRatio,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file format
    if (!allowedFormats.includes(file.type)) {
      setError(`File format not supported. Allowed: ${allowedFormats.join(", ")}`);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile || !preview) {
      setError("Please select an image");
      return;
    }
    onImageSelect(selectedFile, preview);
    toast.success("Image selected!");
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-6 w-full max-w-md">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-[#ff00cc] mb-2">{title}</h3>
          <p className="text-sm text-[#7a7f8e]">{description}</p>
        </div>

        {/* Preview */}
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-[#2a2f3e]"
            />
            <button
              onClick={() => {
                setPreview("");
                setSelectedFile(null);
                setError("");
              }}
              className="absolute top-2 right-2 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Drag & Drop Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[#ff00cc] bg-[#ff00cc]/10"
                : "border-[#2a2f3e] bg-[#0b0e14] hover:border-[#00eaff]"
            }`}
          >
            <Upload className="w-8 h-8 text-[#7a7f8e] mx-auto mb-3" />
            <p className="text-[#00eaff] font-bold mb-1">Drag and drop your image</p>
            <p className="text-sm text-[#7a7f8e]">or click to browse</p>
            <p className="text-xs text-[#7a7f8e] mt-2">
              Max size: {maxSize}MB • Formats: JPG, PNG, WebP
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Error Message */}
        {error && (
          <div className="flex gap-2 p-3 bg-[#ff00cc]/20 border border-[#ff00cc] rounded-lg">
            <AlertCircle className="w-5 h-5 text-[#ff00cc] flex-shrink-0" />
            <p className="text-sm text-[#ff00cc]">{error}</p>
          </div>
        )}

        {/* File Info */}
        {selectedFile && (
          <div className="bg-[#0b0e14] rounded-lg p-3 border border-[#2a2f3e]">
            <p className="text-sm text-[#7a7f8e] mb-1">
              <span className="font-bold text-[#00eaff]">File:</span> {selectedFile.name}
            </p>
            <p className="text-sm text-[#7a7f8e]">
              <span className="font-bold text-[#00eaff]">Size:</span>{" "}
              {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[#7a7f8e] border-[#2a2f3e]"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!selectedFile}
            className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </div>
      </div>
    </Card>
  );
}
