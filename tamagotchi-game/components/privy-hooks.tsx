"use client"

import { useEffect } from "react"
import { usePrivy, useLogin } from "@privy-io/react-auth"

interface PrivyHooksProps {
  onReady: (ready: boolean) => void
  onAuthenticated: (authenticated: boolean) => void
  onLoading: (loading: boolean) => void
  onUser: (user: any) => void
  onLogin?: (login: any) => void
  onLogout?: (logout: any) => void
}

export default function PrivyHooks({
  onReady,
  onAuthenticated,
  onLoading,
  onUser,
  onLogin,
  onLogout,
}: PrivyHooksProps) {
  const { ready, authenticated, user, loading, logout } = usePrivy()
  const { login } = useLogin()

  useEffect(() => {
    onReady(ready)
    onAuthenticated(authenticated)
    onLoading(loading)
    onUser(user)
    if (onLogin) onLogin(login)
    if (onLogout) onLogout(logout)
  }, [
    ready,
    authenticated,
    loading,
    user,
    login,
    logout,
    onReady,
    onAuthenticated,
    onLoading,
    onUser,
    onLogin,
    onLogout,
  ])

  // Este componente no renderiza nada visible
  return null
}
