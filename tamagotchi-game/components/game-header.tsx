"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

export default function GameHeader() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletChainId, setWalletChainId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const { ready, authenticated, user } = usePrivy()

  useEffect(() => {
    if (ready && authenticated && user) {
      setWalletAddress(user.wallet?.address || null)
      setWalletChainId(user.wallet?.chainId || null)
      setEmail(user.email?.address || null)
    }
  }, [ready, authenticated, user])

  // Si no hay información de usuario, mostrar un valor por defecto
  if (!walletAddress && !email) {
    return (
      <div className="text-amber-700 font-pixel mt-2">
        <p>Wallet: Demo...1234</p>
        <p className="text-xs mt-1">Red: Ethereum</p>
      </div>
    )
  }

  return (
    <div className="text-amber-700 font-pixel mt-2">
      {walletAddress ? (
        <>
          <p>
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          {walletChainId && (
            <p className="text-xs mt-1">
              Red: {walletChainId === "1" ? "Ethereum" : walletChainId === "solana" ? "Solana" : walletChainId}
            </p>
          )}
        </>
      ) : email ? (
        <p>Email: {email}</p>
      ) : (
        <p>Usuario: Invitado</p>
      )}
    </div>
  )
}
