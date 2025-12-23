// src/components/ProfileModal.tsx
import { useEffect, useState } from "react"
import { getProfile, saveProfile, type UserProfile } from "../lib/api"

export default function ProfileModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    sign: "",
    news: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        const p = (await getProfile()) as UserProfile
        if (!cancelled && p) {
          setProfile(p)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [open])

  const save = async () => {
    try {
      setLoading(true)
      await saveProfile(profile)
      onClose()
    } catch (e: any) {
      console.error(e)
      alert(e?.message || "Erreur lors de l’enregistrement du profil.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-md space-y-3 border border-neutral-200">
        <h2 className="text-sm font-semibold">Mon profil</h2>

        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Nom complet</label>
            <input
              className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm bg-neutral-50"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">
              Adresse e-mail (pour rappel sur le PDF)
            </label>
            <input
              className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm bg-neutral-50"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">
              Signature / qualité (ex : « ERSEH – secteur X »)
            </label>
            <textarea
              className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm bg-neutral-50"
              rows={3}
              value={profile.sign}
              onChange={(e) =>
                setProfile({ ...profile, sign: e.target.value })
              }
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={profile.news}
              onChange={(e) =>
                setProfile({ ...profile, news: e.target.checked })
              }
            />
            <span>Recevoir les actualités</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="px-3 py-1.5 bg-neutral-200 rounded text-sm disabled:opacity-50"
          >
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}
