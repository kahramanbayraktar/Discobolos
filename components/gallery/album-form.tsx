"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { GalleryAlbum } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const albumSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  coverImage: z.string().url("Must be a valid image URL."),
  googlePhotosUrl: z.string().url("Must be a valid Google Photos URL."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  photoCount: z.coerce.number().min(0).default(0),
  previewImages: z.string().optional(),
});

interface AlbumFormProps {
  initialData?: GalleryAlbum;
}

export function AlbumForm({ initialData }: AlbumFormProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();

  const form = useForm<z.infer<typeof albumSchema>>({
    resolver: zodResolver(albumSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          coverImage: initialData.coverImage,
          googlePhotosUrl: initialData.googlePhotosUrl,
          date: initialData.date,
          photoCount: initialData.photoCount,
          previewImages: initialData.previewImages?.join("\n") || "",
        }
      : {
          title: "",
          description: "",
          coverImage: "",
          googlePhotosUrl: "",
          date: new Date().toISOString().split("T")[0],
          photoCount: 0,
          previewImages: "",
        },
  });

  async function onSubmit(values: z.infer<typeof albumSchema>) {
    try {
      const dbData = {
        title: values.title,
        description: values.description,
        cover_image: values.coverImage,
        google_photos_url: values.googlePhotosUrl,
        date: values.date,
        photo_count: values.photoCount,
        preview_images: values.previewImages 
          ? values.previewImages.split("\n").map(url => url.trim()).filter(url => url.length > 0)
          : [],
      };

      if (initialData) {
        const { error } = await supabase
          .from("gallery")
          .update(dbData)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Album updated successfully!");
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert([dbData]);
        if (error) throw error;
        toast.success("Album created successfully!");
      }
      router.push(`/${lang}/admin/gallery`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album Title</FormLabel>
              <FormControl>
                <Input placeholder="Fall Championship 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us more about this event..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photoCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo Count (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://images.unsplash.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="googlePhotosUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Photos Shared Album Link</FormLabel>
              <FormControl>
                <Input placeholder="https://photos.app.goo.gl/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preview Highlights (URLs)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Paste direct image URLs here, one per line..." 
                  className="min-h-[120px] font-mono text-sm"
                  {...field} 
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Paste direct links to images (ending in .jpg, .png etc.) to show a preview on the site. Put each URL on a new line.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${lang}/admin/gallery`)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Save Changes" : "Create Album"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
