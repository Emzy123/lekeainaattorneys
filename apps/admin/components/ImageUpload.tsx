"use client";

import React, { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-slate-200">
          <Image
            src={value}
            alt="Upload preview"
            fill
            style={{ objectFit: "cover" }}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
              ) : (
                <UploadCloud className="w-8 h-8 mb-3" />
              )}
              <p className="mb-2 text-sm font-semibold">
                {isUploading ? "Uploading..." : `Click to ${label.toLowerCase()}`}
              </p>
              <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
