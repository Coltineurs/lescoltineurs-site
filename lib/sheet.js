// Lecture du Google Sheet « Menu Les Coltineurs – Site internet » au moment du build.
// Si le Sheet est injoignable ou mal formé, on lève une erreur : le build échoue
// et Netlify garde la version précédente du site en ligne (jamais de menu vide).

export const SHEET_ID = "1X1HAwsaBtNcbMIZ87RFcRdc-OUADgURRV58w70GBz-k";

// Les onglets sont identifiés par leur gid (stable même si on renomme l'onglet).
export const TABS = { menu: "307354814", vins: "1001" };

const exportUrl = (gid) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

// Parseur CSV (RFC 4180) : gère guillemets, virgules et retours à la ligne dans les cellules.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", i = 0, quoted = false;
  text = text.replace(/^﻿/, "");
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        quoted = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { quoted = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Transforme les lignes en objets { colonne: valeur } et ne garde que Visible = oui.
export function toRecords(rows, requiredHeaders, label) {
  if (!rows.length) throw new Error(`[${label}] onglet vide`);
  const headers = rows[0].map((h) => h.trim());
  const missing = requiredHeaders.filter((h) => !headers.includes(h));
  if (missing.length) {
    throw new Error(`[${label}] colonnes manquantes : ${missing.join(", ")} (trouvé : ${headers.join(", ")})`);
  }
  return rows
    .slice(1)
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])))
    .filter((r) => r.Visible.toLowerCase() === "oui");
}

export async function fetchTab(gid, label) {
  const url = exportUrl(gid);
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch (e) {
    throw new Error(`[${label}] Google Sheet injoignable : ${e.message}`);
  }
  if (!res.ok) throw new Error(`[${label}] Google Sheet : HTTP ${res.status} (le partage « tous les utilisateurs disposant du lien » est-il actif ?)`);
  const type = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!type.includes("csv") && text.trimStart().startsWith("<")) {
    throw new Error(`[${label}] Google a renvoyé une page HTML au lieu d'un CSV (partage du Sheet ?)`);
  }
  return parseCsv(text);
}

// "9" -> "9" ; "16,9" -> "16,90" ; "12 € / 100 g" -> inchangé.
export function formatPrice(raw) {
  const s = String(raw).trim();
  const m = s.match(/^(\d+)(?:[.,](\d{1,2}))?$/);
  if (!m) return s;
  return m[2] ? `${m[1]},${m[2].padEnd(2, "0")}` : m[1];
}

// Valeur numérique pour les données structurées (null si prix non numérique).
export function numericPrice(raw) {
  const m = String(raw).trim().match(/^(\d+)(?:[.,](\d{1,2}))?$/);
  return m ? `${m[1]}.${(m[2] || "00").padEnd(2, "0")}` : null;
}

// Regroupe une liste en conservant l'ordre d'apparition dans le Sheet.
export function groupBy(items, key) {
  const groups = [];
  const index = new Map();
  for (const it of items) {
    const k = it[key] || "";
    if (!index.has(k)) { index.set(k, { name: k, items: [] }); groups.push(index.get(k)); }
    index.get(k).items.push(it);
  }
  return groups;
}

export const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
