"use client"

import { cn } from "@/lib/utils"
<<<<<<< HEAD
import { Briefcase, Cog, LayoutDashboard, Puzzle, Users } from "lucide-react"
=======
>>>>>>> ecc2bb39febd5db7b717f893e5bb9e4181bc54e2
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

interface SidebarProps {
  className?: string
  navItems: NavItem[]
}

<<<<<<< HEAD
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

=======
export function Sidebar({ className, navItems }: SidebarProps) {
>>>>>>> ecc2bb39febd5db7b717f893e5bb9e4181bc54e2
  return (
    <div
      className={cn(
        "min-w-64 h-screen flex flex-col items-center pt-10",
        "bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-500",
        "rounded-tr-2xl rounded-br-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-8">
        <div className="h-px w-6 bg-white"></div>
        <span className="text-white text-2xl font-light">cinda</span>
        <div className="h-px w-6 bg-white"></div>
      </div>

      <nav className="w-full px-6 flex flex-col h-full">
        <ul className="space-y-4">
<<<<<<< HEAD
          <li>
            <NavItem href="/" icon={<LayoutDashboard size={20} />} isActive={pathname === "/"}>
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem href="/consultants" icon={<Users size={20} />} isActive={pathname === "/consultants"}>
              Consultants
            </NavItem>
          </li>
          <li>
            <NavItem href="/projects" icon={<Briefcase size={20} />} isActive={pathname === "/projects"}>
              Projects
            </NavItem>
          </li>
          <li>
            <NavItem href="/matching" icon={<Puzzle size={20} />} isActive={pathname === "/matching"}>
              Matching
            </NavItem>
          </li>
        </ul>

        <ul className="space-y-4 mt-auto pb-8">
          <li>
            <NavItem href="/settings" icon={<Cog size={20} />} isActive={pathname === "/settings"}>
              Settings
            </NavItem>
          </li>
          <li>
            <NavItem 
              href="/profile" 
              icon={
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              } 
              isActive={pathname === "/profile"}
            >
              Profile
            </NavItem>
          </li>
=======
          {navItems.map((item) => (
            <li key={item.href}>
              <NavItem href={item.href} icon={item.icon} isActive={false}>
                {item.label}
              </NavItem>
            </li>
          ))}
>>>>>>> ecc2bb39febd5db7b717f893e5bb9e4181bc54e2
        </ul>
      </nav>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  isActive?: boolean
}

function NavItem({ href, icon, children, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors",
        isActive && "bg-white/10 text-white font-medium",
      )}
    >
      {icon}
      <span>{children}</span>
      {isActive && <div className="ml-auto w-1.5 h-5 rounded-full bg-white"></div>}
    </Link>
  )
}