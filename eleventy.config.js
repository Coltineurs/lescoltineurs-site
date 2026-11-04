import path from "node:path";
import Image from "@11ty/eleventy-img";
import site from "./src/_data/site.js";

const IMG_DIR = "src/assets/images";

// Génère AVIF + WebP + JPEG en plusieurs largeurs et renvoie un <picture> complet.
async function image(src, alt, sizes = "100vw", widths = [480, 800, 1200, 1600], loading = "lazy", className = "") {
  if (alt === undefined) throw new Error(`Texte alternatif manquant pour ${src}`);
  const meta = await Image(path.join(IMG_DIR, src), {
    widths,
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/",
    urlPath: "/img/",
    filenameFormat: (id, s, width, format) => `${path.parse(s).name}-${width}.${format}`,
  });
  return Image.generateHTML(meta, {
    alt,
    sizes,
    loading,
    decoding: "async",
    ...(loading === "eager" ? { fetchpriority: "high" } : {}),
    ...(className ? { class: className } : {}),
  });
}

// URL d'une image JPEG à une largeur donnée (pour og:image, données structurées).
async function imageUrl(src, width = 1200) {
  const meta = await Image(path.join(IMG_DIR, src), {
    widths: [width],
    formats: ["jpeg"],
    outputDir: "_site/img/",
    urlPath: "/img/",
    filenameFormat: (id, s, w, format) => `${path.parse(s).name}-${w}.${format}`,
  });
  return meta.jpeg[0].url;
}

// JPEG fixes (600 et 1200 px) de chaque image, générés avant le build,
// pour les balises og:image, le logo et les données structurées.
const fixedJpegs = new Map();
async function buildFixedJpegs() {
  const fs = await import("node:fs/promises");
  for (const file of await fs.readdir(IMG_DIR)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const meta = await Image(path.join(IMG_DIR, file), {
      widths: [600, 1200],
      formats: ["jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      filenameFormat: (id, s, w, format) => `${path.parse(s).name}-${w}.${format}`,
    });
    fixedJpegs.set(file, meta.jpeg);
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode("image", image);
  eleventyConfig.addAsyncShortcode("imageUrl", imageUrl);
  eleventyConfig.on("eleventy.before", buildFixedJpegs);
  // Renvoie l'URL du JPEG le plus proche (sans dépasser) de la largeur demandée.
  eleventyConfig.addFilter("imageUrlSync", (file, width = 1200) => {
    const list = fixedJpegs.get(file);
    if (!list) throw new Error(`Image inconnue : ${file}`);
    return [...list].reverse().find((m) => m.width <= width)?.url ?? list[0].url;
  });
  // Données structurées schema.org « Menu » générées depuis le Sheet.
  const offre = (prix) => (prix ? { offers: { "@type": "Offer", price: prix, priceCurrency: "EUR" } } : {});
  eleventyConfig.addFilter("menuSchema", (menu) => ({
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu/#menu`,
    name: "Menu des Coltineurs",
    inLanguage: "fr",
    hasMenuSection: menu.categories.map((c) => ({
      "@type": "MenuSection",
      name: c.nom,
      hasMenuItem: c.sousCategories.flatMap((s) => s.plats).map((p) => ({
        "@type": "MenuItem",
        name: p.nom,
        ...(p.detail ? { description: p.detail } : {}),
        ...offre(p.prixNum),
      })),
    })),
  }));
  eleventyConfig.addFilter("vinsSchema", (vins) => ({
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/carte-des-vins/#vins`,
    name: "Carte des vins des Coltineurs",
    inLanguage: "fr",
    hasMenuSection: vins.categories.map((c) => ({
      "@type": "MenuSection",
      name: c.nom,
      hasMenuItem: c.regions.flatMap((r) => r.secteurs.flatMap((s) => s.vins)).map((v) => ({
        "@type": "MenuItem",
        name: [v.domaine, v.cuvee].filter(Boolean).join(" · "),
        description: [v.appellation, v.cepages, v.millesime, v.contenance].filter(Boolean).join(" · "),
        ...offre(v.prixNum),
      })),
    })),
  }));
  eleventyConfig.addFilter("isoDate", () => new Date().toISOString().slice(0, 10));
  eleventyConfig.addFilter("annee", () => new Date().getFullYear());

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "/js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2": "/fonts/fraunces-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2": "/fonts/fraunces-latin-wght-italic.woff2",
    "node_modules/@fontsource/work-sans/files/work-sans-latin-400-normal.woff2": "/fonts/work-sans-latin-400-normal.woff2",
    "node_modules/@fontsource/work-sans/files/work-sans-latin-500-normal.woff2": "/fonts/work-sans-latin-500-normal.woff2",
    "node_modules/@fontsource/work-sans/files/work-sans-latin-600-normal.woff2": "/fonts/work-sans-latin-600-normal.woff2",
  });

  eleventyConfig.addFilter("json", (v) => JSON.stringify(v, null, 2).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("absolute", (p, base) => new URL(p, base).href);
  eleventyConfig.addFilter("dateFr", (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" })
  );
  eleventyConfig.addFilter("heure", (h) => h.replace(":00", "h").replace(":", "h"));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
