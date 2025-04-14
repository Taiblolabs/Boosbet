"use client"

import { Button } from "@/components/ui/button"
import { Sword, Shield } from "lucide-react"

export type BodyZone = "Head" | "Chest" | "Legs"

type ZoneDamage = {
  zone: BodyZone
  baseDamage: number
  critMultiplier: number
  description: string
}

type BodyZoneSelectorProps = {
  mode: "attack" | "defense"
  onSelect: (zone: BodyZone) => void
  disabled?: boolean
}

const ZONE_DAMAGES: Record<BodyZone, ZoneDamage> = {
  Head: {
    zone: "Head",
    baseDamage: 20,
    critMultiplier: 2.0,
    description: "Alto daño, alta probabilidad de crítico",
  },
  Chest: {
    zone: "Chest",
    baseDamage: 15,
    critMultiplier: 1.5,
    description: "Daño medio, probabilidad media de crítico",
  },
  Legs: {
    zone: "Legs",
    baseDamage: 10,
    critMultiplier: 1.2,
    description: "Bajo daño, baja probabilidad de crítico",
  },
}

export default function BodyZoneSelector({ mode, onSelect, disabled = false }: BodyZoneSelectorProps) {
  const isAttack = mode === "attack"

  // Traducción de las zonas
  const zoneTranslations = {
    Head: "Cabeza",
    Chest: "Pecho",
    Legs: "Piernas",
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Silueta del personaje con zonas interactivas */}
      <div className="relative w-48 h-80 bg-purple-50 rounded-xl flex flex-col items-center justify-start mb-4">
        {/* Fondo de silueta */}
        <div className="absolute inset-0 flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full mt-4"></div>
          <div className="w-28 h-32 bg-purple-100 rounded-lg mt-2"></div>
          <div className="w-24 h-28 bg-purple-100 rounded-lg mt-2"></div>
        </div>

        {/* Zona de cabeza */}
        <Button
          onClick={() => onSelect("Head")}
          disabled={disabled}
          className={`absolute top-4 w-20 h-20 rounded-full ${
            isAttack
              ? "bg-red-500/80 hover:bg-red-600 focus:bg-red-700"
              : "bg-blue-500/80 hover:bg-blue-600 focus:bg-blue-700"
          } disabled:opacity-50 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-offset-2 ${
            isAttack ? "focus:ring-red-300" : "focus:ring-blue-300"
          }`}
          aria-label={`${isAttack ? "Atacar" : "Defender"} cabeza`}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{zoneTranslations.Head}</span>
            {isAttack ? <Sword className="w-4 h-4 text-white mt-1" /> : <Shield className="w-4 h-4 text-white mt-1" />}
          </div>
        </Button>

        {/* Zona de pecho */}
        <Button
          onClick={() => onSelect("Chest")}
          disabled={disabled}
          className={`absolute top-28 w-28 h-28 rounded-lg ${
            isAttack
              ? "bg-red-500/80 hover:bg-red-600 focus:bg-red-700"
              : "bg-blue-500/80 hover:bg-blue-600 focus:bg-blue-700"
          } disabled:opacity-50 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-offset-2 ${
            isAttack ? "focus:ring-red-300" : "focus:ring-blue-300"
          }`}
          aria-label={`${isAttack ? "Atacar" : "Defender"} pecho`}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{zoneTranslations.Chest}</span>
            {isAttack ? <Sword className="w-4 h-4 text-white mt-1" /> : <Shield className="w-4 h-4 text-white mt-1" />}
          </div>
        </Button>

        {/* Zona de piernas */}
        <Button
          onClick={() => onSelect("Legs")}
          disabled={disabled}
          className={`absolute top-60 w-24 h-28 rounded-lg ${
            isAttack
              ? "bg-red-500/80 hover:bg-red-600 focus:bg-red-700"
              : "bg-blue-500/80 hover:bg-blue-600 focus:bg-blue-700"
          } disabled:opacity-50 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-offset-2 ${
            isAttack ? "focus:ring-red-300" : "focus:ring-blue-300"
          }`}
          aria-label={`${isAttack ? "Atacar" : "Defender"} piernas`}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{zoneTranslations.Legs}</span>
            {isAttack ? <Sword className="w-4 h-4 text-white mt-1" /> : <Shield className="w-4 h-4 text-white mt-1" />}
          </div>
        </Button>
      </div>

      {/* Texto informativo */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-purple-800">
          {isAttack ? "Selecciona dónde atacar" : "Selecciona dónde defender"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {isAttack
            ? "Diferentes zonas tienen distintas probabilidades de crítico"
            : "Bloquea el ataque enemigo en la zona correcta"}
        </p>
      </div>
    </div>
  )
}
