"use client"

import type { ReactNode } from "react"

export default function PrivyAuthProvider({ children }: { children: ReactNode }) {
  // Renderizamos los children directamente, sin intentar cargar Privy
  // Esto evita cualquier error durante la hidratación
  return <>{children}</>
}
