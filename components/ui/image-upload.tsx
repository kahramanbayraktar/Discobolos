"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  hint?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "events",
  folder = "covers",
  hint = "Click to upload image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      /* 
      // Session check disabled (using permissive RLS for now)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("You must be logged in to upload images.");
      }
      */

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log("Uploading to:", bucket, filePath);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // If bucket doesn't exist, this might fail. In a real app we'd ensure bucket exists.
        console.error("Upload error details:", uploadError);
        throw new Error(uploadError.message);
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image. Please ensure the storage bucket exists.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary/10 group">
          <Image
            src={value}
            alt="Upload"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
            ) : (
              <Upload className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            )}
            <p className="mb-2 text-sm font-medium text-foreground">
              {isUploading ? "Uploading..." : hint}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WebP (Max. 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
