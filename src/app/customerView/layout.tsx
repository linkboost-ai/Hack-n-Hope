import { Sidebar } from "@/components/sidebar";
import { Cog, User, Users, ClipboardList, LayoutDashboard } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar
        navItems={[
          {
            href: "/customerView/customerOverview",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
          },
          {
            href: "/customerView/customerMatching",
            icon: <Users size={20} />,
            label: "Matching",
          },
          {
            href: "/customerView/projectRequest",
            icon: <ClipboardList size={20} />,
            label: "Project Request",
          },
          {
            href: "/settings",
            icon: <Cog size={20} />,
            label: "Settings",
          },
          {
            href: "/profile",
            icon: <User size={20} />,
            label: "Profile",
          },
        ]}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
