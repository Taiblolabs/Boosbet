import RegisterForm from "@/components/register-form"
import { YuboLogo } from "@/components/yubo-logo"
import Link from "next/link"

export default function Register() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <YuboLogo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-800 font-pixel">YUBO GAME</h1>
          <p className="text-amber-700 font-pixel mt-2">¡Crea una cuenta para comenzar tu aventura!</p>
        </div>

        <RegisterForm />

        <div className="mt-4 text-center">
          <Link href="/" className="text-amber-700 hover:text-amber-900 font-pixel text-sm underline">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
