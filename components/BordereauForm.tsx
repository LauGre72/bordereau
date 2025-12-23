import { useCallback } from "react"

// -----------------------------
// Constantes & types génériques
// -----------------------------

export const BORDEREAU_SCHEMA_VERSION = 1

export type MultiSelectWithFree<T extends string> = {
  selected: T[]
  other: string
}

// Demandes adressées à la MDPH / école / etc.
const DEMANDES_OPTIONS = [
  { id: "aesh", label: "AESH" },
  { id: "aesh_ulis", label: "AESH collectif (ULIS)" },
  { id: "ordi", label: "Ordinateur portable" },
  { id: "tablette", label: "Tablette" },
  {
    id: "logiciel",
    label: "Logiciel spécifique (ex : dictée vocale)",
  },
  {
    id: "materiel_adapte",
    label: "Matériel pédagogique adapté",
  },
  { id: "ulis_ecole", label: "ULIS école" },
  { id: "ulis_college", label: "ULIS collège" },
  { id: "ulis_lycee", label: "ULIS lycée" },
  { id: "segpa", label: "SEGPA" },
  { id: "erea", label: "EREA" },
  { id: "maintien_maternelle", label: "Maintien en maternelle" },
  {
    id: "enseignement_amenage",
    label: "Enseignement ordinaire avec aménagements",
  },
  { id: "sessad", label: "SESSAD" },
  { id: "ime", label: "IME" },
  { id: "iem", label: "IEM" },
  { id: "itep", label: "ITEP" },
  { id: "ies", label: "IES" },
  { id: "safe", label: "SAFE" },
  { id: "camsp", label: "CAMSP" },
  { id: "cmpp", label: "CMPP" },
  { id: "cmp", label: "CMP" },
  {
    id: "ue_ems",
    label: "UE (Unité d’Enseignement en EMS)",
  },
  {
    id: "transport_adapte",
    label: "Transport scolaire adapté",
  },
  {
    id: "indemnisation_transport",
    label: "Indemnisation de transport",
  },
  {
    id: "amen_exam",
    label: "Aménagements d’examen (DNB, Bac…)",
  },
  {
    id: "pai_pap",
    label: "Mise en place d’un PAI / PAP",
  },
  {
    id: "temps_majore",
    label: "Temps majoré ou secrétariat aux épreuves",
  },
  { id: "aeeh", label: "AEEH" },
  { id: "pch", label: "PCH" },
  { id: "cmi", label: "CMI" },
] as const

export type DemandeId = (typeof DEMANDES_OPTIONS)[number]["id"]

// Pièces d’identité
const PI_OPTIONS = [
  { id: "ci_eleve", label: "Carte d’identité élève" },
  { id: "pass_eleve", label: "Passeport élève" },
  { id: "livret_famille", label: "Livret de famille" },
  { id: "extrait_naissance", label: "Extrait d’acte de naissance" },
  {
    id: "ci_parent1",
    label: "Carte d’identité représentant légal (Parent 1)",
  },
  {
    id: "ci_parent2",
    label: "Carte d’identité représentant légal (Parent 2)",
  },
  {
    id: "pass_parent1",
    label: "Passeport représentant légal (Parent 1)",
  },
  {
    id: "pass_parent2",
    label: "Passeport représentant légal (Parent 2)",
  },
  {
    id: "jugement_divorce",
    label: "Jugement de divorce / autorité parentale",
  },
  {
    id: "delegation_parentale",
    label: "Attestation de délégation parentale",
  },
  { id: "tutelle", label: "Tutelle / curatelle" },
  { id: "titre_sejour", label: "Titre de séjour" },
  {
    id: "ofpra",
    label: "Attestation OFPRA / réfugié",
  },
  {
    id: "doc_provisoire",
    label: "Document provisoire (préfecture)",
  },
  {
    id: "identite_mecs",
    label: "Identité transmise par établissement / MECS",
  },
] as const

export type PiId = (typeof PI_OPTIONS)[number]["id"]

// Justificatifs de domicile
const JD_OPTIONS = [
  { id: "facture_elec", label: "Facture d’électricité" },
  { id: "facture_gaz", label: "Facture de gaz" },
  { id: "facture_eau", label: "Facture d’eau" },
  {
    id: "facture_tel",
    label: "Facture de téléphone / box",
  },
  {
    id: "quittance_loyer",
    label: "Quittance de loyer (organisme social ou agence)",
  },
  {
    id: "attestation_hebergement",
    label: "Attestation d’hébergement",
  },
  {
    id: "jd_parents",
    label: "Justificatif de domicile des représentants légaux",
  },
  { id: "titre_propriete", label: "Titre de propriété" },
  { id: "bail", label: "Bail locatif" },
  {
    id: "attestation_caf",
    label: "Attestation CAF de résidence",
  },
  {
    id: "courrier_mairie",
    label: "Courrier mairie / CCAS",
  },
  {
    id: "hebergement_mecs",
    label: "Hébergement en foyer / MECS",
  },
  {
    id: "rib_adresse",
    label: "RIB avec adresse",
  },
] as const

