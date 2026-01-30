"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGallerySubmission } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GalleryUploadProps {
  albumId: string;
  dict: any;
}

export function GalleryUpload({ albumId, dict }: GalleryUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !authorName) {
      toast.error(dict.contribute_error_file || "Please select a file and enter your name.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `submissions/${albumId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-uploads')
        .getPublicUrl(filePath);

      // 3. Create Database Record
      await createGallerySubmission({
        albumId,
        url: publicUrl,
        filePath: filePath,
        authorName: authorName,
      });

      toast.success(dict.contribute_success || "Successfully uploaded! Admin will review it soon.");
      setIsOpen(false);
      setFile(null);
      setAuthorName("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white transition-colors w-full md:w-auto">
          {dict.contribute_button}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.contribute_title}</DialogTitle>
          <DialogDescription>
            {dict.contribute_placeholder || "Select a photo or video to share with the team."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">{dict.contribute_name_label || "Your Name"}</Label>
            <Input 
              id="authorName" 
              placeholder={dict.contribute_name_placeholder || "Who took this?"}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">{dict.contribute_file_label || "Photo/Video"}</Label>
            <Input 
              id="file" 
              type="file" 
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading || !file || !authorName}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dict.contribute_uploading || "Uploading..."}
              </>
            ) : (
              dict.contribute_submit || "Upload and Share"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
