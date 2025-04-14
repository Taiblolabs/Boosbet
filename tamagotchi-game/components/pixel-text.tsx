import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type PixelTextProps = {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

export default function PixelText({ children, className, as: Component = "p", size = "md" }: PixelTextProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }

  return <Component className={cn("font-pixel tracking-wide", sizeClasses[size], className)}>{children}</Component>
}
