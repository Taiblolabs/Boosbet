"use client"

import { motion } from "framer-motion"
import { Shield, Sword, X } from "lucide-react"
import PixelText from "./pixel-text"

type CombatAlertProps = {
  type: "damage" | "blocked" | "critical" | "miss"
  value?: number
  isEnemy?: boolean
}

export default function CombatAlert({ type, value, isEnemy = false }: CombatAlertProps) {
  // Determinar el contenido y estilo según el tipo de alerta
  const getContent = () => {
    switch (type) {
      case "damage":
        return {
          text: `-${value}`,
          bgColor: "bg-red-500/80",
          textColor: "text-white",
          icon: <Sword className="w-3 h-3 mr-1" />,
        }
      case "critical":
        return {
          text: `¡CRÍTICO! -${value}`,
          bgColor: "bg-yellow-500/80",
          textColor: "text-white",
          icon: <Sword className="w-3 h-3 mr-1" />,
        }
      case "blocked":
        return {
          text: "¡BLOQUEADO!",
          bgColor: "bg-blue-500/80",
          textColor: "text-white",
          icon: <Shield className="w-3 h-3 mr-1" />,
        }
      case "miss":
        return {
          text: "¡FALLADO!",
          bgColor: "bg-gray-500/80",
          textColor: "text-white",
          icon: <X className="w-3 h-3 mr-1" />,
        }
      default:
        return {
          text: "",
          bgColor: "bg-gray-500/80",
          textColor: "text-white",
          icon: null,
        }
    }
  }

  const content = getContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: isEnemy ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isEnemy ? -40 : 40 }}
      transition={{ duration: 0.5 }}
      className={`absolute ${isEnemy ? "top-1/4" : "bottom-1/4"} ${
        isEnemy ? "right-1/4" : "left-1/4"
      } z-20 px-2 py-1 rounded-lg ${content.bgColor} shadow-md border border-white/30`}
    >
      <PixelText as="span" size="sm" className={`flex items-center font-bold ${content.textColor}`}>
        {content.icon}
        {content.text}
      </PixelText>
    </motion.div>
  )
}
