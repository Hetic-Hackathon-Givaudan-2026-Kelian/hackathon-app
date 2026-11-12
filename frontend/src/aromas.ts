import type { Aroma } from "./useChat";

export type AromaCardData = {
  id: string;
  name: string;
  family?: string;
  notes?: string;
  applications?: string;
  sweetness?: string;
  heat?: string;
  price?: string;
  leadTime?: string;
  demo: boolean;
};

function parseText(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const parts = text.split(/\.\s+(?=[A-ZÀ-ÖØ-Ý][^.:]{0,40}\s:\s)/);

  parts.forEach((part, i) => {
    const clean = part.replace(/\.\s*$/, "").trim();
    const separator = clean.indexOf(" : ");
    if (separator > 0) {
      fields[clean.slice(0, separator).trim().toLowerCase()] = clean
        .slice(separator + 3)
        .trim();
    } else if (i === 0) {
      fields["arôme"] = clean.replace(/^Arôme\s+/i, "");
    }
  });
  return fields;
}

function list(value?: string | string[]): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.join(", ");
  return value.replace(/[[\]{}'"]/g, "").trim() || undefined;
}

function str(value?: string | number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const v = String(value);
  return v === "None" ? undefined : v;
}

function capitalize(value?: string): string | undefined {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function toCardData(source: Aroma): AromaCardData {
  const t = parseText(source.text);
  return {
    id: source.source_id,
    name: capitalize(source.nom ?? t["arôme"]) ?? source.source_id,
    family: capitalize(str(source.famille ?? t["famille"])),
    notes: str(source.notes ?? t["notes"]),
    applications: list(source.applications ?? t["applications"]),
    sweetness: str(source.sucrosite ?? t["sucrosité"]),
    heat: capitalize(str(source.tenue_chaleur ?? t["tenue à la chaleur"])),
    price: str(
      source.prix_indicatif_eur_kg ??
        t["prix indicatif"]?.replace(/\s*euros?\/kg/i, ""),
    ),
    leadTime: str(source.delai_jours ?? t["délai"]?.replace(/\s*jours?/i, "")),
    demo: source.is_synthetic,
  };
}
