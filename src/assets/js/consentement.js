// Bandeau de consentement aux cookies et chargement de Google Ads.
// La balise Google n'est chargée QU'APRÈS un clic sur « Accepter » (règles CNIL).
// Le choix est conservé 6 mois dans le navigateur, puis redemandé.
(function () {
  var CLE = "coltineurs-consentement";
  var DUREE = 182 * 24 * 3600 * 1000; // 6 mois
  var bandeau = document.getElementById("consentement");
  var idAds = bandeau && bandeau.getAttribute("data-google-ads");

  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE) || "null");
      return v && Date.now() - v.date < DUREE ? v.choix : null;
    } catch (e) { return null; }
  }
  function ecrire(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {}
  }
  function chargerGoogleAds() {
    if (!idAds || window.__adsCharge) return;
    window.__adsCharge = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("consent", "default", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "denied" });
    gtag("js", new Date());
    gtag("config", idAds);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(idAds);
    document.head.appendChild(s);
  }
  function afficher(oui) { if (bandeau) bandeau.hidden = !oui; }

  var choix = lire();
  if (choix === "accepte") chargerGoogleAds();
  afficher(choix === null);

  document.addEventListener("click", function (e) {
    var cible = e.target.closest("[data-consentement]");
    if (!cible) return;
    var action = cible.getAttribute("data-consentement");
    if (action === "gerer") { afficher(true); return; }
    ecrire(action);
    afficher(false);
    if (action === "accepte") chargerGoogleAds();
    // Retrait du consentement : on recharge pour que la balise ne tourne plus.
    else if (window.__adsCharge) location.reload();
  });
})();
