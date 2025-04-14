"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import {
  Heart,
  Utensils,
  Dumbbell,
  Gamepad2,
  ShowerHeadIcon as Shower,
  Swords,
  ShoppingBag,
  X,
  Info,
  ShieldIcon,
  Sword,
  Zap,
} from "lucide-react"
import PetDisplay from "./pet-display"
import CombatSystem from "./combat-system"
import PetSelection from "./pet-selection"
import UserProfileSelection, { type UserProfile } from "./user-profile-selection"
import UserProfileDisplay from "./user-profile-display"
import PixelButton from "./pixel-button"
import PixelText from "./pixel-text"

// Modificar el tipo PetStats para usar tipos YUBO
export type PetStats = {
  name: string
  health: number
  maxHealth: number
  happiness: number
  energy: number
  cleanliness: number
  strength: number
  experience: number
  level: number
  element: "fire" | "water" | "earth" | null
  petType: "yubo-green" | "yubo-pink" | "yubo-blue"
}

// Tipo para los alimentos
type FoodItem = {
  name: string
  emoji: string
  healthBoost: number
  energyBoost: number
  happinessBoost: number
  quantity: number
  price: number
  description: string
}

// Tipo para las armaduras
type ArmorItem = {
  id: string
  name: string
  icon: string
  defense: number
  healthBoost: number
  elementalResistance?: "fire" | "water" | "earth" | null
  price: number
  description: string
  owned: boolean
  equipped: boolean
}

// Tipo para las armas
type WeaponItem = {
  id: string
  name: string
  icon: string
  attack: number
  critChance: number
  elementalBonus?: "fire" | "water" | "earth" | null
  price: number
  description: string
  owned: boolean
  equipped: boolean
}

