import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-6 px-4">
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}
