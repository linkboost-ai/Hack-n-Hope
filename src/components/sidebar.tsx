"use client"

import { cn } from "@/lib/utils"
import { Briefcase, Cog, LayoutDashboard, Puzzle, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "min-w-64 h-screen flex flex-col items-center pt-10",
        "bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-500",
        "rounded-tr-2xl rounded-br-2xl shadow-2xl",
        "border-r border-white/10",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-12 group cursor-pointer">
        <div className="h-[2px] w-8 bg-white/50 group-hover:w-12 transition-all duration-300"></div>
        <span className="text-white text-3xl font-light tracking-wider hover:tracking-widest transition-all duration-300">cinda</span>
        <div className="h-[2px] w-8 bg-white/50 group-hover:w-12 transition-all duration-300"></div>
      </div>

      <nav className="w-full px-6 flex flex-col h-full">
        <ul className="space-y-2">
          <li>
            <NavItem href="/" icon={<LayoutDashboard size={22} />} isActive={pathname === "/"}>
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem href="/consultants" icon={<Users size={22} />} isActive={pathname === "/consultants"}>
              Consultants
            </NavItem>
          </li>
          <li>
            <NavItem href="/projects" icon={<Briefcase size={22} />} isActive={pathname === "/projects"}>
              Projects
            </NavItem>
          </li>
          <li>
            <NavItem href="/matching" icon={<Puzzle size={22} />} isActive={pathname === "/matching"}>
              Matching
            </NavItem>
          </li>
        </ul>

        <ul className="space-y-2 mt-auto pb-8">
          <li>
            <NavItem href="/settings" icon={<Cog size={22} />} isActive={pathname === "/settings"}>
              Settings
            </NavItem>
          </li>
          <li>
            <NavItem 
              href="/profile" 
              icon={
                <Avatar className="h-7 w-7 ring-2 ring-white/20 transition-all hover:ring-white/40">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              } 
              isActive={pathname === "/profile"}
            >
              Profile
            </NavItem>
          </li>
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
        "flex items-center gap-3 px-5 py-3.5 rounded-xl text-white/70",
        "hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/5",
        "transition-all duration-300 ease-in-out transform hover:-translate-y-0.5",
        isActive && "bg-white/15 text-white font-medium shadow-lg shadow-white/5",
      )}
    >
      {icon}
      <span className="font-medium">{children}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-white to-white/70 shadow-glow"></div>
      )}
    </Link>
  )
}