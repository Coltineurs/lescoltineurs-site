// Informations générales du restaurant : une seule source pour tout le site
// (en-tête, pied de page, données structurées, mentions légales).
export default {
  nom: "Les Coltineurs",
  url: "https://lescoltineurs.fr",
  langue: "fr",
  slogan: "Bistrot français, Paris 16e",
  description:
    "Les Coltineurs, bistrot de quartier au 97 avenue de Versailles (Paris 16e) : cuisine française de saison, généreuse et sans chichi, et une carte de vins de petits vignerons. Ouvert du mardi au samedi.",
  adresse: {
    rue: "97 avenue de Versailles",
    codePostal: "75016",
    ville: "Paris",
    pays: "FR",
  },
  telephone: "01 45 27 15 74",
  telephoneIntl: "+33145271574",
  emailContact: "hello@lescoltineurs.com",
  emailPrivatisation: "nicolas@lescoltineurs.com",
  instagram: "https://www.instagram.com/lescoltineurs/",
  cafeSanFrancisco: "https://www.cafe-san-francisco.fr/",
  zenchef: {
    reserver: "https://bookings.zenchef.com/results?rid=358317&pid=1001",
    privatiser: "https://bookings.zenchef.com/privatisation?rid=358317&pid=1001",
  },
  carte: "https://www.google.com/maps/search/?api=1&query=Les+Coltineurs+97+avenue+de+Versailles+75016+Paris",
  // Horaires : utilisés pour l'affichage ET pour les données structurées.
  horaires: [
    { jour: "Lundi", code: "Monday", services: [] },
    { jour: "Mardi", code: "Tuesday", services: [["12:00", "14:30"], ["18:30", "23:00"]] },
    { jour: "Mercredi", code: "Wednesday", services: [["12:00", "14:30"], ["18:30", "23:00"]] },
    { jour: "Jeudi", code: "Thursday", services: [["12:00", "14:30"], ["18:30", "23:00"]] },
    { jour: "Vendredi", code: "Friday", services: [["12:00", "14:30"], ["18:30", "23:00"]] },
    { jour: "Samedi", code: "Saturday", services: [["12:00", "14:30"], ["18:30", "23:00"]] },
    { jour: "Dimanche", code: "Sunday", services: [] },
  ],
  // Bandeau d'annonce facultatif (ouverture exceptionnelle, fermeture…). Vide = pas de bandeau.
  annonce: "",
  navigation: [
    { titre: "Menu", url: "/menu/" },
    { titre: "Carte des vins", url: "/carte-des-vins/" },
    { titre: "Privatisation", url: "/privatisation/" },
    { titre: "Rejoindre l'équipe", url: "/rejoindre-l-equipe/" },
  ],
};
