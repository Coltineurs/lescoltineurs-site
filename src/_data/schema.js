// Données structurées schema.org « Restaurant » (affichées sur la page d'accueil).
import site from "./site.js";

const ouvert = site.horaires.filter((h) => h.services.length);
// Regroupe les jours qui ont les mêmes horaires pour un JSON-LD compact.
const specs = [];
for (const [i] of ouvert[0].services.entries()) {
  const [opens, closes] = ouvert[0].services[i];
  specs.push({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ouvert.filter((h) => h.services[i]?.[0] === opens && h.services[i]?.[1] === closes).map((h) => `https://schema.org/${h.code}`),
    opens,
    closes,
  });
}

export default {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${site.url}/#restaurant`,
  name: site.nom,
  description: site.description,
  url: `${site.url}/`,
  telephone: site.telephoneIntl,
  image: [`${site.url}/img/salle-interieur-1080.jpeg`, `${site.url}/img/plat-ris-de-veau-morilles-1080.jpeg`],
  logo: `${site.url}/img/logo-600.jpeg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.adresse.rue,
    postalCode: site.adresse.codePostal,
    addressLocality: site.adresse.ville,
    addressCountry: site.adresse.pays,
  },
  servesCuisine: ["Française", "Bistrot", "Cuisine de saison"],
  areaServed: "Paris 16e",
  founder: [
    { "@type": "Person", name: "Gabin Jarry", jobTitle: "Chef de cuisine" },
    { "@type": "Person", name: "Nicolas Estivin", jobTitle: "Responsable de salle" },
  ],
  priceRange: "€€€",
  acceptsReservations: site.zenchef.reserver,
  hasMenu: `${site.url}/menu/`,
  openingHoursSpecification: specs,
  sameAs: [site.instagram],
};
