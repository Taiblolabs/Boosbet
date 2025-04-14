import type { BodyZone } from "./body-zone-selector"
import { Sword, Shield } from "lucide-react"

type ZoneIndicatorProps = {
  zone: BodyZone
  type: "attack" | "defense"
  isEnemy?: boolean
}

export default function ZoneIndicator({ zone, type, isEnemy = false }: ZoneIndicatorProps) {
  const getPositionClass = () => {
    switch (zone) {
      case "Head":
        return "top-0"
      case "Chest":
        return "top-1/3"
      case "Legs":
        return "bottom-0"
      default:
        return "top-1/2"
    }
  }

  const getColorClass = () => {
    if (type === "attack") {
      return isEnemy ? "bg-red-600" : "bg-blue-600"
    } else {
      return isEnemy ? "bg-yellow-600" : "bg-green-600"
    }
  }

  return (
    <div
      className={`absolute ${getPositionClass()} ${isEnemy ? "right-0" : "left-0"} transform ${isEnemy ? "translate-x-1/2" : "-translate-x-1/2"} -translate-y-1/2 w-8 h-8 rounded-full ${getColorClass()} flex items-center justify-center`}
    >
      {type === "attack" ? <Sword className="w-4 h-4 text-white" /> : <Shield className="w-4 h-4 text-white" />}
    </div>
  )
}
