"use client"

import { useState } from "react"
import { Sword, X } from "lucide-react"
import PixelText from "./pixel-text"

type CombatStatsTooltipProps = {
  attack: number
  defense: number
  critChance: number
  maxHealth: number
}

export default function CombatStatsTooltip({ attack, defense, critChance, maxHealth }: CombatStatsTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-0.5 right-0.5 z-10">
      {/* Botón de estadísticas - mucho más pequeño */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-4 h-4 rounded-full bg-[hsl(var(--combat-attack))] hover:bg-[hsl(var(--combat-attack))] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-[hsl(var(--border))]"
        aria-label="Ver estadísticas de combate"
      >
        <Sword className="w-2 h-2 text-white" />
      </button>

      {/* Tooltip de estadísticas - posicionado para no interferir */}
      {isOpen && (
        <div className="absolute top-5 right-0 w-40 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg p-2 shadow-lg">
          <div className="flex justify-between items-start mb-1">
            <PixelText as="h4" size="xs" className="font-bold text-[hsl(var(--primary))] flex items-center">
              <Sword className="w-3 h-3 text-[hsl(var(--combat-attack))] mr-1" />
              Estadísticas
            </PixelText>
            <button
              onClick={() => setIsOpen(false)}
              className="w-4 h-4 p-0 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center"
            >
              <X className="w-2 h-2 text-[hsl(var(--foreground))]" />
            </button>
          </div>

          <div className="space-y-1 mt-1">
            <div className="flex justify-between items-center">
              <PixelText as="span" size="xs" className="text-[hsl(var(--foreground))]">
                Ataque:
              </PixelText>
              <PixelText as="span" size="xs" className="font-bold text-[hsl(var(--combat-attack))]">
                {attack}
              </PixelText>
            </div>
            <div className="flex justify-between items-center">
              <PixelText as="span" size="xs" className="text-[hsl(var(--foreground))]">
                Defensa:
              </PixelText>
              <PixelText as="span" size="xs" className="font-bold text-[hsl(var(--combat-defense))]">
                {defense}
              </PixelText>
            </div>
            <div className="flex justify-between items-center">
              <PixelText as="span" size="xs" className="text-[hsl(var(--foreground))]">
                Crítico:
              </PixelText>
              <PixelText as="span" size="xs" className="font-bold text-[hsl(var(--happiness-bar))]">
                {critChance}%
              </PixelText>
            </div>
            <div className="flex justify-between items-center">
              <PixelText as="span" size="xs" className="text-[hsl(var(--foreground))]">
                Salud Máx:
              </PixelText>
              <PixelText as="span" size="xs" className="font-bold text-[hsl(var(--health-bar))]">
                {maxHealth}
              </PixelText>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
