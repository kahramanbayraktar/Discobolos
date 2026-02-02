"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // Clear the custom session cookie
    document.cookie = "player_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Also sign out from Supabase Auth just in case
    await supabase.auth.signOut();
    
    toast.success("Çıkış yapıldı");
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2" {...props}>
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
