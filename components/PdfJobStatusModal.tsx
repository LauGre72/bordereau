// src/components/PdfJobStatusModal.tsx
import { useEffect, useState } from "react"
import { getPdfStatus, savePdf } from "../lib/api"

type Status = "pending" | "done" | "error" | null

export default function PdfJobStatusModal({
  jobId,
  onClose,
}: {
  jobId: string | null
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!jobId) {
      setStatus(null)
      setError("")
      return
    }

    let cancelled = false

    const tick = async () => {
      try {
        const res = await getPdfStatus(jobId)
        if (cancelled) return
        const s = (res as any).status as Status
        setStatus(s)
        if (s === "error") {
          setError((res as any).error || "Erreur lors de la génération du PDF.")
        }
        if (s === "pending") {
          setTimeout(tick, 2000)
        }
      } catch (e: any) {
        if (cancelled) return
        console.error(e)
        setStatus("error")
        setError(e?.message || "Erreur réseau lors du suivi de la génération.")
      }
    }

    setStatus("pending")
    setError("")
    tick()

    return () => {
      cancelled = true
    }
  }, [jobId])

  if (!jobId) return null

  const message =
    status === "pending"
      ? "Votre PDF est en cours de génération…"
      : status === "done"
      ? "Votre PDF est prêt."
      : status === "error"
      ? "Une erreur est survenue lors de la génération du PDF."
      : ""

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-md space-y-3 border border-neutral-200">
        <h2 className="text-sm font-semibold">Génération du PDF</h2>
        <p className="text-sm text-gray-700">{message}</p>

        {status === "error" && error && (
          <p className="text-xs text-red-600 whitespace-pre-line border border-red-100 bg-red-50 rounded-lg p-2">
            {error}
          </p>
        )}

        {status === "done" && (
          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={() => savePdf(jobId)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm bg-neutral-100 hover:bg-neutral-200"
            >
              Télécharger
            </button>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