export type JdId = (typeof JD_OPTIONS)[number]["id"]

// -----------------------------
// Modèle d’édition (JSON local)
// -----------------------------

export interface BordereauDraft {
  schemaVersion: number
  docType: "bordereau"

  nom: string
  dateNais: string

  dossierNum: string
  typeDemande: "" | "Première demande" | "Réexamen" | "Autre"

  demandes: MultiSelectWithFree<DemandeId>
  pi: MultiSelectWithFree<PiId>
  jd: MultiSelectWithFree<JdId>

  cerfa: boolean
  certMed: string

  hasGevaSco: boolean
  dateGevaSco: string
  typeReunion: "" | "ESS" | "Equipe éducative"

  hasLpi: boolean
  numLpi: string

  hasPsy: boolean
  psy: string

  hasAutre: boolean
  autre: string
}

// -----------------------------
// Modèle pour le backend / PDF
// -----------------------------

export type TypeAData = {
  doc_type: "bordereau"
  typedemande?: string | null
  dossier_num?: string | null
  nom: string
  date_nais?: string | null
  demandes?: string | null
  CERFA?: boolean
  PI?: string | null
  JD?: string | null
  cert_med?: string | null
  HAS_GEVASco?: boolean
  date_geva_sco?: string | null
  HAS_LPI?: boolean
  NUM_LPI?: string | null
  type_reunion?: string | null
  HAS_PSY?: boolean
  PSY?: string | null
  HAS_AUTRE?: boolean
  AUTRE?: string | null
}

// -----------------------------
// Helpers de formatage / migration
// -----------------------------

function splitLines(str: string): string[] {
  return str
    .split(/\r?\n/)
    .map((s) => s.replace(/^\*+\s*/, "").trim())
    .filter(Boolean)
}

function bullets(lines: string[]): string {
  const clean = lines.map((s) => s.trim()).filter(Boolean)
  if (!clean.length) return ""
  const uniq = Array.from(new Set(clean))
  return uniq.map((l) => `* ${l}`).join("\n")
}

function decodeMultiSelectFromString<T extends string>(
  serialized: string | null | undefined,
  options: readonly { id: T; label: string }[],
): MultiSelectWithFree<T> {
  if (!serialized) {
    return { selected: [], other: "" }
  }

  const lines = splitLines(serialized)
  const selected: T[] = []
  const other: string[] = []

  for (const line of lines) {
    const found = options.find((o) => o.label === line)
    if (found) {
      selected.push(found.id)
    } else {
      other.push(line)
    }
  }

  return {
    selected,
    other: other.join("\n"),
  }
}

// -----------------------------
// Fabrique & migration
// -----------------------------

export function createEmptyBordereauDraft(): BordereauDraft {
  return {
    schemaVersion: BORDEREAU_SCHEMA_VERSION,
    docType: "bordereau",

    nom: "",
    dateNais: "",

    dossierNum: "",
    typeDemande: "",

    demandes: { selected: [], other: "" },
    pi: { selected: [], other: "" },
    jd: { selected: [], other: "" },

    cerfa: false,
    certMed: "",

    hasGevaSco: false,
    dateGevaSco: "",
    typeReunion: "",
	
	hasLpi: false,
	numLpi: "",

    hasPsy: false,
    psy: "",

    hasAutre: false,
    autre: "",
  }
}

/**
 * Migration générique :
 * - si on reçoit déjà un BordereauDraft → on complète avec des valeurs par défaut
 * - si on reçoit un ancien TypeAData (doc_type: "bordereau") → on reconstruit le draft
 * - sinon → on renvoie un draft vide
 */
