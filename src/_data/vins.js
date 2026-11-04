import { TABS, fetchTab, toRecords, formatPrice, numericPrice, groupBy, slugify } from "../../lib/sheet.js";

const REQUIRED = ["Catégorie", "Région", "Secteur", "Domaine", "Cuvée", "Appellation", "Cépages", "Millésime", "Détail", "Contenance", "Prix", "Visible"];
const MIN_ITEMS = 20;

export default async function () {
  const rows = await fetchTab(TABS.vins, "Vins");
  const records = toRecords(rows, REQUIRED, "Vins")
    .filter((r) => r.Domaine || r["Cuvée"])
    .map((r) => ({
      categorie: r["Catégorie"],
      region: r["Région"],
      secteur: r.Secteur,
      domaine: r.Domaine,
      cuvee: r["Cuvée"],
      appellation: r.Appellation,
      cepages: r["Cépages"],
      millesime: r["Millésime"],
      detail: r["Détail"],
      contenance: r.Contenance,
      prix: formatPrice(r.Prix),
      prixNum: numericPrice(r.Prix),
    }));

  if (records.length < MIN_ITEMS) {
    throw new Error(`[Vins] seulement ${records.length} vins visibles (minimum ${MIN_ITEMS}) : build arrêté pour ne pas publier une carte incomplète`);
  }

  const categories = groupBy(records, "categorie").map((c) => ({
    nom: c.name,
    id: slugify(c.name),
    regions: groupBy(c.items, "region").map((r) => ({
      nom: r.name,
      secteurs: groupBy(r.items, "secteur").map((s) => ({ nom: s.name, vins: s.items })),
    })),
  }));

  return { categories, total: records.length };
}
