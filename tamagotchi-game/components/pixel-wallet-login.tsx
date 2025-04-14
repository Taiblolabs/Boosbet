"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { YuboLogo } from "./yubo-logo"
import PixelButton from "./pixel-button"

export default function PixelWalletLogin() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setIsConnecting(true)
    setError("")

    try {
      // Simulamos un proceso de login
      setTimeout(() => {
        router.push("/game")
      }, 1000)
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError("Error al conectar la wallet")
      setIsConnecting(false)
    }
  }

  return (
    <div className="pixel-card">
      <div className="bg-amber-100 -m-6 mb-6 p-4 border-b-4 border-amber-300 text-center">
        <h1 className="text-2xl font-bold text-amber-800 font-pixel">
          Login YUBO <span className="ml-1">🚀</span>
        </h1>
      </div>

      <div className="card-content">
        <div className="flex justify-center mb-8">
          <YuboLogo className="w-24 h-24" />
        </div>

        <div className="w-32 h-32 mx-auto bg-amber-100 rounded-lg border-4 border-amber-300 flex items-center justify-center mb-6 pixel-border">
          <span className="text-6xl">🐾</span>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
            <p id="errorMessage" className="text-sm font-pixel">
              {error}
            </p>
          </div>
        )}

        <PixelButton onClick={handleLogin} disabled={isConnecting} className="w-full" size="lg">
          {isConnecting ? (
            <div className="flex items-center justify-center">
              <div className="pixel-spinner mr-2"></div>
              Conectando wallet...
            </div>
          ) : (
            "Conectar Wallet"
          )}
        </PixelButton>

        <div className="status-container mt-4">
          <div id="statusIndicator" className={`status-indicator ${isConnecting ? "connecting" : ""}`}></div>
          <p id="statusMessage" className="status-text font-pixel">
            {isConnecting ? "Conectando..." : "Esperando conexión..."}
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-amber-700 text-sm font-pixel">
            Conéctate para acceder al universo YUBO o{" "}
            <Link href="/register" className="text-amber-900 underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
