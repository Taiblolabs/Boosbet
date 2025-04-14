"use client"

import { YuboLogo } from "@/components/yubo-logo"
import PixelButton from "@/components/pixel-button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function RegistrationSuccess() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <YuboLogo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-800 font-pixel">YUBO GAME</h1>
        </div>

        <Card className="p-6 shadow-xl bg-white rounded-xl overflow-hidden border-4 border-green-300 pixel-border">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>

            <h2 className="text-xl font-bold text-green-800 mb-2 font-pixel">¡Registro Exitoso!</h2>
            <p className="text-amber-700 mb-6 font-pixel">
              Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión y comenzar tu aventura.
            </p>

            <Link href="/" className="block">
              <PixelButton onClick={() => {}} className="w-full" variant="success">
                Ir al Inicio de Sesión
              </PixelButton>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
