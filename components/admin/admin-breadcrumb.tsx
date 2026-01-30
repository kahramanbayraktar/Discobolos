"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const segmentMap: Record<string, string> = {
  admin: "Dashboard",
  events: "Events",
  roster: "Roster",
  new: "New",
  edit: "Edit",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  // URL format: /lang/admin/segment1/segment2
  // We want to skip 'lang' as a displayed segment often, or display it as home
  
  const lang = segments[0];
  const adminSegments = segments.slice(1); // skip /lang/

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${lang}`} className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {adminSegments.map((segment, index) => {
          const href = `/${lang}/${adminSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === adminSegments.length - 1;
          const label = segmentMap[segment] || (segment.length > 20 ? "Detail" : segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
