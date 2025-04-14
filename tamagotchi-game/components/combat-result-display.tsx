import { Sword, Shield, Check, X } from "lucide-react"
import type { BodyZone } from "./body-zone-selector"

type CombatResultDisplayProps = {
  playerAttackZone: BodyZone | null
  playerDefenseZone: BodyZone | null
  enemyAttackZone: BodyZone | null
  enemyDefenseZone: BodyZone | null
  damageDealt: number
  damageTaken: number
  attackBlocked: boolean
  defenseSuccessful: boolean
}

export default function CombatResultDisplay({
  playerAttackZone,
  playerDefenseZone,
  enemyAttackZone,
  enemyDefenseZone,
  damageDealt,
  damageTaken,
  attackBlocked,
  defenseSuccessful,
}: CombatResultDisplayProps) {
  return (
    <div className="mt-4 bg-amber-100 p-3 rounded-xl mb-4 border-4 border-amber-300 shadow-md">
      <h4 className="font-bold text-amber-800 mb-2 text-center text-lg">Resultado del turno</h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Player attack result */}
        <div className="bg-white p-2 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center text-sm font-bold">
              <Sword className="w-4 h-4 text-red-500 mr-1" /> Tu ataque
            </span>
            {attackBlocked ? (
              <span className="flex items-center text-sm text-red-500 font-bold">
                <X className="w-4 h-4 mr-1" /> Bloqueado
              </span>
            ) : (
              <span className="flex items-center text-sm text-green-500 font-bold">
                <Check className="w-4 h-4 mr-1" /> Éxito
              </span>
            )}
          </div>

          <div className="text-xs">
            <p className="font-medium">
              Zona: <span className="font-bold">{playerAttackZone}</span>
            </p>
            {!attackBlocked && (
              <p className="font-medium">
                Daño: <span className="font-bold text-red-500">{damageDealt}</span>
              </p>
            )}
          </div>
        </div>

        {/* Player defense result */}
        <div className="bg-white p-2 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center text-sm font-bold">
              <Shield className="w-4 h-4 text-blue-500 mr-1" /> Tu defensa
            </span>
            {defenseSuccessful ? (
              <span className="flex items-center text-sm text-green-500 font-bold">
                <Check className="w-4 h-4 mr-1" /> Éxito
              </span>
            ) : (
              <span className="flex items-center text-sm text-red-500 font-bold">
                <X className="w-4 h-4 mr-1" /> Fallida
              </span>
            )}
          </div>

          <div className="text-xs">
            <p className="font-medium">
              Zona: <span className="font-bold">{playerDefenseZone}</span>
            </p>
            {!defenseSuccessful && (
              <p className="font-medium">
                Daño recibido: <span className="font-bold text-red-500">{damageTaken}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
        <p>
          Ataque enemigo: <span className="font-bold">{enemyAttackZone}</span>
        </p>
        <p>
          Defensa enemiga: <span className="font-bold">{enemyDefenseZone}</span>
        </p>
      </div>
    </div>
  )
}
