"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Clock, Sword, Heart, Skull } from "lucide-react"
import Image from "next/image"
import type { PetStats } from "./tamagotchi-game"
import { AnimatePresence } from "framer-motion"

// Add this import at the top
import type { BodyZone } from "./body-zone-selector"
// Add this import at the top
import CombatResultDisplay from "./combat-result-display"
// Importar el nuevo componente de botón pixelado
import PixelButton from "./pixel-button"
// Importar el nuevo componente de alerta de combate
import CombatAlert from "./combat-alert"

// Add these new types at the top of the file, after the existing imports
type ZoneDamage = {
  zone: BodyZone
  baseDamage: number
  critMultiplier: number
  description: string
}

type Enemy = {
  name: string
  emoji: string
  health: number
  maxHealth: number
  strength: number
  defense: number
  element: "fire" | "water" | "earth" | null
  level: number
}

type CombatSystemProps = {
  pet: PetStats
  onCombatEnd: (won: boolean, remainingHealth: number, experienceGained?: number, strengthGained?: number) => void
}

export default function CombatSystem({ pet, onCombatEnd }: CombatSystemProps) {
  // Estado para el enemigo
  const [enemy, setEnemy] = useState<Enemy | null>(null)
  const [petHealth, setPetHealth] = useState(pet.health)
  const [enemyHealth, setEnemyHealth] = useState(0)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [turn, setTurn] = useState<"pet" | "enemy">("pet")
  const [isAttacking, setIsAttacking] = useState(false)
  const [isDefending, setIsDefending] = useState(false)
  const [combatEnded, setCombatEnded] = useState(false)
  const [experienceGained, setExperienceGained] = useState(0)
  const [strengthGained, setStrengthGained] = useState(0)

  // Añadir contador de turnos
  const [turnCount, setTurnCount] = useState(1)

  // Update these state variables for tracking combat results
  const [lastDamageDealt, setLastDamageDealt] = useState(0)
  const [lastDamageTaken, setLastDamageTaken] = useState(0)
  const [showCombatResult, setShowCombatResult] = useState(false)
  const [attackBlocked, setAttackBlocked] = useState(false)
  const [defenseSuccessful, setDefenseSuccessful] = useState(false)

  // Update the component state to include attack and defense zones
  const [selectedAttackZone, setSelectedAttackZone] = useState<BodyZone | null>(null)
  const [selectedDefenseZone, setSelectedDefenseZone] = useState<BodyZone | null>(null)
  const [enemyAttackZone, setEnemyAttackZone] = useState<BodyZone | null>(null)
  const [enemyDefenseZone, setEnemyDefenseZone] = useState<BodyZone | null>(null)
  const [showZoneSelection, setShowZoneSelection] = useState<"attack" | "defense" | null>(null)

  // Nuevo estado para mostrar la alerta de ataque enemigo
  const [showEnemyAttackAlert, setShowEnemyAttackAlert] = useState(false)
  const [pendingEnemyAttack, setPendingEnemyAttack] = useState<BodyZone | null>(null)

  // Referencia para el temporizador de ataque enemigo
  const enemyAttackTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Estado para controlar si el jugador está eligiendo defensa
  const [isChoosingDefense, setIsChoosingDefense] = useState(false)

  // Estado para controlar si estamos procesando una acción
  const [isProcessingAction, setIsProcessingAction] = useState(false)

  // Nuevo estado para las alertas de combate
  const [combatAlert, setCombatAlert] = useState<{
    type: "damage" | "blocked" | "critical" | "miss"
    value?: number
    isEnemy: boolean
    visible: boolean
  } | null>(null)

  // Add this constant for zone damage values
  const ZONE_DAMAGES: Record<BodyZone, ZoneDamage> = {
    Head: {
      zone: "Head",
      baseDamage: 20,
      critMultiplier: 2.0,
      description: "Alto daño, alta probabilidad de crítico",
    },
    Chest: {
      zone: "Chest",
      baseDamage: 15,
      critMultiplier: 1.5,
      description: "Daño medio, probabilidad media de crítico",
    },
    Legs: {
      zone: "Legs",
      baseDamage: 10,
      critMultiplier: 1.2,
      description: "Bajo daño, baja probabilidad de crítico",
    },
  }

  // Añadir estos nuevos estados para el temporizador
  const [turnTimer, setTurnTimer] = useState<number>(5)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Función para mostrar una alerta de combate
  const showCombatAlert = (type: "damage" | "blocked" | "critical" | "miss", value?: number, isEnemy = false) => {
    setCombatAlert({ type, value, isEnemy, visible: true })

    // Ocultar la alerta después de 1.5 segundos
    setTimeout(() => {
      setCombatAlert(null)
    }, 1500)
  }

  // Función para determinar una zona aleatoria
  const getRandomZone = (): BodyZone => {
    const zones: BodyZone[] = ["Head", "Chest", "Legs"]
    return zones[Math.floor(Math.random() * zones.length)]
  }

  // Añadir esta función para iniciar el temporizador
  const startTurnTimer = () => {
    setTurnTimer(5)
    setTimerActive(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          // Tiempo agotado, perder el turno
          clearInterval(timerRef.current!)
          setTimerActive(false)

          if ((turn === "pet" || showEnemyAttackAlert) && !isProcessingAction) {
            addToCombatLog("¡Tiempo agotado! Pierdes tu turno.")
            if (turn === "pet") {
              changeTurn("enemy")
            } else if (showEnemyAttackAlert) {
              // Si es tiempo de defensa y se agota, el enemigo ataca automáticamente
              setShowEnemyAttackAlert(false)
              enemyAttack(selectedDefenseZone)
            }
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Función para cambiar el turno y actualizar el contador
  const changeTurn = (newTurn: "pet" | "enemy") => {
    setTurn(newTurn)
    if (newTurn === "pet") {
      setTurnCount((prev) => prev + 1)
      startTurnTimer() // Iniciar temporizador cuando es turno del jugador
    } else {
      // Detener el temporizador cuando es turno del enemigo
      if (timerRef.current) {
        clearInterval(timerRef.current)
        setTimerActive(false)
      }
    }
  }

  // Generar un enemigo aleatorio
  useEffect(() => {
    const generateEnemy = () => {
      const enemyTypes = [
        { name: "Slime", emoji: "🟢" },
        { name: "Murciélago", emoji: "🦇" },
        { name: "Araña", emoji: "🕷️" },
        { name: "Fantasma", emoji: "👻" },
        { name: "Esqueleto", emoji: "💀" },
        { name: "Dragón", emoji: "🐉" },
      ]

      const elements: Array<"fire" | "water" | "earth" | null> = ["fire", "water", "earth", null]
      const randomElement = elements[Math.floor(Math.random() * elements.length)]

      // Ajustar el nivel del enemigo basado en el nivel de la mascota
      const enemyLevel = Math.max(1, pet.level + Math.floor(Math.random() * 3) - 1)

      // Seleccionar un tipo de enemigo aleatorio
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]

      // Calcular estadísticas basadas en el nivel
      const baseHealth = 50 + enemyLevel * 10
      const baseStrength = 5 + enemyLevel * 2
      const baseDefense = 3 + enemyLevel

      const newEnemy: Enemy = {
        name: enemyType.name,
        emoji: enemyType.emoji,
        health: baseHealth,
        maxHealth: baseHealth,
        strength: baseStrength,
        defense: baseDefense,
        element: randomElement,
        level: enemyLevel,
      }

      setEnemy(newEnemy)
      setEnemyHealth(baseHealth)
      addToCombatLog(`¡Un ${newEnemy.name} ${newEnemy.emoji} nivel ${newEnemy.level} aparece!`)

      // Mostrar información sobre ventajas elementales
      if (pet.element && newEnemy.element) {
        const advantage = getElementalAdvantage(pet.element, newEnemy.element)
        if (advantage > 1) {
          addToCombatLog(
            `¡Tu elemento ${getElementName(pet.element)} tiene ventaja contra ${getElementName(newEnemy.element)}!`,
          )
        } else if (advantage < 1) {
          addToCombatLog(
            `¡Cuidado! Tu elemento ${getElementName(pet.element)} es débil contra ${getElementName(newEnemy.element)}.`,
          )
        }
      }

      // Establecer la zona de defensa inicial del enemigo
      setEnemyDefenseZone(getRandomZone())
    }

    generateEnemy()
  }, [pet.level, pet.element])

  // Efecto para establecer la zona de ataque del enemigo al inicio de su turno
  useEffect(() => {
    if (turn === "enemy" && !combatEnded && !isAttacking && !isDefending && !isProcessingAction) {
      // Establecer la zona de ataque del enemigo al inicio de su turno
      const attackZone = getRandomZone()
      setEnemyAttackZone(attackZone)

      // Solo mostrar la alerta si no estamos en medio de una acción
      if (!isAttacking && !isDefending) {
        setPendingEnemyAttack(attackZone)
        setShowEnemyAttackAlert(true)

        // Limpiar cualquier temporizador existente
        if (enemyAttackTimerRef.current) {
          clearTimeout(enemyAttackTimerRef.current)
        }

        // Iniciar temporizador para la defensa
        startTurnTimer()

        // Si después de 5 segundos no hay respuesta, el enemigo ataca automáticamente
        enemyAttackTimerRef.current = setTimeout(() => {
          if (turn === "enemy" && !combatEnded && !isChoosingDefense) {
            setShowEnemyAttackAlert(false)
            setTimerActive(false)
            enemyAttack(selectedDefenseZone)
          }
        }, 5000)
      }
    }

    // Limpiar el temporizador cuando el componente se desmonte o cambie el turno
    return () => {
      if (enemyAttackTimerRef.current) {
        clearTimeout(enemyAttackTimerRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [turn, combatEnded, isAttacking, isDefending, isProcessingAction])

  // Efecto para establecer la zona de defensa del enemigo al inicio del turno del jugador
  useEffect(() => {
    if (turn === "pet" && !combatEnded) {
      // Establecer la zona de defensa del enemigo al inicio del turno del jugador
      setEnemyDefenseZone(getRandomZone())
    }
  }, [turn, combatEnded])

  const addToCombatLog = (message: string) => {
    setCombatLog((prev) => [...prev, message])
  }

  // Obtener el nombre del elemento
  const getElementName = (element: "fire" | "water" | "earth" | null) => {
    switch (element) {
      case "fire":
        return "Fuego 🔥"
      case "water":
        return "Agua 💧"
      case "earth":
        return "Tierra 🌱"
      default:
        return "Normal"
    }
  }

  // Calcular ventaja elemental
  const getElementalAdvantage = (
    attackerElement: "fire" | "water" | "earth" | null,
    defenderElement: "fire" | "water" | "earth" | null,
  ) => {
    if (!attackerElement || !defenderElement) return 1

    // Fuego > Tierra > Agua > Fuego
    if (attackerElement === "fire" && defenderElement === "earth") return 1.5
    if (attackerElement === "earth" && defenderElement === "water") return 1.5
    if (attackerElement === "water" && defenderElement === "fire") return 1.5

    // Desventajas
    if (attackerElement === "fire" && defenderElement === "water") return 0.75
    if (attackerElement === "earth" && defenderElement === "fire") return 0.75
    if (attackerElement === "water" && defenderElement === "earth") return 0.75

    return 1
  }

  // Acciones de combate
  const attack = () => {
    if (isAttacking || isDefending || !enemy || combatEnded || isProcessingAction) return

    // Show zone selection instead of attacking immediately
    setShowZoneSelection("attack")
  }

  const defend = () => {
    if (isAttacking || isDefending || !enemy || combatEnded || isProcessingAction) return

    // Show zone selection instead of defending immediately
    setShowZoneSelection("defense")
  }

  // Función para manejar la defensa contra el ataque enemigo
  const defendAgainstEnemyAttack = () => {
    if (!pendingEnemyAttack || !enemy || combatEnded || isProcessingAction) return

    // Indicar que el jugador está eligiendo defensa para evitar el ataque automático
    setIsChoosingDefense(true)

    // Limpiar el temporizador de ataque automático
    if (enemyAttackTimerRef.current) {
      clearTimeout(enemyAttackTimerRef.current)
      enemyAttackTimerRef.current = null
    }

    // Iniciar temporizador para la defensa
    startTurnTimer()

    // No ocultamos la alerta aquí, se ocultará después de seleccionar la zona
    addToCombatLog("Elige dónde defenderte del ataque enemigo...")
  }

  // Add this new function to handle zone selection
  const handleZoneSelect = (zone: BodyZone) => {
    if (showZoneSelection === "attack") {
      setSelectedAttackZone(zone)
      executeAttack(zone)
    } else if (showZoneSelection === "defense") {
      setSelectedDefenseZone(zone)

      if (turn === "pet") {
        // Si estamos en el turno del jugador, es una defensa preventiva
        executeDefend(zone)
      } else if (turn === "enemy") {
        // Si estamos en el turno del enemigo, es una defensa reactiva
        executeDefendAgainstEnemyAttack(zone)
      }
    }

    setShowZoneSelection(null)
  }

  // Add this function to execute attack after zone selection
  const executeAttack = (attackZone: BodyZone) => {
    if (!enemy || combatEnded || isProcessingAction) return

    // Detener el temporizador durante el procesamiento de la acción
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimerActive(false)
    }

    setIsProcessingAction(true)
    setIsAttacking(true)
    addToCombatLog(`¡Atacas al ${attackZone} del enemigo!`)

    // Check if attack was blocked - enemyDefenseZone is already set at the beginning of the player's turn
    const isBlocked = attackZone === enemyDefenseZone
    setAttackBlocked(isBlocked)

    if (isBlocked) {
      setLastDamageDealt(0)
      addToCombatLog(`¡El enemigo bloqueó tu ataque en ${attackZone}!`)

      // Mostrar alerta de ataque bloqueado
      showCombatAlert("blocked", undefined, true)

      setTimeout(() => {
        setIsAttacking(false)
        // Turno del enemigo
        changeTurn("enemy")
        setIsProcessingAction(false)
      }, 1000)
      return
    }

    // Calculate damage with zone-based values
    const zoneDamage = ZONE_DAMAGES[attackZone]
    const elementalMultiplier = getElementalAdvantage(pet.element, enemy.element)

    // Calculate base damage
    let damage = Math.max(1, zoneDamage.baseDamage + pet.strength - enemy.defense / 2)

    // Apply elemental multiplier
    damage = Math.round(damage * elementalMultiplier)

    // Probability of critical hit depends on the zone
    const critChance = attackZone === "Head" ? 0.2 : attackZone === "Chest" ? 0.1 : 0.05
    const isCritical = Math.random() < critChance

    if (isCritical) {
      damage = Math.round(damage * zoneDamage.critMultiplier)
      addToCombatLog(`¡Golpe crítico en ${attackZone}!`)

      // Mostrar alerta de golpe crítico
      showCombatAlert("critical", damage, true)
    } else {
      // Mostrar alerta de daño normal
      showCombatAlert("damage", damage, true)
    }

    setLastDamageDealt(damage)

    // Apply damage
    setTimeout(() => {
      const newEnemyHealth = Math.max(0, enemyHealth - damage)
      setEnemyHealth(newEnemyHealth)
      addToCombatLog(`Has causado ${damage} puntos de daño.`)

      // Comprobar si el enemigo ha sido derrotado
      if (newEnemyHealth <= 0) {
        endCombat(true)
        setIsProcessingAction(false)
      } else {
        // Turno del enemigo
        changeTurn("enemy")
        setIsAttacking(false)
        setIsProcessingAction(false)
      }
    }, 1000)
  }

  // Add this function to execute defend after zone selection
  const executeDefend = (defenseZone: BodyZone) => {
    if (!enemy || combatEnded || isProcessingAction) return

    // Detener el temporizador durante el procesamiento de la acción
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimerActive(false)
    }

    setIsProcessingAction(true)
    setIsDefending(true)
    setSelectedDefenseZone(defenseZone)
    addToCombatLog(`¡Te preparas para defender tu ${defenseZone}!`)

    // Turno del enemigo con posible reducción de daño
    setTimeout(() => {
      changeTurn("enemy")
      setIsDefending(false)
      setIsProcessingAction(false)
    }, 1000)
  }

  // Nueva función para ejecutar la defensa contra un ataque enemigo específico
  const executeDefendAgainstEnemyAttack = (defenseZone: BodyZone) => {
    if (!enemy || combatEnded || !pendingEnemyAttack || isProcessingAction) return

    setIsProcessingAction(true)
    setIsDefending(true)
    setSelectedDefenseZone(defenseZone)
    setIsChoosingDefense(false)
    setShowEnemyAttackAlert(false)

    addToCombatLog(`¡Intentas bloquear el ataque en tu ${defenseZone}!`)

    // Comprobar si la defensa fue exitosa
    const isBlocked = defenseZone === pendingEnemyAttack
    setDefenseSuccessful(isBlocked)

    if (isBlocked) {
      setLastDamageTaken(0)
      addToCombatLog(`¡Has bloqueado el ataque! El enemigo intentó atacar tu ${pendingEnemyAttack}.`)

      // Mostrar alerta de ataque bloqueado
      showCombatAlert("blocked", undefined, false)

      // Mostrar resultado del combate
      setShowCombatResult(true)

      setTimeout(() => {
        // Ocultar resultado del combate
        setShowCombatResult(false)

        // Resetear para el siguiente turno
        setEnemyAttackZone(null)
        setPendingEnemyAttack(null)
        setSelectedAttackZone(null)
        setSelectedDefenseZone(null)

        // Volver al turno del jugador
        changeTurn("pet")
        setIsDefending(false)
        setIsProcessingAction(false)
      }, 2000)
      return
    }

    // Si no se bloqueó, calcular y aplicar el daño
    const zoneDamage = ZONE_DAMAGES[pendingEnemyAttack]
    const elementalMultiplier = getElementalAdvantage(enemy.element, pet.element)

    // Calcular daño base
    let damage = Math.max(1, zoneDamage.baseDamage + enemy.strength - pet.strength / 4)

    // Aplicar multiplicador elemental
    damage = Math.round(damage * elementalMultiplier)

    // Probabilidad de golpe crítico según la zona
    const critChance = pendingEnemyAttack === "Head" ? 0.15 : pendingEnemyAttack === "Chest" ? 0.08 : 0.03
    const isCritical = Math.random() < critChance

    if (isCritical) {
      damage = Math.round(damage * zoneDamage.critMultiplier)
      addToCombatLog(`¡El enemigo hace un golpe crítico en tu ${pendingEnemyAttack}!`)

      // Mostrar alerta de golpe crítico
      showCombatAlert("critical", damage, false)
    } else {
      // Mostrar alerta de daño normal
      showCombatAlert("damage", damage, false)
    }

    setLastDamageTaken(damage)

    // Aplicar daño
    setTimeout(() => {
      const newPetHealth = Math.max(0, petHealth - damage)
      setPetHealth(newPetHealth)
      addToCombatLog(`Has recibido ${damage} puntos de daño.`)

      // Mostrar resultado del combate
      setShowCombatResult(true)

      setTimeout(() => {
        // Ocultar resultado del combate
        setShowCombatResult(false)

        // Resetear zonas para el siguiente turno
        setEnemyAttackZone(null)
        setPendingEnemyAttack(null)
        setSelectedAttackZone(null)
        setSelectedDefenseZone(null)

        // Comprobar si la mascota ha sido derrotada
        if (newPetHealth <= 0) {
          endCombat(false)
        } else {
          // Volver al turno del jugador
          changeTurn("pet")
        }

        setIsDefending(false)
        setIsProcessingAction(false)
      }, 2000)
    }, 1000)
  }

  // Update the enemyAttack function to handle zone targeting
  const enemyAttack = (playerDefenseZone?: BodyZone) => {
    if (!enemy || combatEnded || isProcessingAction) return

    setIsProcessingAction(true)

    // Si no hay zona de ataque establecida, seleccionar una aleatoria
    if (!enemyAttackZone) {
      const attackZone = getRandomZone()
      setEnemyAttackZone(attackZone)
      addToCombatLog(`¡${enemy.name} prepara un ataque!`)
    } else {
      addToCombatLog(`¡${enemy.name} prepara un ataque!`)
    }

    // Check if attack was blocked
    const isBlocked = enemyAttackZone === playerDefenseZone
    setDefenseSuccessful(isBlocked)

    if (isBlocked) {
      setLastDamageTaken(0)
      addToCombatLog(`¡Has bloqueado el ataque! El enemigo intentó atacar tu ${enemyAttackZone}.`)

      // Mostrar alerta de ataque bloqueado
      showCombatAlert("blocked", undefined, false)

      // Show combat result
      setShowCombatResult(true)

      setTimeout(() => {
        // Hide combat result
        setShowCombatResult(false)

        // Reset for next turn
        setEnemyAttackZone(null)
        // No reseteamos enemyDefenseZone aquí, se actualizará en el efecto al inicio del turno del jugador
        setSelectedAttackZone(null)
        setSelectedDefenseZone(null)
        // Volver al turno del jugador
        changeTurn("pet")
        setIsProcessingAction(false)
      }, 2000)
      return
    }

    // Calculate damage with zone-based values
    const zoneDamage = ZONE_DAMAGES[enemyAttackZone || "Chest"] // Fallback to Chest if somehow undefined
    const elementalMultiplier = getElementalAdvantage(enemy.element, pet.element)

    // Calculate base damage
    let damage = Math.max(1, zoneDamage.baseDamage + enemy.strength - pet.strength / 4)

    // Apply elemental multiplier
    damage = Math.round(damage * elementalMultiplier)

    // Probability of critical hit depends on the zone
    const critChance = enemyAttackZone === "Head" ? 0.15 : enemyAttackZone === "Chest" ? 0.08 : 0.03
    const isCritical = Math.random() < critChance

    if (isCritical) {
      damage = Math.round(damage * zoneDamage.critMultiplier)
      addToCombatLog(`¡El enemigo hace un golpe crítico en tu ${enemyAttackZone}!`)

      // Mostrar alerta de golpe crítico
      showCombatAlert("critical", damage, false)
    } else {
      // Mostrar alerta de daño normal
      showCombatAlert("damage", damage, false)
    }

    setLastDamageTaken(damage)

    // Apply damage
    setTimeout(() => {
      const newPetHealth = Math.max(0, petHealth - damage)
      setPetHealth(newPetHealth)
      addToCombatLog(`Has recibido ${damage} puntos de daño.`)
      addToCombatLog(`El ataque fue dirigido a tu ${enemyAttackZone}.`)

      // Show combat result
      setShowCombatResult(true)

      setTimeout(() => {
        // Hide combat result
        setShowCombatResult(false)

        // Reset zones for next turn
        setEnemyAttackZone(null)
        // No reseteamos enemyDefenseZone aquí, se actualizará en el efecto al inicio del jugador
        setSelectedAttackZone(null)
        setSelectedDefenseZone(null)

        // Comprobar si la mascota ha sido derrotada
        if (newPetHealth <= 0) {
          endCombat(false)
        } else {
          // Volver al turno del jugador
          changeTurn("pet")
        }

        setIsProcessingAction(false)
      }, 2000)
    }, 1000)
  }

  // Update the finishCombat function to reset zone states
  const finishCombat = () => {
    // Limpiar el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimerActive(false)
    }

    setSelectedAttackZone(null)
    setSelectedDefenseZone(null)
    setEnemyAttackZone(null)
    setEnemyDefenseZone(null)
    setShowZoneSelection(null)
    setShowCombatResult(false)
    setLastDamageDealt(0)
    setLastDamageTaken(0)
    setAttackBlocked(false)
    setDefenseSuccessful(false)
    setPendingEnemyAttack(null)
    setShowEnemyAttackAlert(false)
    setIsChoosingDefense(false)
    setIsProcessingAction(false)
    setCombatAlert(null)

    // Limpiar cualquier temporizador pendiente
    if (enemyAttackTimerRef.current) {
      clearTimeout(enemyAttackTimerRef.current)
      enemyAttackTimerRef.current = null
    }

    onCombatEnd(combatEnded && enemyHealth <= 0, petHealth, experienceGained, strengthGained)
  }

  const endCombat = (won: boolean) => {
    setCombatEnded(true)

    if (won && enemy) {
      // Calcular experiencia y fuerza ganada basada en el nivel del enemigo
      const baseExperience = enemy.level * 20
      const expGained = Math.round(baseExperience * (1 + Math.random() * 0.2))
      setExperienceGained(expGained)

      // Pequeña probabilidad de ganar fuerza directamente
      const strGained = Math.random() < 0.3 ? 1 : 0
      setStrengthGained(strGained)

      addToCombatLog(`¡Has derrotado al ${enemy.name}!`)
      addToCombatLog(`Ganaste ${expGained} puntos de experiencia.`)
      if (strGained > 0) {
        addToCombatLog(`¡Tu fuerza aumentó en ${strGained} puntos!`)
      }
    } else {
      addToCombatLog("Has sido derrotado...")
    }
  }

  // Colores para los elementos
  const getElementColor = (element: "fire" | "water" | "earth" | null) => {
    switch (element) {
      case "fire":
        return "text-red-500"
      case "water":
        return "text-blue-500"
      case "earth":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  // Obtener la imagen del YUBO
  const getYuboImage = () => {
    if (pet.petType === "yubo-green") return "/images/yubo-green.png"
    if (pet.petType === "yubo-pink") return "/images/yubo-pink.png"
    return "/images/yubo-blue.png"
  }

  // Iniciar el temporizador al comenzar el combate
  useEffect(() => {
    if (turn === "pet" && !combatEnded) {
      startTurnTimer()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, []) // Solo se ejecuta al montar el componente

  return (
    <div className="w-full max-w-md">
      {/* Rectángulo exterior (marco de la pantalla) */}
      <div className="w-full rounded-xl border-4 border-blue-600 bg-blue-500 p-2 shadow-lg">
        {/* Pantalla interior con el fondo de batalla */}
        <div className="bg-blue-100 rounded-lg border-2 border-blue-300 shadow-inner overflow-hidden relative p-4">
          {/* Fondo de batalla pixelado */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/battle-background.png"
              alt="Escenario de batalla"
              fill
              className="object-cover pixel-art opacity-50"
            />
          </div>

          {/* Contenido del combate */}
          <div className="relative z-10">
            {/* Encabezado con título y turno */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-600">¡Combate!</h2>
              <div className="bg-yellow-300 text-amber-800 px-3 py-1 rounded-full text-sm font-bold flex items-center border-2 border-yellow-400 shadow">
                <Clock className="w-4 h-4 mr-1" />
                Turno {turnCount}
              </div>
            </div>

            {/* Temporizador fijo en blanco y negro */}
            {timerActive && (turn === "pet" || showEnemyAttackAlert) && !isProcessingAction && !combatEnded && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-lg bg-gray-800">
                    {turnTimer}
                  </div>
                </div>
              </div>
            )}

            {/* Notificación de acción */}
            {timerActive && (turn === "pet" || showEnemyAttackAlert) && !isProcessingAction && !combatEnded && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 px-3 py-1 rounded-lg text-white text-sm font-bold">
                {turn === "pet" ? "¡Ataca!" : "¡Defiéndete!"}
              </div>
            )}

            {/* Sección de personajes y VS */}
            <div className="flex justify-between items-center mb-8 relative">
              {/* YUBO */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto relative mb-1">
                  <Image src={getYuboImage() || "/placeholder.svg"} alt="YUBO" width={64} height={64} />
                </div>
                <p className="font-bold text-gray-800">YUBO</p>
                <p className="text-xs text-gray-600">
                  Nivel {pet.level}{" "}
                  <span className={getElementColor(pet.element)}>
                    {pet.element === "fire"
                      ? "🔥"
                      : pet.element === "water"
                        ? "💧"
                        : pet.element === "earth"
                          ? "🌱"
                          : ""}
                  </span>
                </p>
              </div>

              {/* VS centrado */}
              <div className="bg-yellow-300 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
                <span className="text-xl font-bold text-amber-800">VS</span>
              </div>

              {/* Enemigo */}
              {enemy && (
                <div className="text-center">
                  <div className="text-4xl mb-1">{enemy.emoji}</div>
                  <p className="font-bold text-gray-800">{enemy.name}</p>
                  <p className="text-xs text-gray-600">
                    Nivel {enemy.level}{" "}
                    <span className={getElementColor(enemy.element)}>
                      {enemy.element === "fire"
                        ? "🔥"
                        : enemy.element === "water"
                          ? "💧"
                          : enemy.element === "earth"
                            ? "🌱"
                            : ""}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Notificación de bloqueo */}
            {attackBlocked && (
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">¡BLOQUEADO!</div>
              </div>
            )}

            {/* Área para mostrar alertas de combate */}
            <div className="relative h-0">
              <AnimatePresence>
                {combatAlert && combatAlert.visible && (
                  <CombatAlert type={combatAlert.type} value={combatAlert.value} isEnemy={combatAlert.isEnemy} />
                )}
              </AnimatePresence>
            </div>

            {/* Barra de salud del enemigo */}
            {enemy && (
              <div className="absolute top-32 right-4 w-full max-w-[200px]">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <Skull className="w-4 h-4 mr-1 text-red-600" />
                    <span className="font-bold text-red-600 text-sm">{enemy.name}</span>
                  </div>
                  <span className="font-bold text-gray-700 text-sm">
                    {Math.round(enemyHealth)}/{enemy.maxHealth}
                  </span>
                </div>
                <div className="h-4 bg-white rounded-full overflow-hidden border border-gray-300 shadow-inner">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(enemyHealth / enemy.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Barra de salud del jugador */}
            <div className="absolute bottom-32 left-4 w-full max-w-[200px]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-green-600 fill-green-400" />
                  <span className="font-bold text-green-600 text-sm">YUBO</span>
                </div>
                <span className="font-bold text-gray-700 text-sm">
                  {Math.round(petHealth)}/{pet.maxHealth}
                </span>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden border border-gray-300 shadow-inner">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(petHealth / pet.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Alerta de ataque enemigo */}
            {showEnemyAttackAlert && pendingEnemyAttack && (
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg shadow-lg border border-red-300 text-center">
                <div className="flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white mr-2" />
                  <p className="text-sm font-bold text-white">¡ATAQUE ENEMIGO!</p>
                </div>
                <p className="text-xs text-white mt-1">Elige dónde defenderte</p>
              </div>
            )}

            {/* Acciones de combate */}
            {!combatEnded ? (
              <div className="mt-4">
                {/* Título de sección */}
                <div className="bg-amber-800 text-white font-bold py-1 px-3 rounded-t-lg text-center text-sm border-2 border-amber-900">
                  ACCIONES DE COMBATE
                </div>

                {/* Contenedor principal con fondo */}
                <div className="bg-amber-100 p-3 rounded-b-lg border-2 border-t-0 border-amber-900 shadow-inner">
                  {/* Sección de ataques */}
                  <div className="mb-2">
                    <div className="bg-red-300 rounded-lg p-2 border-2 border-red-500">
                      <h4 className="text-center text-white font-bold text-xs mb-1 flex items-center justify-center bg-red-600 rounded-md py-1 shadow-inner">
                        <Sword className="w-3 h-3 mr-1" /> ATAQUES <Sword className="w-3 h-3 ml-1" />
                      </h4>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            if (
                              turn === "pet" &&
                              !isAttacking &&
                              !isDefending &&
                              !showEnemyAttackAlert &&
                              !isProcessingAction
                            ) {
                              setSelectedAttackZone("Head")
                              executeAttack("Head")
                            }
                          }}
                          disabled={
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center mb-1">
                            <span role="img" aria-label="Cabeza" className="text-xs">
                              👤
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Sword className="w-2 h-2 mr-1 text-red-300" />
                            <span>Cabeza</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              turn === "pet" &&
                              !isAttacking &&
                              !isDefending &&
                              !showEnemyAttackAlert &&
                              !isProcessingAction
                            ) {
                              setSelectedAttackZone("Chest")
                              executeAttack("Chest")
                            }
                          }}
                          disabled={
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center mb-1">
                            <span role="img" aria-label="Pecho" className="text-xs">
                              👕
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Sword className="w-2 h-2 mr-1 text-red-300" />
                            <span>Pecho</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              turn === "pet" &&
                              !isAttacking &&
                              !isDefending &&
                              !showEnemyAttackAlert &&
                              !isProcessingAction
                            ) {
                              setSelectedAttackZone("Legs")
                              executeAttack("Legs")
                            }
                          }}
                          disabled={
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            turn !== "pet" || isAttacking || isDefending || showEnemyAttackAlert || isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center mb-1">
                            <span role="img" aria-label="Piernas" className="text-xs">
                              👖
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Sword className="w-2 h-2 mr-1 text-red-300" />
                            <span>Piernas</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sección de defensas */}
                  <div>
                    <div className="bg-blue-300 rounded-lg p-2 border-2 border-blue-500">
                      <h4 className="text-center text-white font-bold text-xs mb-1 flex items-center justify-center bg-blue-600 rounded-md py-1 shadow-inner">
                        <Shield className="w-3 h-3 mr-1" /> DEFENSAS <Shield className="w-3 h-3 ml-1" />
                      </h4>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            if (turn === "pet" && !isAttacking && !isDefending && !isProcessingAction) {
                              setSelectedDefenseZone("Head")
                              executeDefend("Head")
                            } else if (turn === "enemy" && pendingEnemyAttack && !isProcessingAction) {
                              setSelectedDefenseZone("Head")
                              executeDefendAgainstEnemyAttack("Head")
                            }
                          }}
                          disabled={
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center mb-1">
                            <span role="img" aria-label="Cabeza" className="text-xs">
                              👤
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-2 h-2 mr-1 text-blue-300" />
                            <span>Cabeza</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (turn === "pet" && !isAttacking && !isDefending && !isProcessingAction) {
                              setSelectedDefenseZone("Chest")
                              executeDefend("Chest")
                            } else if (turn === "enemy" && pendingEnemyAttack && !isProcessingAction) {
                              setSelectedDefenseZone("Chest")
                              executeDefendAgainstEnemyAttack("Chest")
                            }
                          }}
                          disabled={
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center mb-1">
                            <span role="img" aria-label="Pecho" className="text-xs">
                              👕
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-2 h-2 mr-1 text-blue-300" />
                            <span>Pecho</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (turn === "pet" && !isAttacking && !isDefending && !isProcessingAction) {
                              setSelectedDefenseZone("Legs")
                              executeDefend("Legs")
                            } else if (turn === "enemy" && pendingEnemyAttack && !isProcessingAction) {
                              setSelectedDefenseZone("Legs")
                              executeDefendAgainstEnemyAttack("Legs")
                            }
                          }}
                          disabled={
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                          }
                          className={`flex flex-col items-center justify-center p-1 rounded bg-amber-700 border border-amber-900 text-white text-xs hover:bg-amber-600 active:bg-amber-800 transition-colors ${
                            (turn !== "pet" && !showEnemyAttackAlert) ||
                            isAttacking ||
                            isDefending ||
                            isProcessingAction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center mb-1">
                            <span role="img" aria-label="Piernas" className="text-xs">
                              👖
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-2 h-2 mr-1 text-blue-300" />
                            <span>Piernas</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-4">
                <PixelButton
                  onClick={finishCombat}
                  size="lg"
                  className="hover:bg-amber-400 active:bg-amber-500 transition-colors"
                >
                  CONTINUAR
                </PixelButton>
              </div>
            )}

            {/* Registro de combate (opcional, se puede ocultar para mantener la interfaz limpia) */}
            <div className="mt-4 bg-amber-50 p-3 rounded-xl border-4 border-amber-300 shadow-inner h-28 overflow-y-auto">
              <h4 className="text-center text-amber-800 font-bold text-xs mb-2 sticky top-0 bg-amber-100 py-1 rounded-md border border-amber-200">
                REGISTRO DE COMBATE
              </h4>
              {combatLog.map((log, index) => (
                <p key={index} className="text-sm mb-1 font-medium text-amber-900 px-1">
                  {log}
                </p>
              ))}
            </div>

            {showCombatResult && (
              <CombatResultDisplay
                playerAttackZone={selectedAttackZone}
                playerDefenseZone={selectedDefenseZone}
                enemyAttackZone={enemyAttackZone}
                enemyDefenseZone={enemyDefenseZone}
                damageDealt={lastDamageDealt}
                damageTaken={lastDamageTaken}
                attackBlocked={attackBlocked}
                defenseSuccessful={defenseSuccessful}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
