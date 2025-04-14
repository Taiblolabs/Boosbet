"use client"

import { useRouter } from "next/navigation"
import { YuboLogo } from "@/components/yubo-logo"
import PixelButton from "@/components/pixel-button"
import { LogOut } from "lucide-react"
import TamagotchiGame from "@/components/tamagotchi-game"

export default function Game() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <YuboLogo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-800 font-pixel">YUBO GAME</h1>

          <div className="text-amber-700 font-pixel mt-2">
            <p>Wallet: Demo...1234</p>
            <p className="text-xs mt-1">Red: Ethereum</p>
          </div>
        </div>

        <TamagotchiGame />

        <div className="mt-4 text-center">
          <PixelButton onClick={handleLogout} className="w-full" icon={<LogOut className="w-4 h-4 mr-2" />}>
            Cerrar Sesión
          </PixelButton>
        </div>
      </div>
    </main>
  )
}
