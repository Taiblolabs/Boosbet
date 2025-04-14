import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  // Obtener los parámetros de la URL
  const privyUserId = requestUrl.searchParams.get("privy_user_id")
  const walletAddress = requestUrl.searchParams.get("wallet_address")

  // Aquí podrías guardar estos datos en tu base de datos si lo necesitas
  console.log("Privy User ID:", privyUserId)
  console.log("Wallet Address:", walletAddress)

  // Redirigir al juego
  return NextResponse.redirect(new URL("/game", request.url))
}
