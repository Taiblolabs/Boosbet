"use client"

import { useEffect, useRef } from "react"

export default function YuboBlueGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Definir colores
    const mainColor = "#4287f5" // Azul
    const outlineColor = "#000000" // Negro
    const eyeColor = "#000000" // Negro
    const eyeHighlightColor = "#FFFFFF" // Blanco
    const orbColor = "#FFD700" // Dorado
    const orbHighlightColor = "#FFFFFF" // Blanco

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Función para dibujar un pixel
    const drawPixel = (x: number, y: number, color: string, size = 4) => {
      ctx.fillStyle = color
      ctx.fillRect(x * size, y * size, size, size)
    }

    // Dibujar contorno
    for (let y = 5; y < 25; y++) {
      for (let x = 5; x < 25; x++) {
        // Contorno exterior
        if (
          (y === 5 && x >= 8 && x <= 21) || // Top
          (y === 24 && x >= 8 && x <= 21) || // Bottom
          (x === 5 && y >= 8 && y <= 21) || // Left
          (x === 24 && y >= 8 && y <= 21) || // Right
          // Esquinas redondeadas
          (y === 6 && (x === 7 || x === 22)) ||
          (y === 7 && (x === 6 || x === 23)) ||
          (y === 22 && (x === 6 || x === 23)) ||
          (y === 23 && (x === 7 || x === 22))
        ) {
          drawPixel(x, y, outlineColor)
        }
      }
    }

    // Dibujar cuerpo principal
    for (let y = 6; y < 24; y++) {
      for (let x = 6; x < 24; x++) {
        if (
          !(
            (y === 6 && (x <= 6 || x >= 23)) ||
            (y === 23 && (x <= 6 || x >= 23)) ||
            (x === 6 && (y <= 6 || y >= 23)) ||
            (x === 23 && (y <= 6 || y >= 23))
          )
        ) {
          drawPixel(x, y, mainColor)
        }
      }
    }

    // Dibujar ojos
    // Ojo izquierdo
    for (let y = 10; y < 14; y++) {
      for (let x = 10; x < 14; x++) {
        drawPixel(x, y, eyeColor)
      }
    }
    drawPixel(11, 11, eyeHighlightColor)

    // Ojo derecho
    for (let y = 10; y < 14; y++) {
      for (let x = 16; x < 20; x++) {
        drawPixel(x, y, eyeColor)
      }
    }
    drawPixel(17, 11, eyeHighlightColor)

    // Dibujar sonrisa
    for (let x = 12; x < 18; x++) {
      drawPixel(x, 16, outlineColor)
    }

    // Dibujar orbe dorado
    for (let y = 18; y < 22; y++) {
      for (let x = 12; x < 18; x++) {
        drawPixel(x, y, orbColor)
      }
    }
    drawPixel(13, 19, orbHighlightColor)

    // Convertir el canvas a una imagen
    const dataUrl = canvas.toDataURL("image/png")

    // Crear un enlace para descargar la imagen
    const link = document.createElement("a")
    link.download = "yubo-blue.png"
    link.href = dataUrl

    // Opcional: Añadir el enlace al DOM y hacer clic automáticamente
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  }, [])

  return (
    <div className="hidden">
      <canvas ref={canvasRef} width="120" height="120"></canvas>
    </div>
  )
}
