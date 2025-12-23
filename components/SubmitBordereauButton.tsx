// src/components/SubmitBordereauButton.tsx
import { useState } from "react"
import { submitBordereau } from "../lib/api"

export default function SubmitBordereauButton({
  data,
  onSubmitted,
}: {
  data: Record<string, any>
  onSubmitted: (jobId: string) => void
}) {
  const [loading, setLoading] = useState(false)

  // Nom obligatoire pour éviter les PDF anonymes
  const disabled = !data?.nom || loading

  const run = async () => {
    if (!data?.nom) {
      alert("Merci de saisir au moins le nom de l’élève avant de générer le PDF.")
      return
    }
    try {
      setLoading(true)
      const res = await submitBordereau(data)
      const jobId = (res as any).job_id ?? (res as any).jobId
      if (!jobId) {
        throw new Error("Réponse du serveur invalide (job_id manquant).")
      }
      onSubmitted(jobId)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || "Erreur lors de la soumission du bordereau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={run}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-300 bg-neutral-100/90 hover:bg-neutral-200 disabled:opacity-50 text-sm"
      >
        {loading ? "Soumission…" : "Générer le PDF"}
      </button>
    </div>
  )
}