export default function TamagotchiGame() {
  // Añadir estado para el perfil de usuario
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileSelection, setShowProfileSelection] = useState(true)
  const [showProfileDisplay, setShowProfileDisplay] = useState(false)

  // Modificar el estado inicial para usar un tipo YUBO
  const [pet, setPet] = useState<PetStats>({
    name: "Yubo",
    health: 100,
    maxHealth: 100,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
    strength: 10,
    experience: 0,
    level: 1,
    element: null,
    petType: "yubo-green",
  })

  // Estado para el inventario de alimentos con descripciones
  const [foodInventory, setFoodInventory] = useState<FoodItem[]>([
    {
      name: "Manzana",
      emoji: "🍎",
      healthBoost: 15,
      energyBoost: 5,
      happinessBoost: 2,
      quantity: 3,
      price: 10,
      description: "Fruta fresca que proporciona un buen equilibrio de nutrientes. Ideal para recuperar salud.",
    },
    {
      name: "Plátano",
      emoji: "🍌",
      healthBoost: 10,
      energyBoost: 15,
      happinessBoost: 5,
      quantity: 3,
      price: 15,
      description: "Rico en potasio y carbohidratos. Excelente para recuperar energía rápidamente.",
    },
    {
      name: "Zanahoria",
      emoji: "🥕",
      healthBoost: 20,
      energyBoost: 10,
      happinessBoost: 0,
      quantity: 2,
      price: 20,
      description: "Vegetal nutritivo que mejora la visión y la salud. Gran aporte de vitaminas.",
    },
    {
      name: "Carne",
      emoji: "🍖",
      healthBoost: 30,
      energyBoost: 5,
      happinessBoost: 0,
      quantity: 1,
      price: 30,
      description: "Proteína de alta calidad. Proporciona una gran recuperación de salud para tu mascota.",
    },
    {
      name: "Helado",
      emoji: "🍦",
      healthBoost: 5,
      energyBoost: 10,
      happinessBoost: 15,
      quantity: 2,
      price: 25,
      description: "Delicioso postre que hace muy feliz a tu mascota. Bajo en nutrientes pero alto en felicidad.",
    },
    {
      name: "Pizza",
      emoji: "🍕",
      healthBoost: 25,
      energyBoost: 20,
      happinessBoost: 10,
      quantity: 1,
      price: 40,
      description: "Comida completa con carbohidratos, proteínas y grasas. Equilibrio perfecto de beneficios.",
    },
  ])

  // Estado para el inventario de armaduras
  const [armorInventory, setArmorInventory] = useState<ArmorItem[]>([
    {
      id: "armor1",
      name: "Armadura de Cuero",
      icon: "🥋",
      defense: 5,
      healthBoost: 10,
      price: 50,
      description: "Armadura básica que ofrece protección ligera. Perfecta para principiantes.",
      owned: true,
      equipped: true,
    },
    {
      id: "armor2",
      name: "Cota de Malla",
      icon: "🧥",
      defense: 15,
      healthBoost: 25,
      price: 150,
      description: "Armadura de metal entrelazado que ofrece buena protección contra ataques físicos.",
      owned: false,
      equipped: false,
    },
    {
      id: "armor3",
      name: "Armadura de Placas",
      icon: "🛡️",
      defense: 30,
      healthBoost: 50,
      price: 300,
      description: "Pesada armadura que ofrece excelente protección. Ideal para combates difíciles.",
      owned: false,
      equipped: false,
    },
    {
      id: "armor4",
      name: "Túnica Ígnea",
      icon: "👘",
      defense: 20,
      healthBoost: 30,
      elementalResistance: "fire",
      price: 250,
      description: "Armadura mágica que otorga resistencia al fuego. Perfecta para mascotas de agua.",
      owned: false,
      equipped: false,
    },
    {
      id: "armor5",
      name: "Caparazón Acuático",
      icon: "🐚",
      defense: 20,
      healthBoost: 30,
      elementalResistance: "water",
      price: 250,
      description: "Armadura natural que otorga resistencia al agua. Ideal para mascotas de tierra.",
      owned: false,
      equipped: false,
    },
    {
      id: "armor6",
      name: "Corteza Terrestre",
      icon: "🌳",
      defense: 20,
      healthBoost: 30,
      elementalResistance: "earth",
      price: 250,
      description: "Armadura orgánica que otorga resistencia a la tierra. Excelente para mascotas de fuego.",
      owned: false,
      equipped: false,
    },
  ])

  // Estado para el inventario de armas
  const [weaponInventory, setWeaponInventory] = useState<WeaponItem[]>([
    {
      id: "weapon1",
      name: "Daga Simple",
      icon: "🔪",
      attack: 5,
      critChance: 5,
      price: 50,
      description: "Arma básica que ofrece un pequeño aumento de daño. Perfecta para principiantes.",
      owned: true,
      equipped: true,
    },
    {
      id: "weapon2",
      name: "Espada Larga",
      icon: "⚔️",
      attack: 15,
      critChance: 10,
      price: 150,
      description: "Espada versátil que ofrece buen daño y probabilidad de crítico.",
      owned: false,
      equipped: false,
    },
    {
      id: "weapon3",
      name: "Hacha de Batalla",
      icon: "🪓",
      attack: 25,
      critChance: 15,
      price: 300,
      description: "Arma pesada que inflige gran daño. Ideal para combates difíciles.",
      owned: false,
      equipped: false,
    },
    {
      id: "weapon4",
      name: "Espada Flamígera",
      icon: "🔥",
      attack: 20,
      critChance: 10,
      elementalBonus: "fire",
      price: 250,
      description: "Espada mágica que otorga bonus de fuego. Perfecta para mascotas de fuego.",
      owned: false,
      equipped: false,
    },
    {
      id: "weapon5",
      name: "Tridente Marino",
      icon: "🔱",
      attack: 20,
      critChance: 10,
      elementalBonus: "water",
      price: 250,
      description: "Arma acuática que otorga bonus de agua. Ideal para mascotas de agua.",
      owned: false,
      equipped: false,
    },
    {
      id: "weapon6",
      name: "Mazo Terrestre",
      icon: "🔨",
      attack: 20,
      critChance: 10,
      elementalBonus: "earth",
      price: 250,
      description: "Mazo pesado que otorga bonus de tierra. Excelente para mascotas de tierra.",
      owned: false,
      equipped: false,
    },
  ])

  // Añadir estado para el ítem seleccionado en la tienda
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  // Estado para mostrar el menú de equipamiento
  const [showEquipment, setShowEquipment] = useState(false)

  // Estado para la categoría seleccionada en el menú de equipamiento
  const [equipmentCategory, setEquipmentCategory] = useState<"armor" | "weapon">("armor")

  // Estado para el ítem seleccionado en el menú de equipamiento
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  // Estado para las monedas del jugador
  const [coins, setCoins] = useState(100)

  // Añadir un estado para controlar si estamos en la pantalla de selección de mascota
  const [selectingPet, setSelectingPet] = useState(false)

  // Añadir un estado para controlar si estamos en la pantalla de selección de elemento
  const [selectingElement, setSelectingElement] = useState(false)

  const [lastFed, setLastFed] = useState(Date.now())
  const [lastPlayed, setLastPlayed] = useState(Date.now())
  const [lastCleaned, setLastCleaned] = useState(Date.now())
  const [inCombat, setInCombat] = useState(false)
  const [message, setMessage] = useState("¡Cuida a tu YUBO!")
  const [showCombat, setShowCombat] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [showFoodMenu, setShowFoodMenu] = useState(false)
  const [showShop, setShowShop] = useState(false)

  // Calcular estadísticas de combate con equipamiento
  const combatStats = {
    attack: pet.strength + weaponInventory.find((w) => w.equipped)?.attack || 0,
    defense: armorInventory.find((a) => a.equipped)?.defense || 0,
    critChance: weaponInventory.find((w) => w.equipped)?.critChance || 0,
    maxHealth: pet.maxHealth + (armorInventory.find((a) => a.equipped)?.healthBoost || 0),
  }

  const addMessage = (newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  // Función para manejar la creación del perfil de usuario
  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setShowProfileSelection(false)
    setSelectingPet(true)
  }

  // Función para actualizar el perfil de usuario
  const updateUserProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile)
  }

  // Efecto para simular el paso del tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now()

      // Reducir estadísticas con el tiempo
      setPet((prevPet) => {
        const timeSinceFed = (currentTime - lastFed) / 1000 / 60 // minutos
        const timeSincePlayed = (currentTime - lastPlayed) / 1000 / 60
        const timeSinceCleaned = (currentTime - lastCleaned) / 1000 / 60

        // Para la demo, reducimos más rápido
        const healthReduction = Math.min(timeSinceFed * 0.5, 1)
        const happinessReduction = Math.min(timeSincePlayed * 0.5, 1)
        const cleanlinessReduction = Math.min(timeSinceCleaned * 0.5, 1)

        return {
          ...prevPet,
          health: Math.max(prevPet.health - healthReduction, 0),
          happiness: Math.max(prevPet.happiness - happinessReduction, 0),
          cleanliness: Math.max(prevPet.cleanliness - cleanlinessReduction, 0),
          energy: Math.min(prevPet.energy + 0.2, 100), // La energía se recupera con el tiempo
        }
      })
    }, 3000) // Actualizar cada 3 segundos para la demo

    return () => clearInterval(timer)
  }, [lastFed, lastPlayed, lastCleaned])

  // Acciones de cuidado
  const feedPet = () => {
    setShowFoodMenu(true)
  }

  const giveFoodToPet = () => {
    const foodIndex = selectedItem
    if (foodIndex === null) return
    const food = foodInventory[foodIndex]

    if (food.quantity <= 0) {
      setMessage(`No tienes más ${food.name.toLowerCase()}. ¡Compra más en la tienda!`)

      // Preguntar si quiere ir a la tienda
      if (confirm(`No tienes más ${food.name}. ¿Quieres ir a la tienda para comprar más?`)) {
        setShowFoodMenu(false)
        setShowShop(true)
      }
      return
    }

    if (pet.health < 100) {
      // Actualizar el inventario reduciendo la cantidad
      const updatedInventory = [...foodInventory]
      updatedInventory[foodIndex] = {
        ...food,
        quantity: food.quantity - 1,
      }
      setFoodInventory(updatedInventory)

      // Aplicar los efectos de la comida
      setPet((prev) => ({
        ...prev,
        health: Math.min(prev.health + food.healthBoost, 100),
        energy: Math.min(prev.energy + food.energyBoost, 100),
        happiness: Math.min(prev.happiness + food.happinessBoost, 100),
      }))
      setLastFed(Date.now())
      setMessage(`¡Tu YUBO ha comido ${food.name.toLowerCase()} ${food.emoji} y está feliz!`)
    } else {
      setMessage("Tu YUBO no tiene hambre ahora mismo.")
    }
    setShowFoodMenu(false)
  }

  const buyFood = (foodIndex: number) => {
    const food = foodInventory[foodIndex]

    if (coins >= food.price) {
      // Actualizar el inventario aumentando la cantidad
      const updatedInventory = [...foodInventory]
      updatedInventory[foodIndex] = {
        ...food,
        quantity: food.quantity + 1,
      }
      setFoodInventory(updatedInventory)

      // Reducir las monedas
      setCoins((prev) => prev - food.price)
      setMessage(`¡Has comprado ${food.name.toLowerCase()} ${food.emoji}!`)
    } else {
      setMessage("¡No tienes suficientes monedas para comprar esto!")
    }
  }

  // Funciones para el equipamiento
  const buyEquipment = (type: "armor" | "weapon", itemId: string) => {
    if (type === "armor") {
      const armorIndex = armorInventory.findIndex((item) => item.id === itemId)
      if (armorIndex === -1) return

      const armor = armorInventory[armorIndex]

      if (coins >= armor.price) {
        // Actualizar el inventario
        const updatedInventory = [...armorInventory]
        updatedInventory[armorIndex] = {
          ...armor,
          owned: true,
        }
        setArmorInventory(updatedInventory)

        // Reducir las monedas
        setCoins((prev) => prev - armor.price)
        setMessage(`¡Has comprado ${armor.name}!`)
      } else {
        setMessage("¡No tienes suficientes monedas para comprar esto!")
      }
    } else {
      const weaponIndex = weaponInventory.findIndex((item) => item.id === itemId)
      if (weaponIndex === -1) return

      const weapon = weaponInventory[weaponIndex]

      if (coins >= weapon.price) {
        // Actualizar el inventario
        const updatedInventory = [...weaponInventory]
        updatedInventory[weaponIndex] = {
          ...weapon,
          owned: true,
        }
        setWeaponInventory(updatedInventory)

        // Reducir las monedas
        setCoins((prev) => prev - weapon.price)
        setMessage(`¡Has comprado ${weapon.name}!`)
      } else {
        setMessage("¡No tienes suficientes monedas para comprar esto!")
      }
    }
  }

  const equipItem = (type: "armor" | "weapon", itemId: string) => {
    if (type === "armor") {
      // Desequipar todas las armaduras
      const updatedInventory = armorInventory.map((item) => ({
        ...item,
        equipped: item.id === itemId,
      }))
      setArmorInventory(updatedInventory)

      const armor = updatedInventory.find((item) => item.id === itemId)
      if (armor) {
        setMessage(`¡Has equipado ${armor.name}!`)
      }
    } else {
      // Desequipar todas las armas
      const updatedInventory = weaponInventory.map((item) => ({
        ...item,
        equipped: item.id === itemId,
      }))
      setWeaponInventory(updatedInventory)

      const weapon = updatedInventory.find((item) => item.id === itemId)
      if (weapon) {
        setMessage(`¡Has equipado ${weapon.name}!`)
      }
    }
  }

  const playWithPet = () => {
    if (pet.energy >= 10) {
      setPet((prev) => ({
        ...prev,
        happiness: Math.min(prev.happiness + 20, 100),
        energy: Math.max(prev.energy - 10, 0),
      }))
      setLastPlayed(Date.now())
      setMessage("¡Tu YUBO se divirtió mucho jugando contigo!")
    } else {
      setMessage("Tu YUBO está demasiado cansado para jugar.")
    }
  }

  const cleanPet = () => {
    setPet((prev) => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(prev.happiness + 5, 100),
    }))
    setLastCleaned(Date.now())
    setMessage("¡Tu YUBO está limpio y reluciente!")
  }

  const trainPet = () => {
    if (pet.energy >= 20) {
      setPet((prev) => ({
        ...prev,
        strength: prev.strength + 1,
        energy: Math.max(prev.energy - 20, 0),
        experience: prev.experience + 10,
      }))
      checkLevelUp()
      setMessage("¡Tu YUBO ha entrenado y se ha vuelto más fuerte!")
    } else {
      setMessage("Tu YUBO está demasiado cansado para entrenar.")
    }
  }

  const checkLevelUp = () => {
    setPet((prev) => {
      if (prev.experience >= prev.level * 100) {
        setMessage(`¡Tu YUBO ha subido al nivel ${prev.level + 1}!`)
        return {
          ...prev,
          level: prev.level + 1,
          experience: 0,
          strength: prev.strength + 5,
          health: prev.maxHealth + 20,
          maxHealth: prev.maxHealth + 20,
          energy: 100,
        }
      }
      return prev
    })
  }

  const startCombat = () => {
    if (pet.energy >= 30 && pet.health >= 50) {
      // Limpiar cualquier estado previo antes de iniciar el combate
      setMessages([])
      setMessage("¡Preparándote para el combate!")
      // Usar un pequeño retraso para asegurar que la transición sea suave
      setTimeout(() => {
        setInCombat(true)
      }, 100)
    } else {
      setMessage("Tu YUBO no está en condiciones de combatir. Asegúrate de que tenga suficiente energía y salud.")
    }
  }

  // Modificar la función endCombat para actualizar los registros de batalla
  const endCombat = (won: boolean, remainingHealth: number, experienceGained?: number, strengthGained?: number) => {
    // Primero actualizar los estados antes de cambiar inCombat
    setPet((prev) => ({
      ...prev,
      health: remainingHealth,
    }))

    // Actualizar los registros de batalla en el perfil de usuario
    if (userProfile) {
      setUserProfile((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          battleRecords: {
            wins: prev.battleRecords.wins + (won ? 1 : 0),
            losses: prev.battleRecords.losses + (won ? 0 : 1),
            totalExperience: prev.battleRecords.totalExperience + (experienceGained || 0),
          },
        }
      })
    }

    // Si ganó, aplicar recompensas
    if (won && experienceGained && experienceGained > 0) {
      // Dar monedas como recompensa por ganar
      const coinsGained = Math.floor(experienceGained / 2) + 10
      setCoins((prev) => prev + coinsGained)
      addMessage(`¡Has ganado ${coinsGained} monedas!`)

      setPet((prev) => {
        // Calcular nueva experiencia
        const newExperience = prev.experience + experienceGained

        // Calcular cuántos niveles debe subir
        let newLevel = prev.level
        let expRequired = prev.level * 100 // Experiencia requerida para el siguiente nivel
        let remainingExp = newExperience
        let strengthBonus = 0
        let healthBonus = 0

        // Mientras tenga suficiente experiencia para subir de nivel
        while (remainingExp >= expRequired) {
          remainingExp -= expRequired
          newLevel++
          strengthBonus += 5 // +5 de fuerza por cada nivel
          healthBonus += 20 // +20 de salud máxima por cada nivel
          expRequired = newLevel * 100 // Actualizar experiencia requerida para el siguiente nivel

          // Mostrar mensaje de subida de nivel
          addMessage(`¡Tu YUBO ha subido al nivel ${newLevel}!`)
        }

        // Aplicar bonificación de fuerza por combate si la hay
        const totalStrengthGain = (strengthGained || 0) + strengthBonus

        if (totalStrengthGain > 0) {
          addMessage(`¡Tu YUBO ha ganado ${totalStrengthGain} puntos de fuerza!`)
        }

        if (newLevel > prev.level) {
          addMessage(`¡Tu YUBO ha subido ${newLevel - prev.level} nivel(es)!`)
        }

        // Actualizar estadísticas
        return {
          ...prev,
          experience: remainingExp,
          level: newLevel,
          strength: prev.strength + totalStrengthGain,
          // Aumentar la salud máxima con cada nivel
          health: remainingHealth + healthBonus,
          maxHealth: prev.maxHealth + healthBonus, // +20 de salud máxima por nivel
        }
      })

      addMessage(`¡Has ganado ${experienceGained} puntos de experiencia en combate!`)
    } else if (!won) {
      addMessage("Tu YUBO ha regresado del combate sin victoria.")
    }

    // Actualizar el estado de felicidad después del combate
    setPet((prev) => ({
      ...prev,
      happiness: Math.max(prev.happiness - 10, 0),
    }))

    // Usar un pequeño retraso para asegurar que todos los estados se actualicen antes de salir del combate
    setTimeout(() => {
      setInCombat(false)
      setMessage("¡Has regresado del combate!")
    }, 100)
  }

  // Añadir la función para seleccionar tipo de YUBO
  const selectPetType = (petType: "yubo-green" | "yubo-pink" | "yubo-blue") => {
    setPet((prev) => ({
      ...prev,
      petType: petType,
    }))
    setSelectingPet(false)
    setSelectingElement(true)
    setMessage(
      `¡Has elegido un YUBO ${petType === "yubo-green" ? "Verde" : petType === "yubo-pink" ? "Rosa" : "Azul"}!`,
    )
  }

  // Añadir la función para seleccionar elemento
  const selectElement = (element: "fire" | "water" | "earth") => {
    setPet((prev) => ({
      ...prev,
      element: element,
    }))
    setSelectingElement(false)
    setMessage(`¡Has elegido el elemento ${element === "fire" ? "Fuego" : element === "water" ? "Agua" : "Tierra"}!`)
  }

  // Función para renderizar las barras de estadísticas de los ítems
  const renderStatBars = (value: number, maxValue = 30, color: string) => {
    const bars = []
    const filledBars = Math.ceil((value / maxValue) * 5)

    for (let i = 0; i < 5; i++) {
      bars.push(<div key={i} className={`w-4 h-2 rounded-sm ${i < filledBars ? color : "bg-gray-200"}`} />)
    }

    return <div className="flex space-x-1">{bars}</div>
  }

  // Mostrar la pantalla de selección de perfil primero
  if (showProfileSelection) {
    return <UserProfileSelection onProfileComplete={handleProfileComplete} />
  }

  // Mostrar la pantalla de selección de mascota después del perfil
  if (selectingPet) {
    return <PetSelection onSelectPet={selectPetType} />
  }

  // Mostrar la pantalla de selección de elemento
  if (selectingElement) {
    return (
      <div className="w-full max-w-md">
        <Card className="p-6 shadow-xl bg-white rounded-xl crt-effect pixel-border">
          <div className="text-center mb-6">
            <PixelText as="h2" size="xl" className="text-purple-700 font-bold">
              Elige un elemento para tu YUBO
            </PixelText>
            <PixelText size="sm" className="text-gray-500 mt-2">
              Cada elemento tiene ventajas y desventajas en combate
            </PixelText>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-400 flex items-center justify-center mb-2 pixel-art">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-center mb-2">
                <PixelText as="span" size="sm" className="font-bold">
                  Fuego
                </PixelText>
                <PixelText as="p" size="xs">
                  Vence a Tierra
                </PixelText>
              </div>
              <PixelButton onClick={() => selectElement("fire")} size="sm">
                Elegir
              </PixelButton>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center mb-2 pixel-art">
                <span className="text-2xl">💧</span>
              </div>
              <div className="text-center mb-2">
                <PixelText as="span" size="sm" className="font-bold">
                  Agua
                </PixelText>
                <PixelText as="p" size="xs">
                  Vence a Fuego
                </PixelText>
              </div>
              <PixelButton onClick={() => selectElement("water")} size="sm">
                Elegir
              </PixelButton>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center mb-2 pixel-art">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="text-center mb-2">
                <PixelText as="span" size="sm" className="font-bold">
                  Tierra
                </PixelText>
                <PixelText as="p" size="xs">
                  Vence a Agua
                </PixelText>
              </div>
              <PixelButton onClick={() => selectElement("earth")} size="sm">
                Elegir
              </PixelButton>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 worn-effect">
            <PixelText size="sm">Sistema de ventajas:</PixelText>
            <PixelText size="sm">Fuego → Tierra → Agua → Fuego</PixelText>
          </div>
        </Card>
      </div>
    )
  }

  // Mostrar el sistema de combate
  if (inCombat) {
    return <CombatSystem pet={pet} onCombatEnd={endCombat} />
  }

  // Mostrar el perfil de usuario si está abierto
  if (showProfileDisplay && userProfile) {
    return (
      <UserProfileDisplay
        profile={userProfile}
        onClose={() => setShowProfileDisplay(false)}
        onUpdateProfile={updateUserProfile}
      />
    )
  }

  // Obtener la imagen del YUBO
  const getYuboImage = () => {
    if (pet.petType === "yubo-green") return "/images/yubo-green.png"
    if (pet.petType === "yubo-pink") return "/images/yubo-pink.png"
    return "/images/yubo-blue.png"
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-6 shadow-xl bg-white rounded-xl relative crt-effect pixel-border">
        {/* Botones en la parte superior */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
          {/* Iconos a la izquierda */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowEquipment(true)
                setEquipmentCategory("armor")
                setSelectedEquipment(null)
              }}
              className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 hover:bg-amber-700 active:bg-amber-900 transition-colors"
            >
              <span className="text-lg">🛡️</span>
            </button>
            <button
              onClick={() => {
                setShowShop(true)
                setSelectedItem(null)
              }}
              className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 hover:bg-amber-700 active:bg-amber-900 transition-colors"
            >
              <span className="text-lg">🛍️</span>
            </button>
            {/* Botón de perfil de usuario */}
            <button
              onClick={() => setShowProfileDisplay(true)}
              className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 hover:bg-amber-700 active:bg-amber-900 transition-colors"
            >
              <span className="text-lg">👤</span>
            </button>
          </div>

          {/* Monedas a la derecha */}
          <div className="flex items-center">
            <PixelText as="span" className="text-yellow-500 font-bold">
              {coins} 🪙
            </PixelText>
          </div>
        </div>

        <div className="text-center mb-4 mt-10">
          <PixelText as="h2" size="xl" className="font-bold text-purple-700">
            {pet.name} - Nivel {pet.level}
          </PixelText>
          <PixelText size="sm" className="text-gray-500">
            Experiencia: {pet.experience}/{pet.level * 100}
          </PixelText>
          {userProfile && (
            <PixelText size="xs" className="text-purple-500 mt-1">
              Entrenador: {userProfile.customAvatar ? "👤" : userProfile.avatar} {userProfile.name}
            </PixelText>
          )}
        </div>

        <PetDisplay
          health={pet.health}
          happiness={pet.happiness}
          cleanliness={pet.cleanliness}
          level={pet.level}
          element={pet.element}
          petType={pet.petType}
          combatStats={combatStats}
        />

        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 mr-2">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <Progress value={(pet.health / combatStats.maxHealth) * 100} className="h-2 pixel-art" />
            </div>
            <PixelText as="span" size="sm" className="ml-2 font-medium">
              {Math.round(pet.health)}/{combatStats.maxHealth}
            </PixelText>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 mr-2">
              <Gamepad2 className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <Progress value={pet.happiness} className="h-2 pixel-art" />
            </div>
            <PixelText as="span" size="sm" className="ml-2 font-medium">
              {Math.round(pet.happiness)}%
            </PixelText>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 mr-2">
              <Dumbbell className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <Progress value={pet.energy} className="h-2 pixel-art" />
            </div>
            <PixelText as="span" size="sm" className="ml-2 font-medium">
              {Math.round(pet.energy)}%
            </PixelText>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-amber-800 rounded-md border-2 border-amber-950 mr-2">
              <Shower className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <Progress value={pet.cleanliness} className="h-2 pixel-art" />
            </div>
            <PixelText as="span" size="sm" className="ml-2 font-medium">
              {Math.round(pet.cleanliness)}%
            </PixelText>
          </div>
        </div>

        <PixelText as="p" className="my-4 text-center text-sm bg-purple-100 p-2 rounded">
          {message}
        </PixelText>

        {messages.length > 0 && (
          <div className="mt-4 bg-purple-50 p-3 rounded-lg max-h-32 overflow-y-auto worn-effect">
            <PixelText as="h4" className="font-medium text-purple-800 mb-2">
              Notificaciones:
            </PixelText>
            <ul className="space-y-1 text-sm">
              {messages.slice(-3).map((msg, index) => (
                <li key={index} className="text-gray-700">
                  <PixelText size="sm">{msg}</PixelText>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showFoodMenu && (
          <div className="mt-4 bg-purple-50 p-3 rounded-lg worn-effect">
            <PixelText as="h4" className="font-medium text-purple-800 mb-2">
              ¿Qué quieres darle de comer?
            </PixelText>

            {/* Verificar si hay alimentos disponibles */}
            {foodInventory.some((food) => food.quantity > 0) ? (
              <div className="grid grid-cols-3 gap-2">
                {foodInventory.map((food, index) => (
                  <PixelButton
                    key={index}
                    onClick={() => {
                      setSelectedItem(index)
                      giveFoodToPet()
                    }}
                    className={`flex flex-col items-center p-2 h-auto ${food.quantity <= 0 ? "opacity-50" : ""}`}
                    disabled={food.quantity <= 0}
                    size="sm"
                  >
                    <span className="text-2xl mb-1">{food.emoji}</span>
                    <PixelText size="xs">{food.name}</PixelText>
                    <PixelText size="xs" className="mt-1 font-bold">
                      {food.quantity}x
                    </PixelText>
                  </PixelButton>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <PixelText className="text-amber-700 mb-3">No tienes alimentos disponibles en tu inventario.</PixelText>
                <PixelButton
                  onClick={() => {
                    setShowFoodMenu(false)
                    setShowShop(true)
                  }}
                  className="mx-auto"
                  icon={<ShoppingBag className="w-4 h-4 mr-2" />}
                >
                  Ir a la tienda
                </PixelButton>
              </div>
            )}

            <PixelButton onClick={() => setShowFoodMenu(false)} className="w-full mt-3" variant="secondary">
              Cancelar
            </PixelButton>
          </div>
        )}

        {showShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col crt-effect pixel-border">
              {/* Cabecera de la tienda */}
              <div className="p-4 border-b flex justify-between items-center bg-purple-100 rounded-t-xl">
                <PixelText as="h3" size="xl" className="font-bold text-purple-800 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Tienda de Alimentos
                </PixelText>
                <div className="flex items-center">
                  <PixelText as="span" className="text-yellow-500 font-bold mr-4">
                    {coins} 🪙
                  </PixelText>
                  <PixelButton
                    onClick={() => {
                      setShowShop(false)
                      setSelectedItem(null)
                    }}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </PixelButton>
                </div>
              </div>

              {/* Contenido principal de la tienda */}
              <div className="flex flex-1 overflow-hidden">
                {/* Lista de ítems */}
                <div className="w-1/2 p-3 overflow-y-auto border-r">
                  {foodInventory.map((food, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg mb-2 cursor-pointer hover:bg-purple-50 transition-colors ${selectedItem === index ? "bg-purple-100 border border-purple-300" : ""}`}
                      onClick={() => setSelectedItem(index)}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{food.emoji}</span>
                        <div>
                          <PixelText as="p" size="sm" className="font-medium">
                            {food.name}
                          </PixelText>
                          <PixelText as="p" size="xs" className="text-gray-500">
                            Precio: {food.price} 🪙
                          </PixelText>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalles del ítem seleccionado */}
                <div className="w-1/2 p-3 overflow-y-auto">
                  {selectedItem !== null ? (
                    <div className="flex flex-col h-full">
                      <div className="text-center mb-3">
                        <span className="text-4xl block mb-2">{foodInventory[selectedItem].emoji}</span>
                        <PixelText as="h4" size="lg" className="font-bold">
                          {foodInventory[selectedItem].name}
                        </PixelText>
                        <PixelText as="p" size="sm" className="text-gray-500">
                          Tienes: {foodInventory[selectedItem].quantity}x
                        </PixelText>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg mb-3 worn-effect">
                        <PixelText as="p" size="sm" className="text-gray-700 mb-3">
                          {foodInventory[selectedItem].description}
                        </PixelText>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <PixelText as="span" size="sm" className="flex items-center">
                              <Heart className="w-4 h-4 text-red-500 mr-1" /> Salud
                            </PixelText>
                            {renderStatBars(foodInventory[selectedItem].healthBoost, 30, "bg-red-500")}
                          </div>

                          <div className="flex justify-between items-center">
                            <PixelText as="span" size="sm" className="flex items-center">
                              <Dumbbell className="w-4 h-4 text-blue-500 mr-1" /> Energía
                            </PixelText>
                            {renderStatBars(foodInventory[selectedItem].energyBoost, 20, "bg-blue-500")}
                          </div>

                          <div className="flex justify-between items-center">
                            <PixelText as="span" size="sm" className="flex items-center">
                              <Gamepad2 className="w-4 h-4 text-yellow-500 mr-1" /> Felicidad
                            </PixelText>
                            {renderStatBars(foodInventory[selectedItem].happinessBoost, 15, "bg-yellow-500")}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <PixelButton
                          onClick={() => buyFood(selectedItem)}
                          className="w-full"
                          disabled={coins < foodInventory[selectedItem].price}
                        >
                          Comprar por {foodInventory[selectedItem].price} 🪙
                        </PixelButton>

                        {coins < foodInventory[selectedItem].price && (
                          <PixelText as="p" size="xs" className="text-red-500 mt-1 text-center">
                            ¡No tienes suficientes monedas!
                          </PixelText>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <Info className="w-12 h-12 text-purple-300 mb-2" />
                      <PixelText as="p" className="text-gray-500">
                        Selecciona un alimento para ver sus detalles
                      </PixelText>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col crt-effect pixel-border">
              {/* Cabecera del menú de equipamiento */}
              <div className="p-4 border-b flex justify-between items-center bg-purple-100 rounded-t-xl">
                <PixelText as="h3" size="xl" className="font-bold text-purple-800 flex items-center">
                  <ShieldIcon className="w-5 h-5 mr-2" />
                  Equipamiento
                </PixelText>
                <div className="flex items-center">
                  <PixelText as="span" className="text-yellow-500 font-bold mr-4">
                    {coins} 🪙
                  </PixelText>
                  <PixelButton
                    onClick={() => {
                      setShowEquipment(false)
                      setSelectedEquipment(null)
                    }}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </PixelButton>
                </div>
              </div>

              {/* Pestañas para cambiar entre armaduras y armas */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-2 px-4 text-center font-pixel ${equipmentCategory === "armor" ? "bg-purple-100 font-medium" : "bg-gray-50"}`}
                  onClick={() => {
                    setEquipmentCategory("armor")
                    setSelectedEquipment(null)
                  }}
                >
                  <ShieldIcon className="w-4 h-4 inline mr-1" /> Armaduras
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center font-pixel ${equipmentCategory === "weapon" ? "bg-purple-100 font-medium" : "bg-gray-50"}`}
                  onClick={() => {
                    setEquipmentCategory("weapon")
                    setSelectedEquipment(null)
                  }}
                >
                  <Sword className="w-4 h-4 inline mr-1" /> Armas
                </button>
              </div>

              {/* Contenido principal del menú de equipamiento */}
              <div className="flex flex-1 overflow-hidden">
                {/* Lista de ítems */}
                <div className="w-1/2 p-3 overflow-y-auto border-r">
                  {(equipmentCategory === "armor" ? armorInventory : weaponInventory).map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-lg mb-2 cursor-pointer hover:bg-purple-50 transition-colors ${
                        selectedEquipment === item.id ? "bg-purple-100 border border-purple-300" : ""
                      } ${!item.owned ? "opacity-70" : ""}`}
                      onClick={() => setSelectedEquipment(item.id)}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{item.icon}</span>
                        <div>
                          <PixelText as="p" size="sm" className="font-medium">
                            {item.name}
                          </PixelText>
                          <div className="flex items-center">
                            {item.owned ? (
                              <PixelText as="span" size="xs" className="text-green-600">
                                Adquirido
                              </PixelText>
                            ) : (
                              <PixelText as="span" size="xs" className="text-gray-500">
                                Precio: {item.price} 🪙
                              </PixelText>
                            )}
                            {item.equipped && (
                              <PixelText as="span" size="xs" className="ml-2 bg-blue-100 text-blue-800 px-1 rounded">
                                Equipado
                              </PixelText>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalles del ítem seleccionado */}
                <div className="w-1/2 p-3 overflow-y-auto">
                  {selectedEquipment !== null ? (
                    <div className="flex flex-col h-full">
                      {equipmentCategory === "armor"
                        ? // Detalles de armadura
                          (() => {
                            const armor = armorInventory.find((a) => a.id === selectedEquipment)
                            if (!armor) return null

                            return (
                              <>
                                <div className="text-center mb-3">
                                  <span className="text-4xl block mb-2">{armor.icon}</span>
                                  <PixelText as="h4" size="lg" className="font-bold">
                                    {armor.name}
                                  </PixelText>
                                  {armor.equipped ? (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                                    >
                                      Equipado
                                    </PixelText>
                                  ) : armor.owned ? (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded"
                                    >
                                      En inventario
                                    </PixelText>
                                  ) : (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
                                    >
                                      No adquirido
                                    </PixelText>
                                  )}
                                </div>

                                <div className="bg-purple-50 p-3 rounded-lg mb-3 worn-effect">
                                  <PixelText as="p" size="sm" className="text-gray-700 mb-3">
                                    {armor.description}
                                  </PixelText>

                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <PixelText as="span" size="sm" className="flex items-center">
                                        <ShieldIcon className="w-4 h-4 text-gray-500 mr-1" /> Defensa
                                      </PixelText>
                                      {renderStatBars(armor.defense, 30, "bg-gray-500")}
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <PixelText as="span" size="sm" className="flex items-center">
                                        <Heart className="w-4 h-4 text-red-500 mr-1" /> Salud
                                      </PixelText>
                                      {renderStatBars(armor.healthBoost, 50, "bg-red-500")}
                                    </div>

                                    {armor.elementalResistance && (
                                      <div className="mt-2 text-sm">
                                        <PixelText as="span" className="font-medium">
                                          Resistencia Elemental:
                                        </PixelText>{" "}
                                        <PixelText
                                          as="span"
                                          className={`${
                                            armor.elementalResistance === "fire"
                                              ? "text-red-600"
                                              : armor.elementalResistance === "water"
                                                ? "text-blue-600"
                                                : "text-green-600"
                                          }`}
                                        >
                                          {armor.elementalResistance === "fire"
                                            ? "Fuego 🔥"
                                            : armor.elementalResistance === "water"
                                              ? "Agua 💧"
                                              : "Tierra 🌱"}
                                        </PixelText>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-auto">
                                  {armor.owned ? (
                                    <PixelButton
                                      onClick={() => equipItem("armor", armor.id)}
                                      className="w-full"
                                      variant="success"
                                      disabled={armor.equipped}
                                    >
                                      {armor.equipped ? "Equipado" : "Equipar"}
                                    </PixelButton>
                                  ) : (
                                    <PixelButton
                                      onClick={() => buyEquipment("armor", armor.id)}
                                      className="w-full"
                                      disabled={coins < armor.price}
                                    >
                                      Comprar por {armor.price} 🪙
                                    </PixelButton>
                                  )}

                                  {!armor.owned && coins < armor.price && (
                                    <PixelText as="p" size="xs" className="text-red-500 mt-1 text-center">
                                      ¡No tienes suficientes monedas!
                                    </PixelText>
                                  )}
                                </div>
                              </>
                            )
                          })()
                        : // Detalles de arma
                          (() => {
                            const weapon = weaponInventory.find((w) => w.id === selectedEquipment)
                            if (!weapon) return null

                            return (
                              <>
                                <div className="text-center mb-3">
                                  <span className="text-4xl block mb-2">{weapon.icon}</span>
                                  <PixelText as="h4" size="lg" className="font-bold">
                                    {weapon.name}
                                  </PixelText>
                                  {weapon.equipped ? (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                                    >
                                      Equipado
                                    </PixelText>
                                  ) : weapon.owned ? (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded"
                                    >
                                      En inventario
                                    </PixelText>
                                  ) : (
                                    <PixelText
                                      as="span"
                                      size="xs"
                                      className="inline-block mt-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
                                    >
                                      No adquirido
                                    </PixelText>
                                  )}
                                </div>

                                <div className="bg-purple-50 p-3 rounded-lg mb-3 worn-effect">
                                  <PixelText as="p" size="sm" className="text-gray-700 mb-3">
                                    {weapon.description}
                                  </PixelText>

                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <PixelText as="span" size="sm" className="flex items-center">
                                        <Sword className="w-4 h-4 text-red-500 mr-1" /> Ataque
                                      </PixelText>
                                      {renderStatBars(weapon.attack, 25, "bg-red-500")}
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <PixelText as="span" size="sm" className="flex items-center">
                                        <Zap className="w-4 h-4 text-yellow-500 mr-1" /> Crítico
                                      </PixelText>
                                      {renderStatBars(weapon.critChance, 15, "bg-yellow-500")}
                                    </div>

                                    {weapon.elementalBonus && (
                                      <div className="mt-2 text-sm">
                                        <PixelText as="span" className="font-medium">
                                          Bonus Elemental:
                                        </PixelText>{" "}
                                        <PixelText
                                          as="span"
                                          className={`${
                                            weapon.elementalBonus === "fire"
                                              ? "text-red-600"
                                              : weapon.elementalBonus === "water"
                                                ? "text-blue-600"
                                                : "text-green-600"
                                          }`}
                                        >
                                          {weapon.elementalBonus === "fire"
                                            ? "Fuego 🔥"
                                            : weapon.elementalBonus === "water"
                                              ? "Agua 💧"
                                              : "Tierra 🌱"}
                                        </PixelText>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-auto">
                                  {weapon.owned ? (
                                    <PixelButton
                                      onClick={() => equipItem("weapon", weapon.id)}
                                      className="w-full"
                                      variant="success"
                                      disabled={weapon.equipped}
                                    >
                                      {weapon.equipped ? "Equipado" : "Equipar"}
                                    </PixelButton>
                                  ) : (
                                    <PixelButton
                                      onClick={() => buyEquipment("weapon", weapon.id)}
                                      className="w-full"
                                      disabled={coins < weapon.price}
                                    >
                                      Comprar por {weapon.price} 🪙
                                    </PixelButton>
                                  )}

                                  {!weapon.owned && coins < weapon.price && (
                                    <PixelText as="p" size="xs" className="text-red-500 mt-1 text-center">
                                      ¡No tienes suficientes monedas!
                                    </PixelText>
                                  )}
                                </div>
                              </>
                            )
                          })()}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <Info className="w-12 h-12 text-purple-300 mb-2" />
                      <PixelText as="p" className="text-gray-500">
                        Selecciona un {equipmentCategory === "armor" ? "armadura" : "arma"} para ver sus detalles
                      </PixelText>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4">
          <PixelButton
            onClick={feedPet}
            className="flex items-center justify-center"
            size="md"
            icon={<Utensils className="w-4 h-4 mr-2" />}
          >
            Alimentar
          </PixelButton>

          <PixelButton
            onClick={playWithPet}
            className="flex items-center justify-center"
            size="md"
            icon={<Gamepad2 className="w-4 h-4 mr-2" />}
          >
            Jugar
          </PixelButton>

          <PixelButton
            onClick={cleanPet}
            className="flex items-center justify-center"
            size="md"
            icon={<Shower className="w-4 h-4 mr-2" />}
          >
            Limpiar
          </PixelButton>

          <PixelButton
            onClick={trainPet}
            className="flex items-center justify-center"
            size="md"
            icon={<Dumbbell className="w-4 h-4 mr-2" />}
          >
            Entrenar
          </PixelButton>
        </div>

        <PixelButton onClick={startCombat} className="w-full mt-4" size="lg" icon={<Swords className="w-4 h-4 mr-2" />}>
          ¡Al Combate!
        </PixelButton>
      </Card>
    </div>
  )
}
