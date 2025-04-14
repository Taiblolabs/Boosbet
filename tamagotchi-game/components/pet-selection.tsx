"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import PixelButton from "./pixel-button"
import PixelText from "./pixel-text"

type PetSelectionProps = {
  onSelectPet: (petType: "yubo-green" | "yubo-pink" | "yubo-blue") => void
}

export default function PetSelection({ onSelectPet }: PetSelectionProps) {
  return (
    <div className="w-full max-w-md">
      <Card className="p-6 shadow-xl bg-[hsl(var(--background))] rounded-xl crt-effect pixel-border border-2 border-[hsl(var(--border))]">
        <div className="text-center mb-6">
          <PixelText as="h2" size="xl" className="text-[hsl(var(--primary))] font-bold">
            Elige tu YUBO
          </PixelText>
          <PixelText size="sm" className="text-[hsl(var(--muted-foreground))] mt-2">
            Selecciona el tipo de YUBO que quieres cuidar
          </PixelText>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center mb-2 bg-green-400 rounded-lg overflow-hidden pixel-art border-2 border-[hsl(var(--border))]">
              <Image
                src="/images/yubo-green.png"
                alt="YUBO Verde"
                width={32}
                height={32}
                className="w-16 h-16 object-contain pixel-art"
              />
            </div>
            <div className="text-center mb-2">
              <PixelText as="span" size="sm" className="font-bold text-[hsl(var(--foreground))]">
                YUBO Verde
              </PixelText>
              <PixelText as="p" size="xs" className="text-[hsl(var(--muted-foreground))]">
                Resistente
              </PixelText>
            </div>
            <PixelButton onClick={() => onSelectPet("yubo-green")} size="sm">
              Elegir
            </PixelButton>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center mb-2 bg-pink-400 rounded-lg overflow-hidden pixel-art border-2 border-[hsl(var(--border))]">
              <Image
                src="/images/yubo-pink.png"
                alt="YUBO Rosa"
                width={32}
                height={32}
                className="w-16 h-16 object-contain pixel-art"
              />
            </div>
            <div className="text-center mb-2">
              <PixelText as="span" size="sm" className="font-bold text-[hsl(var(--foreground))]">
                YUBO Rosa
              </PixelText>
              <PixelText as="p" size="xs" className="text-[hsl(var(--muted-foreground))]">
                Rápido
              </PixelText>
            </div>
            <PixelButton onClick={() => onSelectPet("yubo-pink")} size="sm">
              Elegir
            </PixelButton>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center mb-2 bg-blue-400 rounded-lg overflow-hidden pixel-art border-2 border-[hsl(var(--border))]">
              <Image
                src="/images/yubo-blue.png"
                alt="YUBO Azul"
                width={32}
                height={32}
                className="w-16 h-16 object-contain pixel-art"
              />
            </div>
            <div className="text-center mb-2">
              <PixelText as="span" size="sm" className="font-bold text-[hsl(var(--foreground))]">
                YUBO Azul
              </PixelText>
              <PixelText as="p" size="xs" className="text-[hsl(var(--muted-foreground))]">
                Fuerte en ataque
              </PixelText>
            </div>
            <PixelButton onClick={() => onSelectPet("yubo-blue")} size="sm">
              Elegir
            </PixelButton>
          </div>
        </div>

        <div className="text-center text-sm text-[hsl(var(--muted-foreground))] worn-effect bg-[hsl(var(--accent))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <PixelText size="sm">Cada YUBO tiene características únicas que afectarán su desarrollo.</PixelText>
          <PixelText size="sm" className="mt-2 font-medium">
            Los YUBOs son criaturas pixeladas con habilidades elementales.
          </PixelText>
        </div>
      </Card>
    </div>
  )
}
