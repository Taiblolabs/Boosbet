import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const walletAddress = requestUrl.searchParams.get("wallet_address")
  const privyUserId = requestUrl.searchParams.get("privy_user_id")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // If we have a wallet address or Privy user ID, update the user metadata
    if (walletAddress || privyUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Update user metadata
        await supabase.auth.updateUser({
          data: {
            wallet_address: walletAddress || user.user_metadata?.wallet_address,
            privy_user_id: privyUserId || user.user_metadata?.privy_user_id,
          },
        })
      }
    }
  }

  // Redirect to the game page
  return NextResponse.redirect(new URL("/game", request.url))
}
