"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out");
      router.push("./login");
      router.refresh();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
