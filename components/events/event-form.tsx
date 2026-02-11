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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Event } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as zod from "zod";

const eventSchema = zod.object({
  title: zod.string().min(2, "Title is too short"),
  description: zod.string().min(5, "Description is too short"),
  date: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: zod.string().regex(/^([0-9]{1,2}):([0-9]{2})(:[0-9]{2})?$/, "Invalid time format (HH:MM)"),
  endTime: zod.string().optional().or(zod.literal("")),
  location: zod.string().min(2, "Location is required"),
  locationUrl: zod.string().url("Invalid URL").optional().or(zod.literal("")),
  type: zod.enum(["practice", "match", "social", "tournament"]),
  opponent: zod.string().optional(),
  image: zod.string().url("Invalid Image URL").optional().or(zod.literal("")),
});

type EventFormValues = zod.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Event;
  dict: any;
}

export function EventForm({ initialData, dict }: EventFormProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const t = dict.events_page.form;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: initialData.date,
          time: initialData.time,
          endTime: initialData.endTime || "",
          type: initialData.type,
          location: initialData.location,
          locationUrl: initialData.locationUrl || "",
          opponent: initialData.opponent || "",
          image: initialData.image || "",
        }
      : {
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: "18:00",
          type: "practice",
          location: "",
          locationUrl: "",
          opponent: "",
          image: "",
        },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      const dbData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        end_time: data.endTime || null,
        location: data.location,
        location_url: data.locationUrl || null,
        type: data.type,
        opponent: data.opponent || null,
        image_url: data.image || null,
      };

      if (initialData) {
        const { error } = await supabase
          .from('events')
          .update(dbData)
          .eq('id', initialData.id);
        if (error) throw error;
        toast.success(initialData ? t.save_success || "Event updated!" : t.create_success || "Event created!");
      } else {
        const { error } = await supabase
          .from('events')
          .insert([dbData]);
        if (error) throw error;
        toast.success(t.submit_create_success || "Event created successfully!");
      }

      router.push(`/${lang}/events`); 
      router.refresh();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
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
              <FormLabel>{t.title}</FormLabel>
              <FormControl>
                <Input placeholder="Weekly Practice" {...field} />
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
              <FormLabel>{t.description}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about the event..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.image}</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <ImageUpload 
                    value={field.value} 
                    onChange={field.onChange}
                    bucket="events"
                    folder="covers"
                    hint={t.image_hint}
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.manual_url}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    {...field} 
                    className="h-8 text-xs bg-muted/30"
                  />
                </div>
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
                <FormLabel>{t.date}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.start_time}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.end_time}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.type}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="match">Match</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="tournament">Tournament</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opponent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.opponent}</FormLabel>
                <FormControl>
                  <Input placeholder="Bay Bombers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.location}</FormLabel>
                <FormControl>
                  <Input placeholder="Golden Gate Park" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.location_url}</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading 
            ? t.loading
            : (initialData ? t.submit_save : t.submit_create)}
        </Button>
      </form>
    </Form>
  );
}
