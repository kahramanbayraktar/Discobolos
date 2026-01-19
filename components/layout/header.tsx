"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/roster", label: "Roster" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/rules", label: "Rules & Spirit" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Join Us" },
];

function DiscobolosLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Discus thrower silhouette inspired by jersey */}
      <circle cx="24" cy="24" r="22" className="fill-primary" />
      <circle cx="24" cy="24" r="18" className="fill-accent" />
      <circle cx="24" cy="24" r="14" className="fill-primary" />
      {/* Stylized athlete figure */}
      <path
        d="M20 16c1.5 0 2.5-1 2.5-2.5S21.5 11 20 11s-2.5 1-2.5 2.5S18.5 16 20 16z"
        className="fill-primary-foreground"
      />
      <path
        d="M16 36l4-8 2-4 6-2 4-6-2-1-4 5-5 1-1 3-5 10 1 2z"
        className="fill-primary-foreground"
      />
      <circle cx="32" cy="20" r="4" className="stroke-primary-foreground stroke-2 fill-none" />
      <circle cx="32" cy="20" r="2" className="fill-primary-foreground" />
    </svg>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
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

        <div className="hidden lg:flex">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/contact">Join the Team</Link>
          </Button>
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
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-border"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Join the Team
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
