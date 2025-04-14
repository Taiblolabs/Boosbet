"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PixelButtonProps = {
  onClick: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "danger" | "success"
  icon?: ReactNode
}

export default function PixelButton({
  onClick,
  children,
  className = "",
  disabled = false,
  size = "md",
  variant = "primary",
  icon,
}: PixelButtonProps) {
  // Determinar tamaños basados en la prop size
  const sizeClasses = {
    sm: "min-w-20 h-10 text-xs",
    md: "min-w-32 h-12 text-sm",
    lg: "min-w-40 h-14 text-base",
  }

  // Determinar colores basados en la prop variant
  const variantClasses = {
    primary: "text-amber-950",
    secondary: "text-amber-950 opacity-90",
    danger: "text-red-900",
    success: "text-green-900",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center transition-transform",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95",
        sizeClasses[size],
        className,
      )}
    >
      {/* Estructura pixelada del botón */}
      <div className="relative w-full h-full">
        {/* Capa base - borde exterior más oscuro */}
        <div className="absolute inset-0 bg-amber-950 rounded-md"></div>

        {/* Capa 2 - borde interior */}
        <div className="absolute inset-[2px] bg-amber-800 rounded-sm"></div>

        {/* Capa 3 - borde interior secundario */}
        <div className="absolute inset-[4px] bg-amber-600 rounded-sm"></div>

        {/* Capa 4 - fondo principal */}
        <div className="absolute inset-[6px] bg-amber-400 rounded-sm"></div>

        {/* Capa 5 - área central */}
        <div className="absolute inset-[8px] bg-amber-300 rounded-sm"></div>

        {/* Efecto de textura moteada */}
        <div
          className="absolute inset-[8px] opacity-20 mix-blend-multiply rounded-sm"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(120, 80, 40, 0.6) 2px, transparent 2px), 
                              radial-gradient(circle at 70% 60%, rgba(120, 80, 40, 0.6) 2px, transparent 2px),
                              radial-gradient(circle at 40% 80%, rgba(120, 80, 40, 0.6) 2px, transparent 2px),
                              radial-gradient(circle at 60% 20%, rgba(120, 80, 40, 0.6) 2px, transparent 2px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Contenido del botón */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-pixel tracking-wide px-2 text-amber-950",
            variantClasses[variant],
          )}
        >
          {icon && <span className="mr-1">{icon}</span>}
          {children}
        </div>
      </div>
    </button>
  )
}
