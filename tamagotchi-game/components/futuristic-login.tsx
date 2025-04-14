"use client"

import { useState } from "react"

export default function FuturisticLogin() {
  const [connectionStatus, setConnectionStatus] = useState("Aguardando conexão...")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    setConnectionStatus("Conectando...")

    // Simulación de conexión - aquí iría la integración con WalletConnect
    setTimeout(() => {
      setConnectionStatus("Wallet conectada com sucesso!")
      setIsConnecting(false)
    }, 2000)
  }

  return (
    <div className="futuristic-card">
      <div className="glow-effect"></div>

      <div className="card-content">
        <div className="flex items-center justify-center mb-8">
          <div className="yubo-logo">
            <span className="text-4xl">Y</span>
          </div>
          <h1 className="text-3xl font-bold text-white ml-3">
            Login YUBO <span className="ml-1">🚀</span>
          </h1>
        </div>

        <button onClick={handleConnect} disabled={isConnecting} className="connect-button">
          {isConnecting ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Conectando...
            </div>
          ) : (
            <>Conectar Wallet</>
          )}
        </button>

        <div className="status-container">
          <div className="status-indicator"></div>
          <p className="status-text">{connectionStatus}</p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Conecte sua carteira para acessar o universo YUBO</p>
        </div>
      </div>
    </div>
  )
}
