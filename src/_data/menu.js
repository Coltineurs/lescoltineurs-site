import { TABS, fetchTab, toRecords, formatPrice, numericPrice, groupBy, slugify } from "../../lib/sheet.js";

const REQUIRED = ["Catégorie", "Sous-catégorie", "Plat", "Détail", "Prix", "Visible"];
const MIN_ITEMS = 10;

export default async function () {
  const rows = await fetchTab(TABS.menu, "Menu");
  const records = toRecords(rows, REQUIRED, "Menu")
    .filter((r) => r.Plat)
    .map((r) => ({
      categorie: r["Catégorie"],
      sousCategorie: r["Sous-catégorie"],
      nom: r.Plat,
      detail: r["Détail"],
      // Colonne « Unité » facultative (ex. « / 100 g ») ajoutée après le prix.
      prix: [formatPrice(r.Prix), r["Unité"]].filter(Boolean).join(" "),
      // Colonne « Accueil » facultative : « oui » = plat mis en avant sur l'ardoise de l'accueil.
      accueil: (r.Accueil || "").toLowerCase() === "oui",
      prixNum: numericPrice(r.Prix),
    }));

  if (records.length < MIN_ITEMS) {
    throw new Error(`[Menu] seulement ${records.length} plats visibles (minimum ${MIN_ITEMS}) : build arrêté pour ne pas publier un menu incomplet`);
  }

  const categories = groupBy(records, "categorie").map((c) => ({
    nom: c.name,
    id: slugify(c.name),
    sousCategories: groupBy(c.items, "sousCategorie").map((s) => ({ nom: s.name, plats: s.items })),
  }));

  return { categories, total: records.length, misAJour: new Date().toISOString() };
}
