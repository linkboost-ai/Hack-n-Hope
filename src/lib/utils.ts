import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateStyle = "full" | "long" | "medium" | "short"
type DateFormatOptions = {
  style?: DateStyle
  includeTime?: boolean
  timeStyle?: DateStyle
}

export function formatDate(date: string | Date | null, options: DateFormatOptions = {}) {
  if (!date) return "No date"
  
  const {
    style = "medium",
    includeTime = false,
    timeStyle = "short"
  } = options

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: style,
      ...(includeTime && { timeStyle })
    })

    return formatter.format(dateObj)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Error formatting date"
  }
}

export function formatRelativeTime(date: string | Date) {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}y ago`
    if (months > 0) return `${months}mo ago`
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    if (seconds > 30) return `${seconds}s ago`
    return 'just now'
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return "Error formatting date"
  }
}

export function getMonthYear(date: string | Date) {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", { 
      month: "short",
      year: "numeric"
    }).format(dateObj)
  } catch (error) {
    console.error("Error getting month/year:", error)
    return "Invalid date"
  }
}

export function getDurationInMonths(startDate: string | Date, endDate: string | Date | null) {
  try {
    const start = typeof startDate === "string" ? new Date(startDate) : startDate
    const end = endDate ? (typeof endDate === "string" ? new Date(endDate) : endDate) : new Date()
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  (end.getMonth() - start.getMonth())
    
    return months
  } catch (error) {
    console.error("Error calculating duration:", error)
    return 0
  }
}
