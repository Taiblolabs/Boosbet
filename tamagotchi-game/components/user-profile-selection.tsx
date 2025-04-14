"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Upload, ArrowRight, User, FileText, ImageIcon } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import PixelButton from "./pixel-button"

// Define the avatar options
const AVATAR_OPTIONS = [
  { id: "avatar1", emoji: "👧", name: "Chica" },
  { id: "avatar2", emoji: "👦", name: "Chico" },
  { id: "avatar3", emoji: "👩", name: "Mujer" },
  { id: "avatar4", emoji: "👨", name: "Hombre" },
  { id: "avatar5", emoji: "🧙‍♀️", name: "Maga" },
  { id: "avatar6", emoji: "🧙‍♂️", name: "Mago" },
  { id: "avatar7", emoji: "👸", name: "Princesa" },
  { id: "avatar8", emoji: "🤴", name: "Príncipe" },
  { id: "avatar9", emoji: "🦊", name: "Zorro" },
]

export type UserProfile = {
  name: string
  avatar: string
  customAvatar?: string
  description: string
  battleRecords: {
    wins: number
    losses: number
    totalExperience: number
  }
}

type UserProfileSelectionProps = {
  onProfileComplete: (profile: UserProfile) => void
}

export default function UserProfileSelection({ onProfileComplete }: UserProfileSelectionProps) {
  // Estado para el paso actual
  const [step, setStep] = useState(1)

  // Estados para los datos del perfil
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].emoji)
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)
  const [description, setDescription] = useState("")

  // Estado para errores
  const [nameError, setNameError] = useState("")

  // Referencia para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para manejar la carga de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomAvatar(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError("Por favor, introduce tu nombre")
        return
      }
      setNameError("")
    }

    setStep(step + 1)
  }

  // Función para retroceder al paso anterior
  const prevStep = () => {
    setStep(step - 1)
  }

  // Función para completar el perfil
  const completeProfile = () => {
    onProfileComplete({
      name: name.trim(),
      avatar: customAvatar ? "custom" : selectedAvatar,
      customAvatar: customAvatar || undefined,
      description: description.trim(),
      battleRecords: {
        wins: 0,
        losses: 0,
        totalExperience: 0,
      },
    })
  }

  // Variantes para las animaciones
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  // Dirección de la animación
  const [direction, setDirection] = useState(1)

  // Función para ir al siguiente paso con animación
  const goToNextStep = () => {
    setDirection(1)
    nextStep()
  }

  // Función para ir al paso anterior con animación
  const goToPrevStep = () => {
    setDirection(-1)
    prevStep()
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-6 shadow-xl bg-[hsl(var(--background))] rounded-xl overflow-hidden border-2 border-[hsl(var(--border))]">
        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div
              className={`flex items-center ${step >= 1 ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted))]"
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Nombre</span>
            </div>
            <div
              className={`flex items-center ${step >= 2 ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted))]"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Avatar</span>
            </div>
            <div
              className={`flex items-center ${step >= 3 ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted))]"
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Bio</span>
            </div>
          </div>
          <div className="w-full bg-[hsl(var(--muted))] h-2 rounded-full">
            <div
              className="bg-[hsl(var(--primary))] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Contenido de los pasos */}
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))]">¿Cómo te llamas?</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">Dinos tu nombre de entrenador</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Nombre de Entrenador
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setNameError("")
                  }}
                  placeholder="Introduce tu nombre"
                  className={`text-lg py-6 bg-[hsl(var(--accent))] border-2 ${
                    nameError ? "border-red-500" : "border-[hsl(var(--border))]"
                  }`}
                  autoFocus
                />
                {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
              </div>

              <PixelButton
                onClick={goToNextStep}
                className="w-full mt-6"
                icon={<ArrowRight className="ml-2 w-4 h-4" />}
              >
                Continuar
              </PixelButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))]">Elige tu Avatar</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                  Selecciona un avatar o sube tu propia imagen
                </p>
              </div>

              {/* Mostrar avatar personalizado si existe */}
              {customAvatar && (
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-[hsl(var(--border))]">
                    <Image
                      src={customAvatar || "/placeholder.svg"}
                      alt="Avatar personalizado"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <PixelButton variant="secondary" size="sm" onClick={() => setCustomAvatar(null)} className="text-xs">
                    Eliminar foto
                  </PixelButton>
                </div>
              )}

              {/* Opción para subir foto */}
              <div className="flex justify-center mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <PixelButton
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir tu foto
                </PixelButton>
              </div>

              <div className="text-center mb-2">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">O elige un avatar predefinido:</p>
              </div>

              {/* Grid de avatares predefinidos */}
              <div className="grid grid-cols-3 gap-2">
                {AVATAR_OPTIONS.map((avatar) => (
                  <PixelButton
                    key={avatar.id}
                    variant={selectedAvatar === avatar.emoji && !customAvatar ? "primary" : "secondary"}
                    className="h-16 relative"
                    onClick={() => {
                      setSelectedAvatar(avatar.emoji)
                      setCustomAvatar(null)
                    }}
                    size="sm"
                  >
                    <span className="text-2xl">{avatar.emoji}</span>
                    {selectedAvatar === avatar.emoji && !customAvatar && (
                      <Check className="w-4 h-4 absolute top-1 right-1 text-[hsl(var(--primary))]" />
                    )}
                  </PixelButton>
                ))}
              </div>

              <div className="flex space-x-2 mt-6">
                <PixelButton onClick={goToPrevStep} variant="secondary" className="flex-1">
                  Atrás
                </PixelButton>
                <PixelButton onClick={goToNextStep} className="flex-1">
                  Continuar
                </PixelButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))]">Cuéntanos sobre ti</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                  Una breve descripción para tu perfil (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Me encanta entrenar mascotas virtuales y..."
                  className="resize-none h-32 bg-[hsl(var(--accent))] border-2 border-[hsl(var(--border))]"
                  autoFocus
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Máximo 150 caracteres</p>
              </div>

              <div className="flex space-x-2 mt-6">
                <PixelButton onClick={goToPrevStep} variant="secondary" className="flex-1">
                  Atrás
                </PixelButton>
                <PixelButton onClick={completeProfile} className="flex-1">
                  ¡Comenzar aventura!
                </PixelButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
