"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SubmissionActionsProps {
  id: string;
  currentStatus: string;
}

export function SubmissionActions({ id, currentStatus }: SubmissionActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error, data } = await supabase
        .from('gallery_submissions')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("You don't have permission to update this or the record was not found.");
      }

      toast.success(`Submission ${status}!`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {currentStatus === "pending" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600"
            onClick={() => handleStatusUpdate("approved")}
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            onClick={() => handleStatusUpdate("rejected")}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
