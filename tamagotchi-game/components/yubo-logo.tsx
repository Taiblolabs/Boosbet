import { cn } from "@/lib/utils"

interface YuboLogoProps {
  className?: string
}

export function YuboLogo({ className }: YuboLogoProps) {
  return (
    <div className={cn("w-24 h-24 relative mx-auto", className)}>
      <div className="absolute inset-0 bg-amber-400 rounded-full border-4 border-amber-600 shadow-lg"></div>
      <div className="absolute inset-2 bg-amber-300 rounded-full border-2 border-amber-500"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold text-amber-800 font-pixel">YB</div>
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-2 border-green-600 flex items-center justify-center">
        <span className="text-xl">🐾</span>
      </div>
    </div>
  )
}
