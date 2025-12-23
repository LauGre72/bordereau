// src/App.tsx
import { useEffect, useState, useRef } from "react"
import { auth, loginWithGoogle, logout } from "./lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"

import AuthGate from "./components/AuthGate"
import ProfileModal from "./components/ProfileModal"
import PdfJobStatusModal from "./components/PdfJobStatusModal"

import BordereauForm, {
  buildBordereauPayload,
  createEmptyBordereauDraft,
  migrateAnyToDraft,
} from "./components/BordereauForm"
import type { BordereauDraft } from "./components/BordereauForm"

import SubmitBordereauButton from "./components/SubmitBordereauButton"

export default function App() {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [profileOpen, setProfileOpen] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)

  const [draft, setDraft] = useState<BordereauDraft>(() =>
    createEmptyBordereauDraft(),
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Suivi de la session Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  // Export du brouillon en JSON
  const exportJsonFile = () => {
    try {
      const filename = `bordereau-${(draft.nom || "brouillon")
        .replace(/\s+/g, "_")
        .toLowerCase()}.json`

      const blob = new Blob([JSON.stringify(draft, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      console.error(e)
      alert("Impossible d’exporter le bordereau en JSON.")
    }
  }

  // Import d’un JSON (nouveau format ou ancien TypeAData)
  const handleJsonFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    // autoriser la re-sélection du même fichier
    e.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        const migrated = migrateAnyToDraft(data)
        if (migrated.docType !== "bordereau") {
          throw new Error("Ce fichier ne semble pas être un bordereau valide.")
        }
        setDraft(migrated)
      } catch (err: any) {
        console.error(err)
        alert("Fichier JSON invalide ou non reconnu comme un bordereau.")
      }
    }
    reader.readAsText(file)
  }

  const triggerImport = () => {
    fileInputRef.current?.click()
  }

  const resetForm = () => {
    if (
      draft.nom ||
      draft.dossierNum ||
      draft.demandes.selected.length ||
      draft.demandes.other
    ) {
      const ok = window.confirm(
        "Réinitialiser le formulaire et effacer les données en cours ?",
      )
      if (!ok) return
    }
    setDraft(createEmptyBordereauDraft())
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  const payload = buildBordereauPayload(draft)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-900">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <header className="rounded-2xl bg-white/80 backdrop-blur shadow-2xl ring-1 ring-black/5">
          <div className="px-5 py-4 flex items-center justify-between">
            <h1 className="text-[17px] font-semibold text-gray-900">
              ERSH — Aide à la création de bordereau de dépôt de dossier MDPH
            </h1>
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileOpen(true)}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  Mon profil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  Se déconnecter
                </button>
              </div>
            ) : null}
          </div>
        </header>

        {/* Zone login */}
        <AuthGate user={user} onLogin={loginWithGoogle} />

        {/* Contenu principal (uniquement si connecté) */}
        {user ? (
          <div className="space-y-4">
            <BordereauForm value={draft} onChange={setDraft} />

            {/* Barre actions JSON */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/80 rounded-xl p-3 border border-neutral-200 gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportJsonFile}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50"
                >
                  Exporter
                </button>

                <button
                  type="button"
                  onClick={triggerImport}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50"
                >
                  Importer
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-700 bg-white hover:bg-red-50"
                >
                  Réinitialiser le formulaire
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleJsonFileSelected}
                />
              </div>

              <div className="text-[11px] text-gray-500">
                Les fichiers restent uniquement en local sur votre poste.
              </div>
            </div>

            {/* Bouton de soumission PDF */}
            <SubmitBordereauButton
              data={payload}
              onSubmitted={(id) => setJobId(id)}
            />
          </div>
        ) : null}

        {/* Modales */}
        <PdfJobStatusModal jobId={jobId} onClose={() => setJobId(null)} />
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />

        {/* Footer */}
        <footer className="text-xs text-gray-500 pt-2">
          Outil d’aide à la rédaction
        </footer>
      </div>
    </div>
  )
}
