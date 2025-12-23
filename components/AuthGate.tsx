import type { User } from 'firebase/auth'

export default function AuthGate({ user, onLogin }: { user: User | null, onLogin: ()=>Promise<any> }) {
  if (user) return null
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-black/5 p-6 space-y-2">
      <p className="mb-4">Connectez-vous pour utiliser l’outil :</p>
      <button
        onClick={onLogin}
        className="px-4 py-2 rounded-xl border shadow-sm"
      >
        Se connecter avec Google
      </button>
    </div>
  )
}
