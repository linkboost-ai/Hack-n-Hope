import type React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

interface SidebarProps {
  className?: string
  navItems: NavItem[]
}

export function Sidebar({ className, navItems }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-64 rounded-r-xl flex flex-col items-center pt-10",
        "bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-500",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-16">
        <div className="h-px w-6 bg-white"></div>
        <span className="text-white text-2xl font-light">cinda</span>
        <div className="h-px w-6 bg-white"></div>
      </div>

      <nav className="w-full px-6">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavItem href={item.href} icon={item.icon} isActive={false}>
                {item.label}
              </NavItem>
            </li>
          ))}
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