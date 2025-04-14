import type React from "react"
import { Info } from "lucide-react"

type CombatTooltipProps = {
  title: string
  children: React.ReactNode
}

export default function CombatTooltip({ title, children }: CombatTooltipProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start">
        <div className="bg-amber-100 rounded-full p-1.5 mr-3 flex-shrink-0">
          <Info className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-800">{title}</h4>
          <div className="text-sm text-amber-700 mt-2">{children}</div>
        </div>
      </div>
    </div>
  )
}
