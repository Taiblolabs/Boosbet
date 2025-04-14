"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import PixelButton from "./pixel-button"
import { createClient } from "@supabase/supabase-js"

// Create a single Supabase client for the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export default function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, ingresa un email válido")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Register with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        throw error
      }

      // Redirect to success page
      router.push("/registration-success")
    } catch (err: any) {
      setError(err.message || "Error al registrar. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 shadow-xl bg-white rounded-xl overflow-hidden border-4 border-amber-300 pixel-border">
      <div className="bg-amber-100 -m-6 mb-6 p-4 border-b-4 border-amber-300">
        <h2 className="text-xl font-bold text-amber-800 text-center font-pixel">Crear Cuenta</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
            <p className="text-sm font-pixel">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-amber-700 font-pixel">
            Nombre de Usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-amber-500" />
            </div>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-amber-50 border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-pixel"
              placeholder="Elige un nombre de usuario"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-amber-700 font-pixel">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-amber-500" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-amber-50 border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-pixel"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-amber-700 font-pixel">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-amber-500" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-amber-50 border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-pixel"
              placeholder="Crea una contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-amber-500" />
              ) : (
                <Eye className="h-5 w-5 text-amber-500" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-700 font-pixel">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-amber-500" />
            </div>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 bg-amber-50 border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-pixel"
              placeholder="Confirma tu contraseña"
            />
          </div>
        </div>

        <div className="pt-2">
          <PixelButton onClick={handleSubmit} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </PixelButton>
        </div>
      </form>
    </Card>
  )
}
