import PixelWalletLogin from "@/components/pixel-wallet-login"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pixel-background"></div>
      </div>
      <div className="z-10 w-full max-w-md">
        <PixelWalletLogin />
      </div>
    </main>
  )
}
