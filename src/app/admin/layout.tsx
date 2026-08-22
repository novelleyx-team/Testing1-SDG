import { AdminLayoutWrapper } from "@/features/admin/components/AdminLayoutWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
