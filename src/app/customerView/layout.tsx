import { Sidebar } from "@/components/sidebar";
import { Cog, User, Users, ClipboardList, LayoutDashboard } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