export function migrateAnyToDraft(input: any): BordereauDraft {
  if (input && input.docType === "bordereau" && typeof input.schemaVersion === "number") {
    // Nouveau format : on merge avec un brouillon vide pour garantir tous les champs.
    const base = createEmptyBordereauDraft()
    return {
      ...base,
      ...input,
      demandes: {
        ...base.demandes,
        ...(input.demandes ?? {}),
      },
      pi: {
        ...base.pi,
        ...(input.pi ?? {}),
      },
      jd: {
        ...base.jd,
        ...(input.jd ?? {}),
      },
    }
  }

  if (input && input.doc_type === "bordereau") {
    // Ancien format TypeAData
    const base = createEmptyBordereauDraft()
    return {
      ...base,
      nom: input.nom ?? "",
      dateNais: input.date_nais ?? "",
      dossierNum: input.dossier_num ?? "",
      typeDemande: input.typedemande ?? "",
      demandes: decodeMultiSelectFromString(input.demandes, DEMANDES_OPTIONS),
      pi: decodeMultiSelectFromString(input.PI, PI_OPTIONS),
      jd: decodeMultiSelectFromString(input.JD, JD_OPTIONS),
      cerfa: !!input.CERFA,
      certMed: input.cert_med ?? "",
      hasGevaSco: !!input.HAS_GEVASco,
      dateGevaSco: input.date_geva_sco ?? "",
      hasLpi: !!input.HAS_LPI,
      numLpi: input.NUM_LPI ?? "",	  
      typeReunion: input.type_reunion ?? "",
      hasPsy: !!input.HAS_PSY,
      psy: input.PSY ?? "",
      hasAutre: !!input.HAS_AUTRE,
      autre: input.AUTRE ?? "",
    }
  }

  // Fichier inconnu → on repart sur un brouillon vide
  return createEmptyBordereauDraft()
}

/**
 * Conversion du modèle d’édition → modèle pour le backend / PDF.
 */
export function buildBordereauPayload(draft: BordereauDraft): TypeAData {
  const toLines = <T extends string>(
    ms: MultiSelectWithFree<T>,
    options: readonly { id: T; label: string }[],
  ): string[] => {
    const selectedLabels = ms.selected
      .map((id) => options.find((o) => o.id === id)?.label)
      .filter((x): x is string => !!x)
    const otherLines = splitLines(ms.other)
    return [...selectedLabels, ...otherLines]
  }

  return {
    doc_type: "bordereau",
    typedemande: draft.typeDemande || null,
    dossier_num: draft.dossierNum || null,
    nom: draft.nom,
    date_nais: draft.dateNais || null,
    demandes: bullets(toLines(draft.demandes, DEMANDES_OPTIONS)),
    CERFA: !!draft.cerfa,
    PI: bullets(toLines(draft.pi, PI_OPTIONS)),
    JD: bullets(toLines(draft.jd, JD_OPTIONS)),
    cert_med: draft.certMed || null,
    HAS_GEVASco: !!draft.hasGevaSco,
    date_geva_sco: draft.dateGevaSco || null,
    HAS_LPI: !!draft.hasLpi,
    NUM_LPI: draft.numLpi || null,	
    type_reunion: draft.typeReunion || null,
    HAS_PSY: !!draft.hasPsy,
    PSY: draft.psy || null,
    HAS_AUTRE: !!draft.hasAutre,
    AUTRE: draft.autre || null,
  }
}

// -----------------------------
// Composants UI
// -----------------------------

type MultiSelectWithTextProps<T extends string> = {
  label: string
  options: readonly { id: T; label: string }[]
  value: MultiSelectWithFree<T>
  onChange: (v: MultiSelectWithFree<T>) => void
  disabled?: boolean
}

