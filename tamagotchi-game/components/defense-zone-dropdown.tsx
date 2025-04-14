"use client"

import { useState, useRef, useEffect } from "react"
import { Shield } from "lucide-react"
import type { BodyZone } from "./body-zone-selector"
import PixelButton from "./pixel-button"

type DefenseZoneDropdownProps = {
  onSelect: (zone: BodyZone) => void
  disabled?: boolean
  isEnemyAttacking?: boolean
}

export default function DefenseZoneDropdown({
  onSelect,
  disabled = false,
  isEnemyAttacking = false,
}: DefenseZoneDropdownProps) {
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
      description: "Protege contra ataques a la cabeza",
    },
    Chest: {
      name: "Pecho",
      description: "Protege contra ataques al pecho",
    },
    Legs: {
      name: "Piernas",
      description: "Protege contra ataques a las piernas",
    },
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <PixelButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-center"
        variant="primary"
        icon={<Shield className="w-4 h-4 mr-2" />}
      >
        Defender
      </PixelButton>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg overflow-hidden z-10 border-4 border-blue-300">
          <div className="p-2 bg-blue-100 text-center text-sm font-bold text-blue-800 border-b-2 border-blue-200">
            Selecciona dónde defender
          </div>

          <div className="p-2">
            {/* Opción de Cabeza */}
            <button
              onClick={() => handleSelect("Head")}
              className="w-full text-left p-2 hover:bg-blue-50 rounded-md flex items-center transition-colors mb-1"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-blue-600">
                <span className="text-white font-medium">
                  <Shield className="w-4 h-4" />
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
              className="w-full text-left p-2 hover:bg-blue-50 rounded-md flex items-center transition-colors mb-1"
            >
              <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-blue-600">
                <span className="text-white font-medium">
                  <Shield className="w-4 h-4" />
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
              className="w-full text-left p-2 hover:bg-blue-50 rounded-md flex items-center transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-blue-600">
                <span className="text-white font-medium">
                  <Shield className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="font-bold">{zoneInfo.Legs.name}</div>
                <div className="text-xs text-gray-600">{zoneInfo.Legs.description}</div>
              </div>
            </button>
          </div>

          <div className="p-2 bg-blue-50 text-xs text-center text-gray-600 border-t-2 border-blue-200">
            Bloquea el ataque enemigo en la zona correcta
          </div>
        </div>
      )}
    </div>
  )
}
