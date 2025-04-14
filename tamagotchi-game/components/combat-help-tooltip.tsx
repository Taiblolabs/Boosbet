"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CombatHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Botón de ayuda */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="w-8 h-8 rounded-full bg-yellow-200 hover:bg-yellow-300 p-0 absolute top-0 right-0 border-2 border-yellow-400"
        aria-label="Ayuda sobre el sistema de combate"
      >
        <Info className="w-4 h-4 text-amber-700" />
      </Button>

      {/* Tooltip desplegable */}
      {isOpen && (
        <div className="absolute top-10 right-0 z-50 w-72 md:w-80 bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-300 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-amber-800 flex items-center">
              <Info className="w-4 h-4 text-amber-600 mr-2" />
              Sistema de Combate por Zonas
            </h4>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 rounded-full hover:bg-amber-200"
            >
              <X className="w-4 h-4 text-amber-700" />
            </Button>
          </div>

          <div className="text-sm text-amber-700 font-medium">
            <p>En cada turno, selecciona una zona para atacar y otra para defender:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>
                <strong>Cabeza:</strong> Alto daño, alta probabilidad de crítico
              </li>
              <li>
                <strong>Pecho:</strong> Daño medio, probabilidad media de crítico
              </li>
              <li>
                <strong>Piernas:</strong> Bajo daño, baja probabilidad de crítico
              </li>
            </ul>
            <p className="mt-2">
              Si atacas una zona que el enemigo está defendiendo, tu ataque será bloqueado. Lo mismo aplica para tu
              defensa.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