function MultiSelectWithText<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: MultiSelectWithTextProps<T>) {
  const toggle = (id: T) => {
    if (disabled) return
    const set = new Set(value.selected)
    set.has(id) ? set.delete(id) : set.add(id)
    onChange({ ...value, selected: Array.from(set) })
  }

  const inputClass =
    "w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50 text-sm"

  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer select-none ${
              value.selected.includes(opt.id)
                ? "bg-neutral-100 border-neutral-300"
                : "bg-white border-neutral-200"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              type="checkbox"
              className="h-4 w-4"
              disabled={disabled}
              checked={value.selected.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      <textarea
        className={inputClass}
        rows={3}
        disabled={disabled}
        placeholder="Compléter librement (une ligne par élément)…"
        value={value.other}
        onChange={(e) => onChange({ ...value, other: e.target.value })}
      />
    </div>
  )
}

// -----------------------------
// Formulaire principal
// -----------------------------

type BordereauFormProps = {
  value: BordereauDraft
  onChange: (value: BordereauDraft) => void
}

export default function BordereauForm({ value, onChange }: BordereauFormProps) {
  const input = "w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50 text-sm"
  const block = "flex flex-col gap-1.5"

  const update = useCallback(
    <K extends keyof BordereauDraft>(key: K, val: BordereauDraft[K]) => {
      onChange({ ...value, [key]: val })
    },
    [value, onChange],
  )

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-black/5 p-6 space-y-6">
      <h2 className="text-[15px] font-semibold text-gray-900">
        Bordereau de dépôt de dossier
      </h2>

      {/* Identité / en-tête */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={block}>
          <span className="text-sm text-gray-700">Dossier n°</span>
          <input
            className={input}
            value={value.dossierNum}
            onChange={(e) => update("dossierNum", e.target.value)}
          />
        </label>

        <label className={block}>
          <span className="text-sm text-gray-700">Type de demande</span>
          <select
            className={input}
            value={value.typeDemande}
            onChange={(e) =>
              update(
                "typeDemande",
                e.target.value as BordereauDraft["typeDemande"],
              )
            }
          >
            <option value="">— Choisir —</option>
            <option value="Première demande">Première demande</option>
            <option value="Réexamen">Réexamen</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <label className={block}>
          <span className="text-sm text-gray-700">NOM et prénom</span>
          <input
            className={input}
            placeholder="Nom Prénom"
            value={value.nom}
            onChange={(e) => update("nom", e.target.value)}
          />
        </label>

        <label className={block}>
          <span className="text-sm text-gray-700">Date de naissance</span>
          <input
            type="date"
            className={input}
            value={value.dateNais}
            onChange={(e) => update("dateNais", e.target.value)}
          />
        </label>
      </div>

      {/* Demandes */}
      <MultiSelectWithText
        label="Nature des demandes"
        options={DEMANDES_OPTIONS}
        value={value.demandes}
        onChange={(v) => update("demandes", v)}
      />

      {/* Pièces & justificatifs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            id="CERFA"
            type="checkbox"
            checked={value.cerfa}
            onChange={(e) => update("cerfa", e.target.checked)}
          />
          <label htmlFor="CERFA" className="text-sm">
            Formulaire CERFA famille
          </label>
        </div>

        <MultiSelectWithText
          label="Pièces d’identité"
          options={PI_OPTIONS}
          value={value.pi}
          onChange={(v) => update("pi", v)}
        />

        <MultiSelectWithText
          label="Justificatifs de domicile"
          options={JD_OPTIONS}
          value={value.jd}
          onChange={(v) => update("jd", v)}
        />

        <div className="space-y-1">
          <label className={block}>
            <span className="text-sm text-gray-700">
              Certificat médical (nom du médecin)
            </span>
            <input
              className={input}
              value={value.certMed}
              onChange={(e) => update("certMed", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* GEVA-Sco / réunion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.hasGevaSco}
            onChange={(e) => update("hasGevaSco", e.target.checked)}
          />
          <span className="text-sm">GEVA-Sco (PDF)</span>
        </label>
	  </div>
	  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
	  
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.hasLpi}
            onChange={(e) => update("hasLpi", e.target.checked)}
          />
          <span className="text-sm">LPI</span>
        </label>
		
        <label className={block}>
          <span className="text-sm text-gray-700">Numéro du LPI</span>
          <input
            className={input}
            disabled={!value.hasLpi}
            value={value.numLpi}
            onChange={(e) => update("numLpi", e.target.value)}
          />
        </label>		
		
	  </div>
	  
	  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={block}>
          <span className="text-sm text-gray-700">Date de réunion</span>
          <input
            type="date"
            className={input}
            value={value.dateGevaSco}
            onChange={(e) => update("dateGevaSco", e.target.value)}
          />
        </label>

        <label className={block}>
          <span className="text-sm text-gray-700">Type de réunion</span>
          <select
            className={input}
            value={value.typeReunion}
            onChange={(e) =>
              update(
                "typeReunion",
                e.target.value as BordereauDraft["typeReunion"],
              )
            }
          >
            <option value="">— Choisir —</option>
            <option value="ESS">ESS</option>
            <option value="Equipe éducative">Équipe éducative</option>
          </select>
        </label>
      </div>

      {/* PSY / AUTRE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.hasPsy}
              onChange={(e) => update("hasPsy", e.target.checked)}
            />
            <span className="text-sm font-medium">Bilans / comptes rendus psy</span>
          </label>
          <textarea
            className={input}
            rows={4}
            disabled={!value.hasPsy}
            placeholder="Préciser (nom du professionnel, date, type de bilan)…"
            value={value.psy}
            onChange={(e) => update("psy", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.hasAutre}
              onChange={(e) => update("hasAutre", e.target.checked)}
            />
            <span className="text-sm font-medium">Autres pièces</span>
          </label>
          <textarea
            className={input}
            rows={4}
            disabled={!value.hasAutre}
            placeholder="Compléments (une ligne par élément)…"
            value={value.autre}
            onChange={(e) => update("autre", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
