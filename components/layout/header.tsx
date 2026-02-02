"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/i18n-config";
import { createClient } from "@/lib/supabase/client";
import { getCookie } from "@/lib/utils";
import { LayoutDashboard, LogOut, Menu, User, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function DiscobolosLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Discobolos Logo"
      width={40}
      height={40}
      className={className}
      priority
    />
  );
}

export function Header({ dict, lang }: { dict: any, lang: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchPlayer = async () => {
      const token = getCookie('player_token');
      if (token) {
        const { data: player } = await supabase
          .from('players')
          .select('*')
          .eq('id', token)
          .maybeSingle();
        
        if (player) {
          setUser({
            id: player.id,
            email: player.email,
            name: player.name,
            image: player.image,
            isCaptain: player.is_captain
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchPlayer();

    // We can't easily subscribe to cookie changes, but router.refresh() 
    // from login/logout will re-mount or re-render components.
  }, [pathname]); // Refresh on navigation to ensure state is current

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/roster`, label: dict.nav.roster },
    { href: `/${lang}/attendance`, label: dict.attendance.badge || "Hall of Fame" },
    { href: `/${lang}/events`, label: dict.nav.events },
    { href: `/${lang}/news`, label: dict.nav.news },
    { href: `/${lang}/rules`, label: dict.nav.rules },
    { href: `/${lang}/gallery`, label: dict.nav.gallery },
  ];

  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleLogout = async () => {
    document.cookie = "player_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await supabase.auth.signOut();
    setUser(null);
    router.push(`/${lang}`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden transition-transform group-hover:scale-105">
            <DiscobolosLogo className="h-10 w-10" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-foreground">
            Discobolos
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} className={navigationMenuTriggerStyle()}>
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 text-sm font-medium">
                <Link 
                    href={redirectedPathName("tr")} 
                    className={`hover:text-primary transition-colors ${lang === 'tr' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    TR
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link 
                    href={redirectedPathName("en")} 
                    className={`hover:text-primary transition-colors ${lang === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    EN
                </Link>
            </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 overflow-hidden">
                  <Avatar className="h-full w-full">
                    {user.image ? (
                      <Image 
                        src={user.image} 
                        alt={user.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user.name?.[0].toUpperCase() || user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${lang}/profile`} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>{dict.nav.profile}</span>
                  </Link>
                </DropdownMenuItem>
                {user.isCaptain && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/admin`} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{dict.nav.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                  <Link href={`/${lang}/contact`}>{dict.nav.join}</Link>
                </Button>
                
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-popover border border-primary/20 rounded-lg shadow-xl p-1 min-w-[140px]">
                    <Button asChild variant="ghost" className="w-full justify-start text-xs h-9 hover:bg-primary/10 text-foreground">
                      <Link href={`/${lang}/login`} className="flex items-center gap-2 w-full">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium text-foreground">
                          {lang === 'tr' ? 'Giriş Yap' : 'Login'}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-2 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors py-3 px-4 border-b border-border"
                >
                  {item.label}
                </Link>
              ))}
              
              {user && (
                <Link
                  href={`/${lang}/profile`}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors py-3 px-4 border-b border-border flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  {dict.nav.profile}
                </Link>
              )}

               <div className="flex items-center gap-4 py-4 px-4 border-b border-border">
                    <Link 
                        href={redirectedPathName("tr")} 
                        className={`text-lg font-medium hover:text-primary ${lang === 'tr' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                        TR
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <Link 
                        href={redirectedPathName("en")} 
                        className={`text-lg font-medium hover:text-primary ${lang === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                        EN
                    </Link>
               </div>

              <div className="px-4 mt-6">
                {user ? (
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    {dict.nav.logout}
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/${lang}/login`} onClick={() => setIsOpen(false)}>
                      {dict.nav.join}
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
