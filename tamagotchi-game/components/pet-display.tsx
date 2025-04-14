"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import CombatStatsTooltip from "./combat-stats-tooltip"

type PetDisplayProps = {
  health: number
  happiness: number
  cleanliness: number
  level: number
  element: "fire" | "water" | "earth" | null
  petType: "yubo-green" | "yubo-pink" | "yubo-blue"
  combatStats?: {
    attack: number
    defense: number
    critChance: number
    maxHealth: number
  }
}

export default function PetDisplay({
  health,
  happiness,
  cleanliness,
  level,
  element,
  petType,
  combatStats,
}: PetDisplayProps) {
  // Determinar la imagen del YUBO basada en el tipo
  const getYuboImage = () => {
    if (petType === "yubo-green") return "/images/yubo-green.png"
    if (petType === "yubo-pink") return "/images/yubo-pink.png"
    return "/images/yubo-blue.png"
  }

  // Elemento indicador
  const getElementIndicator = () => {
    if (element === "fire") return "🔥"
    if (element === "water") return "💧"
    if (element === "earth") return "🌱"
    return null
  }

  // Indicadores de estado
  const getStatusIndicator = () => {
    if (health < 30) return "😵"
    if (happiness < 30) return "😢"
    if (cleanliness < 30) return "🧹"
    if (health > 80 && happiness > 80 && cleanliness > 80) return "😊"
    return null
  }

  return (
    <div className="relative">
      {/* Rectángulo exterior (marco de la pantalla) */}
      <div className="w-full rounded-xl border-4 border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-2 shadow-lg">
        {/* Pantalla interior con el paisaje */}
        <Card className="p-0 overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] shadow-inner">
          {/* Fondo de paisaje pixelado */}
          <div className="relative w-full h-48">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image src="/images/pixel-landscape.png" alt="Paisaje" fill className="object-cover pixel-art" />
            </div>

            {/* Contenedor para el YUBO con posición absoluta para superponerlo al fondo */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="relative">
                <div className="w-32 h-32 relative">
                  <Image
                    src={getYuboImage() || "/placeholder.svg"}
                    alt={`YUBO ${petType}`}
                    width={32}
                    height={32}
                    className="w-32 h-32 object-contain pixel-art"
                  />
                </div>

                {getElementIndicator() && <div className="absolute top-0 right-0 text-xl">{getElementIndicator()}</div>}

                {getStatusIndicator() && (
                  <div className="absolute bottom-0 right-0 text-xl">{getStatusIndicator()}</div>
                )}

                <div className="absolute top-0 left-0 bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] text-xs font-bold px-2 py-1 rounded-full font-pixel border border-[hsl(var(--border))]">
                  Lv.{level}
                </div>
              </div>
            </div>

            {/* Posicionamos el tooltip de estadísticas en la esquina superior derecha */}
            {combatStats && (
              <div className="absolute top-1 right-1 z-20">
                <CombatStatsTooltip
                  attack={combatStats.attack}
                  defense={combatStats.defense}
                  critChance={combatStats.critChance}
                  maxHealth={combatStats.maxHealth}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
