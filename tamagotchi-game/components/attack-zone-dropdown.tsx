"use client"

import { useState, useRef, useEffect } from "react"
import { Sword } from "lucide-react"
import type { BodyZone } from "./body-zone-selector"
import PixelButton from "./pixel-button"

type AttackZoneDropdownProps = {
  onSelect: (zone: BodyZone) => void
  disabled?: boolean
}

export default function AttackZoneDropdown({ onSelect, disabled = false }: AttackZoneDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (zone: BodyZone) => {
    onSelect(zone)
    setIsOpen(false)
  }

  // Información sobre las zonas
  const zoneInfo = {
    Head: {
      name: "Cabeza",
      description: "Alto daño, alta probabilidad de crítico",
    },
    Chest: {
      name: "Pecho",
      description: "Daño medio, probabilidad media de crítico",
    },
    Legs: {
      name: "Piernas",
      description: "Bajo daño, baja probabilidad de crítico",
    },
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <PixelButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-center"
        variant="danger"
        icon={<Sword className="w-4 h-4 mr-2" />}
      >
        Atacar
      </PixelButton>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg overflow-hidden z-10 border-4 border-red-300">
          <div className="p-2 bg-red-100 text-center text-sm font-bold text-red-800 border-b-2 border-red-200">
            Selecciona dónde atacar
          </div>

          <div className="p-2">
            {/* Opción de Cabeza */}
            <button
              onClick={() => handleSelect("Head")}
              className="w-full text-left p-2 hover:bg-red-50 rounded-md flex items-center transition-colors mb-1"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-red-600">
                <span className="text-white font-medium">
                  <Sword className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="font-bold">{zoneInfo.Head.name}</div>
                <div className="text-xs text-gray-600">{zoneInfo.Head.description}</div>
              </div>
            </button>

            {/* Opción de Pecho */}
            <button
              onClick={() => handleSelect("Chest")}
              className="w-full text-left p-2 hover:bg-red-50 rounded-md flex items-center transition-colors mb-1"
            >
              <div className="w-10 h-10 rounded-md bg-red-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-red-600">
                <span className="text-white font-medium">
                  <Sword className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="font-bold">{zoneInfo.Chest.name}</div>
                <div className="text-xs text-gray-600">{zoneInfo.Chest.description}</div>
              </div>
            </button>

            {/* Opción de Piernas */}
            <button
              onClick={() => handleSelect("Legs")}
              className="w-full text-left p-2 hover:bg-red-50 rounded-md flex items-center transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-red-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-red-600">
                <span className="text-white font-medium">
                  <Sword className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="font-bold">{zoneInfo.Legs.name}</div>
                <div className="text-xs text-gray-600">{zoneInfo.Legs.description}</div>
              </div>
            </button>
          </div>

          <div className="p-2 bg-red-50 text-xs text-center text-gray-600 border-t-2 border-red-200">
            Diferentes zonas tienen distintas probabilidades de crítico
          </div>
        </div>
      )}
    </div>
  )
}
