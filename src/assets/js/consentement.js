// Bandeau de consentement aux cookies, chargement des balises Google
// (Analytics 4 et Ads) et mesure des actions clés du site.
// Aucune balise n'est chargée AVANT un clic sur « Accepter » (règles CNIL).
// Le choix est conservé 6 mois dans le navigateur, puis redemandé.
(function () {
  var CLE = "coltineurs-consentement";
  var DUREE = 182 * 24 * 3600 * 1000; // 6 mois
  var bandeau = document.getElementById("consentement");
  var idAds = bandeau && bandeau.getAttribute("data-google-ads");
  var idAnalytics = bandeau && bandeau.getAttribute("data-google-analytics");

  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE) || "null");
      return v && Date.now() - v.date < DUREE ? v.choix : null;
    } catch (e) { return null; }
  }
  function ecrire(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {}
  }
  function chargerGoogle() {
    var premier = idAnalytics || idAds;
    if (!premier || window.__googleCharge) return;
    window.__googleCharge = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    // Consentement donné : mesure d'audience et publicité autorisées.
    gtag("consent", "default", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    gtag("js", new Date());
    if (idAnalytics) gtag("config", idAnalytics);
    if (idAds) gtag("config", idAds);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(premier);
    document.head.appendChild(s);
  }
  function afficher(oui) { if (bandeau) bandeau.hidden = !oui; }

  // --- Mesure des actions clés (uniquement si les balises sont chargées) ---
  // Noms des événements, à marquer comme « événements clés » dans Analytics
  // puis à importer comme conversions dans Google Ads.
  function evenementPourLien(a) {
    var href = a.getAttribute("href") || "";
    if (/zenchef\.com\/privatisation/.test(href)) return "demande_privatisation";
    if (/zenchef\.com/.test(href)) return "clic_reserver";
    if (/^tel:/.test(href)) return "clic_telephone";
    if (/^mailto:/.test(href)) return /nicolas@/.test(href) ? "demande_privatisation" : "clic_email";
    if (/google\.[^/]+\/maps/.test(href)) return "clic_itineraire";
    if (/instagram\.com/.test(href)) return "clic_instagram";
    return null;
  }
  function emplacement(a) {
    if (a.closest(".entete")) return "en-tete";
    if (a.closest(".pied")) return "pied-de-page";
    return "page";
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || !window.__googleCharge) return;
    var nom = evenementPourLien(a);
    if (!nom) return;
    gtag("event", nom, {
      emplacement: emplacement(a),
      page_path: location.pathname,
      link_url: a.href,
      transport_type: "beacon",
    });
  }, true);

  // --- Bandeau ---
  var choix = lire();
  if (choix === "accepte") chargerGoogle();
  afficher(choix === null);

  document.addEventListener("click", function (e) {
    var cible = e.target.closest && e.target.closest("[data-consentement]");
    if (!cible) return;
    var action = cible.getAttribute("data-consentement");
    if (action === "gerer") { afficher(true); return; }
    ecrire(action);
    afficher(false);
    if (action === "accepte") chargerGoogle();
    // Retrait du consentement : on recharge pour que les balises ne tournent plus.
    else if (window.__googleCharge) location.reload();
  });
})();
