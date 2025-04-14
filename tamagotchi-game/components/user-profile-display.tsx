"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, User, X, Edit, Save } from "lucide-react"
import Image from "next/image"
import type { UserProfile } from "./user-profile-selection"
import PixelButton from "./pixel-button"

type UserProfileDisplayProps = {
  profile: UserProfile
  onClose: () => void
  onUpdateProfile: (profile: UserProfile) => void
}

export default function UserProfileDisplay({ profile, onClose, onUpdateProfile }: UserProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [description, setDescription] = useState(profile.description)
  const [nameError, setNameError] = useState("")

  const handleSave = () => {
    if (!name.trim()) {
      setNameError("Por favor, introduce un nombre")
      return
    }

    onUpdateProfile({
      ...profile,
      name: name.trim(),
      description: description.trim(),
    })
    setIsEditing(false)
  }

  // Función para renderizar el avatar
  const renderAvatar = () => {
    if (profile.customAvatar) {
      return (
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={profile.customAvatar || "/placeholder.svg"}
            alt={profile.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )
    } else {
      return (
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
          {profile.avatar}
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-purple-700 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Perfil de Entrenador
          </h2>
          <PixelButton size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </PixelButton>
        </div>

        <div className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Entrenador
                </label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setNameError("")
                  }}
                  className={nameError ? "border-red-500" : ""}
                />
                {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <PixelButton
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setName(profile.name)
                    setDescription(profile.description)
                  }}
                >
                  Cancelar
                </PixelButton>
                <PixelButton onClick={handleSave} icon={<Save className="w-4 h-4 mr-2" />}>
                  Guardar
                </PixelButton>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                {renderAvatar()}
                <div className="ml-4">
                  <h3 className="text-lg font-bold">{profile.name}</h3>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar perfil
                  </PixelButton>
                </div>
              </div>

              {profile.description && (
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{profile.description}</p>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Registro de Batallas
                </h4>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-600">Victorias</p>
                    <p className="text-xl font-bold text-green-600">{profile.battleRecords.wins}</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-600">Derrotas</p>
                    <p className="text-xl font-bold text-red-600">{profile.battleRecords.losses}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-600">Experiencia</p>
                    <p className="text-xl font-bold text-blue-600">{profile.battleRecords.totalExperience}</p>
                  </div>
                </div>

                {profile.battleRecords.wins + profile.battleRecords.losses > 0 && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Ratio de victorias:{" "}
                      {Math.round(
                        (profile.battleRecords.wins / (profile.battleRecords.wins + profile.battleRecords.losses)) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
