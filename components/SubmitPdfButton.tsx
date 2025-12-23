// src/components/SubmitPdfButton.tsx
import { useState } from "react"
import { submitEmargement } from "../lib/api"

export default function SubmitPdfButton({
  data,
  onSubmitted,
}: {
  data: Record<string, any>
  onSubmitted: (jobId: string) => void
}) {
  const [loading, setLoading] = useState(false)

  // On impose nom + date_ess pour ce type de document
  const disabled = !data?.nom || !data?.date_ess || loading

  const run = async () => {
    if (!data?.nom || !data?.date_ess) {
      alert("Merci de renseigner le nom et la date de l’ESS avant de générer le PDF.")
      return
    }
    try {
      setLoading(true)
      const res = await submitEmargement(data)
      const jobId = (res as any).job_id ?? (res as any).jobId
      if (!jobId) {
        throw new Error("Réponse du serveur invalide (job_id manquant).")
      }
      onSubmitted(jobId)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || "Erreur lors de la soumission.")
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
