"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Player } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  nickname: z.string().optional(),
  number: z.coerce.number().min(0).max(999),
  position: z.enum(["Handler", "Cutter", "Hybrid"]),
  image: z.string().refine((val) => val.startsWith("/") || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL or a local path starting with /",
  }),
  funFact: z.string().optional(),
  yearJoined: z.coerce.number().min(2000).max(new Date().getFullYear()),
  isCaptain: z.boolean().default(false),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  initialData?: Player;
}

export function PlayerForm({ initialData }: PlayerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          nickname: initialData.nickname || "",
          number: initialData.number,
          position: initialData.position,
          image: initialData.image,
          funFact: initialData.funFact,
          yearJoined: initialData.yearJoined,
          isCaptain: initialData.isCaptain || false,
        }
      : {
          name: "",
          nickname: "",
          number: 0,
          position: "Cutter",
          image: "/images/roster/placeholder.jpg",
          funFact: "",
          yearJoined: new Date().getFullYear(),
          isCaptain: false,
        },
  });

  async function onSubmit(data: PlayerFormValues) {
    setIsLoading(true);
    try {
      const dbData = {
        name: data.name,
        nickname: data.nickname,
        number: data.number,
        position: data.position,
        image: data.image,
        fun_fact: data.funFact,
        year_joined: data.yearJoined,
        is_captain: data.isCaptain,
      };

      if (initialData) {
        const { error } = await supabase
          .from("players")
          .update(dbData)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Player updated successfully!");
      } else {
        const { error } = await supabase.from("players").insert([dbData]);
        if (error) throw error;
        toast.success("Player added successfully!");
      }

      router.push(`/${lang}/admin/roster`);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="The Flash" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jersey Number</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Handler">Handler</SelectItem>
                    <SelectItem value="Cutter">Cutter</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearJoined"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Joined</FormLabel>
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the player's photo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="funFact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fun Fact</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Can throw a hammer 50 yards..."
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
          name="isCaptain"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Team Captain</FormLabel>
                <FormDescription>
                  Is this player a captain of the team?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? initialData
              ? "Saving..."
              : "Adding..."
            : initialData
            ? "Update Player"
            : "Add Player"}
        </Button>
      </form>
    </Form>
  );
}
