// Questions fréquentes de la page d'accueil (affichées ET envoyées à Google en données structurées FAQPage).
import site from "./site.js";

export default [
  {
    question: "Où se trouve le restaurant Les Coltineurs ?",
    reponse: `Au ${site.adresse.rue}, ${site.adresse.codePostal} ${site.adresse.ville}, dans le 16e arrondissement, quartier d'Auteuil. Métro Mirabeau ou Église d'Auteuil (ligne 10).`,
  },
  {
    question: "Quels sont les horaires d'ouverture ?",
    reponse: "Du mardi au samedi, de 12h à 14h30 et de 18h30 à 23h. Le restaurant est fermé le dimanche et le lundi, jours réservés aux privatisations.",
  },
  {
    question: "Comment réserver une table ?",
    reponse: `En ligne via notre module de réservation, ou par téléphone au ${site.telephone}. Nous vous conseillons de réserver, surtout le soir et en fin de semaine.`,
  },
  {
    question: "Quel type de cuisine servez-vous ?",
    reponse: "Une cuisine de bistrot français, de saison et généreuse, signée Gabin Jarry, à partir de produits finement sourcés. La carte évolue régulièrement selon les arrivages.",
  },
  {
    question: "Quels vins proposez-vous ?",
    reponse: "Uniquement des vins de petits vignerons attachés à une agriculture et une vinification saines : champagnes, Loire, Bourgogne, Beaujolais, Rhône, Languedoc. Nicolas vous conseille volontiers en salle.",
  },
  {
    question: "Peut-on privatiser le restaurant ?",
    reponse: `Oui, le dimanche et le lundi, à partir de 1 500 €, pour un anniversaire, un repas d'entreprise ou une fête de famille. Écrivez à Nicolas : ${site.emailPrivatisation}.`,
  },
];
