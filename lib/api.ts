// lib/api.ts
import { auth } from "./firebase"

export type UserProfile = {
  full_name: string
  email: string
  sign: string
  news: boolean
}

// Récupérer le token Firebase si dispo
async function getToken(): Promise<string | null> {
  const user = auth.currentUser
  return user ? await user.getIdToken() : null
}

// Wrapper fetch qui ajoute automatiquement le token
async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers || {}),
  }

  const r = await fetch(url, { ...init, headers })
  if (!r.ok) {
    const msg = await r.text().catch(() => "")
    throw new Error(msg || `HTTP ${r.status}`)
  }
  return (await r.json()) as T
}

/* --------------------
   PROFIL
-------------------- */
export async function getProfile(): Promise<UserProfile> {
  return jsonFetch<UserProfile>("/api/get-profile")
}

export async function saveProfile(profile: UserProfile): Promise<{ status: "ok" }> {
  return jsonFetch<{ status: "ok" }>("/api/save-profile", {
    method: "POST",
    body: JSON.stringify(profile),
  })
}

/* --------------------
   ANALYSE GEVA-Sco
-------------------- */
export async function analyze(notes: string): Promise<any> {
  return jsonFetch<any>("/api/analyzeGevasco", {
    method: "POST",
    body: JSON.stringify({ notes }),
  })
}

/* --------------------
   FORMS
-------------------- */
export async function listForms(): Promise<any[]> {
  return jsonFetch<any[]>("/api/forms")
}

export async function saveForm(form_key: string, draft_id: string, form_data: any): Promise<{ status: "ok" }> {
  return jsonFetch<{ status: "ok" }>("/api/forms", {
    method: "POST",
    body: JSON.stringify({ form_key, draft_id, form_data }),
  })
}

export async function getForm(id: number): Promise<any> {
  return jsonFetch<any>(`/api/forms/${id}`)
}

export async function deleteForm(id: number): Promise<{ status: "deleted" }> {
  return jsonFetch<{ status: "deleted" }>(`/api/forms/${id}`, {
    method: "DELETE",
  })
}

/* --------------------
   FORMS
-------------------- */

// --- Types de réponses ---
export type PdfSubmitResp = { job_id: string; status: string }
export type PdfStatusResp = { status: "pending" | "done" | "error"; download_url?: string; error?: string }

// --- Soumission TypeB (feuille d’émargement) ---
export async function submitEmargement(payload: Record<string, any>): Promise<PdfSubmitResp> {
  return jsonFetch<PdfSubmitResp>("/api/pdf/submit", {
    method: "POST",
    body: JSON.stringify({ doc_type: "feuillePresence", ...payload }),
  })
}
// --- Soumission Type A (bordereau) ---
export async function submitBordereau(payload: Record<string, any>): Promise<PdfSubmitResp> {
  return jsonFetch<PdfSubmitResp>("/api/pdf/submit", {
    method: "POST",
    body: JSON.stringify({ doc_type: "bordereau", ...payload }),
  })
}

// --- Suivi du job ---
export async function getPdfStatus(jobId: string): Promise<PdfStatusResp> {
  return jsonFetch<PdfStatusResp>(`/api/pdf/status/${jobId}`)
}

// --- URL directe (utile si cookie serveur côté backend). 
// Attention: <a href> n’ajoute PAS le header Authorization.
export function pdfDownloadUrl(jobId: string) {
  return `/api/pdf/download/${jobId}`
}

// --- Téléchargement avec header Authorization (blob) ---
export async function downloadPdf(jobId: string): Promise<Blob> {
  const token = await getToken()
  const headers = new Headers()
  headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`/api/pdf/download/${jobId}`, {
    method: "GET",
    headers,
    credentials: "include",
  })
  if (!res.ok) {
    try {
      const data = await res.json() as any
      throw new Error(data?.detail || data?.error || `${res.status} ${res.statusText}`)
    } catch {
      throw new Error(`${res.status} ${res.statusText}`)
    }
  }
  return res.blob()
}

// --- Helper pour déclencher un téléchargement côté client ---
export async function savePdf(jobId: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken()
  const headers = new Headers()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`/api/pdf/download/${jobId}`, {
    headers,
    credentials: "include",
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

  // 🔹 récupérer le nom du fichier dans Content-Disposition
  const disp = res.headers.get("Content-Disposition") || ""
  const match = /filename\\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/i.exec(disp)
  const suggested = decodeURIComponent(match?.[1] || match?.[2] || `${jobId}.pdf`)

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement("a")
    a.href = url
    a.download = suggested   // ✅ nom conforme au backend
    document.body.appendChild(a)
    a.click()
    a.remove()
  } finally {
    URL.revokeObjectURL(url)
  }
}

