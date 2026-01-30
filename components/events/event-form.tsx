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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
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
  time: zod.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  endTime: zod.string().optional(),
  location: zod.string().min(2, "Location is required"),
  locationUrl: zod.string().url("Invalid URL").optional().or(zod.literal("")),
  type: zod.enum(["practice", "match", "social", "tournament"]),
  opponent: zod.string().optional(),
});

type EventFormValues = zod.infer<typeof eventSchema>;

export function EventForm() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "18:00",
      type: "practice",
      location: "",
      locationUrl: "",
      opponent: "",
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          end_time: data.endTime || null,
          location: data.location,
          location_url: data.locationUrl || null,
          type: data.type,
          opponent: data.opponent || null
        }]);

      if (error) throw error;

      toast.success("Event created successfully!");
      router.push(`/${lang}/events`); 
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to create event: " + error.message);
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
              <FormLabel>Event Title</FormLabel>
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
              <FormLabel>Description</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date (YYYY-MM-DD)</FormLabel>
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
                  <FormLabel>Start Time</FormLabel>
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
                  <FormLabel>End Time</FormLabel>
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
                <FormLabel>Event Type</FormLabel>
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
                <FormLabel>Opponent (if match)</FormLabel>
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
                <FormLabel>Location</FormLabel>
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
                <FormLabel>Google Maps URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
