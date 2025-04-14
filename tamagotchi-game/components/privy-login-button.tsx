"use client"

import { useRouter } from "next/navigation"
import PixelButton from "./pixel-button"
import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"

type PrivyLoginButtonProps = {
  onFallback: () => void
  isConnecting: boolean
  setIsConnecting: (isConnecting: boolean) => void
  setError: (error: string) => void
}

export default function PrivyLoginButton({
  onFallback,
  isConnecting,
  setIsConnecting,
  setError,
}: PrivyLoginButtonProps) {
  const router = useRouter()

  const [privyLogin, setPrivyLogin] = useState<(() => void) | null>(null)
  const [privyAuthenticated, setPrivyAuthenticated] = useState(false)
  const [privyReady, setPrivyReady] = useState(false)

  const { login, authenticated, ready } = usePrivy()

  useEffect(() => {
    setPrivyLogin(() => login)
    setPrivyAuthenticated(authenticated)
    setPrivyReady(ready)
  }, [login, authenticated, ready])

  useEffect(() => {
    if (privyReady && privyAuthenticated) {
      router.push("/game")
    }
  }, [privyReady, privyAuthenticated, router])

  const handleLoginClick = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (privyLogin) {
        // Usar la función de login de Privy si está disponible
        privyLogin()
      } else {
        // Fallback si Privy no está disponible
        onFallback()
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError("Error al conectar la wallet")
      setIsConnecting(false)
    }
  }

  return (
    <PixelButton onClick={handleLoginClick} disabled={isConnecting || privyAuthenticated} className="w-full" size="lg">
      {isConnecting ? (
        <div className="flex items-center justify-center">
          <div className="pixel-spinner mr-2"></div>
          Conectando wallet...
        </div>
      ) : (
        "Conectar Wallet"
      )}
    </PixelButton>
  )
}
