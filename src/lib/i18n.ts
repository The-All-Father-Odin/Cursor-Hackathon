export type Locale = "en" | "fr";

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.search": "Search Suppliers",
    "nav.map": "Map View",
    "nav.tariffs": "Tariff Compare",
    "nav.shortlists": "My Shortlists",
    "nav.language": "FR",

    // Hero
    "hero.title": "Find who makes it near you",
    "hero.subtitle": "before you look abroad.",
    "hero.description": "Discover, evaluate, and connect with Canadian suppliers. Replace the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.",
    "hero.cta": "Search Suppliers",
    "hero.secondary_cta": "Browse Categories",
    "hero.stats.suppliers": "50,000+ Suppliers",
    "hero.stats.provinces": "All Provinces",
    "hero.stats.categories": "12 Industries",

    // Search
    "search.placeholder": "Search for products, materials, or services...",
    "search.button": "Search",
    "search.filters": "Filters",
    "search.results": "results found",
    "search.sort": "Sort by",
    "search.sort.relevance": "Relevance",
    "search.sort.distance": "Distance",
    "search.sort.canadianContent": "Canadian Content",
    "search.sort.capacity": "Capacity",
    "search.noResults": "No suppliers found matching your search.",
    "search.noResults.suggestion": "Try broadening your search terms or adjusting filters.",

    // Filters
    "filter.province": "Province",
    "filter.province.all": "All Provinces",
    "filter.distance": "Max Distance",
    "filter.capacity": "Capacity",
    "filter.capacity.all": "All Sizes",
    "filter.canadianContent": "Min. Canadian Content",
    "filter.certifications": "Certifications",
    "filter.clear": "Clear Filters",
    "filter.apply": "Apply Filters",

    // Supplier Card
    "supplier.score": "Canadian Content",
    "supplier.capacity": "Capacity",
    "supplier.distance": "away",
    "supplier.verified": "Verified",
    "supplier.claimed": "Claimed Profile",
    "supplier.contact": "Contact",
    "supplier.website": "Website",
    "supplier.addToShortlist": "Add to Shortlist",
    "supplier.viewProfile": "View Profile",
    "supplier.dataSources": "Data Sources",
    "supplier.lastVerified": "Last Verified",
    "supplier.lowConfidence": "Limited Canadian-content data — verify directly",

    // Map
    "map.title": "Supplier Map",
    "map.supplierDensity": "Supplier Density",
    "map.supplyDesert": "Supply Desert",
    "map.clusterInfo": "suppliers in this area",
    "map.heatmap": "Heatmap",
    "map.pins": "Pins",

    // Tariff
    "tariff.title": "Tariff & Landed-Cost Context",
    "tariff.description": "Compare the cost of importing vs. buying Canadian. See when domestic sourcing is already price-competitive after duties.",
    "tariff.product": "Product You Import",
    "tariff.origin": "Origin Country",
    "tariff.hsCode": "HS Code",
    "tariff.calculate": "Compare Costs",
    "tariff.imported": "Imported Landed Cost",
    "tariff.canadian": "Canadian Alternative",
    "tariff.savings": "Potential Savings",
    "tariff.disclaimer": "Directional cost context only — not binding pricing or legal/trade advice.",
    "tariff.duty": "Estimated Duty",
    "tariff.freight": "Estimated Freight",
    "tariff.rate": "MFN Tariff Rate",

    // Shortlists
    "shortlist.title": "My Shortlists",
    "shortlist.create": "New Shortlist",
    "shortlist.export": "Export CSV",
    "shortlist.share": "Share",
    "shortlist.empty": "No shortlists yet. Start searching and save suppliers to a shortlist.",
    "shortlist.suppliers": "suppliers",

    // Features
    "features.title": "Why SourceLocal?",
    "features.search.title": "Intelligent Search",
    "features.search.description": "NLP-powered search mapped to NAICS and UNSPSC codes. Find suppliers by product, material, or service in English or French.",
    "features.score.title": "Canadian Content Score",
    "features.score.description": "Transparent 0-100 confidence score based on registration, HQ location, production location, and ownership signals.",
    "features.map.title": "Map & Density View",
    "features.map.description": "Interactive map showing supplier locations with cluster view, heatmap toggle, and supply desert highlighting.",
    "features.tariff.title": "Tariff Context",
    "features.tariff.description": "See applicable tariff rates and estimated landed-cost comparisons. Know when buying Canadian is already cheaper.",

    // Footer
    "footer.tagline": "Strengthening Canadian supply chains, one connection at a time.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "SourceLocal. All rights reserved.",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.retry": "Try again",
    "common.back": "Back",
    "common.next": "Next",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.km": "km",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.search": "Rechercher",
    "nav.map": "Carte",
    "nav.tariffs": "Tarifs",
    "nav.shortlists": "Mes listes",
    "nav.language": "EN",

    // Hero
    "hero.title": "Trouvez qui le fabrique pres de vous",
    "hero.subtitle": "avant de chercher a l'etranger.",
    "hero.description": "Decouvrez, evaluez et connectez-vous avec des fournisseurs canadiens. Remplacez le reflexe de l'approvisionnement international par une voie rapide et basee sur les donnees pour acheter canadien.",
    "hero.cta": "Rechercher des fournisseurs",
    "hero.secondary_cta": "Parcourir les categories",
    "hero.stats.suppliers": "50 000+ fournisseurs",
    "hero.stats.provinces": "Toutes les provinces",
    "hero.stats.categories": "12 secteurs",

    // Search
    "search.placeholder": "Rechercher des produits, materiaux ou services...",
    "search.button": "Rechercher",
    "search.filters": "Filtres",
    "search.results": "resultats trouves",
    "search.sort": "Trier par",
    "search.sort.relevance": "Pertinence",
    "search.sort.distance": "Distance",
    "search.sort.canadianContent": "Contenu canadien",
    "search.sort.capacity": "Capacite",
    "search.noResults": "Aucun fournisseur trouve correspondant a votre recherche.",
    "search.noResults.suggestion": "Essayez d'elargir vos termes de recherche ou d'ajuster les filtres.",

    // Filters
    "filter.province": "Province",
    "filter.province.all": "Toutes les provinces",
    "filter.distance": "Distance max",
    "filter.capacity": "Capacite",
    "filter.capacity.all": "Toutes tailles",
    "filter.canadianContent": "Contenu canadien min.",
    "filter.certifications": "Certifications",
    "filter.clear": "Effacer les filtres",
    "filter.apply": "Appliquer les filtres",

    // Supplier Card
    "supplier.score": "Contenu canadien",
    "supplier.capacity": "Capacite",
    "supplier.distance": "de distance",
    "supplier.verified": "Verifie",
    "supplier.claimed": "Profil revendique",
    "supplier.contact": "Contacter",
    "supplier.website": "Site web",
    "supplier.addToShortlist": "Ajouter a la liste",
    "supplier.viewProfile": "Voir le profil",
    "supplier.dataSources": "Sources de donnees",
    "supplier.lastVerified": "Derniere verification",
    "supplier.lowConfidence": "Donnees limitees sur le contenu canadien — verifiez directement",

    // Map
    "map.title": "Carte des fournisseurs",
    "map.supplierDensity": "Densite des fournisseurs",
    "map.supplyDesert": "Desert d'approvisionnement",
    "map.clusterInfo": "fournisseurs dans cette zone",
    "map.heatmap": "Carte thermique",
    "map.pins": "Marqueurs",

    // Tariff
    "tariff.title": "Contexte tarifaire et cout rendu",
    "tariff.description": "Comparez le cout de l'importation par rapport a l'achat canadien.",
    "tariff.product": "Produit que vous importez",
    "tariff.origin": "Pays d'origine",
    "tariff.hsCode": "Code SH",
    "tariff.calculate": "Comparer les couts",
    "tariff.imported": "Cout rendu importe",
    "tariff.canadian": "Alternative canadienne",
    "tariff.savings": "Economies potentielles",
    "tariff.disclaimer": "Contexte de cout directionnel uniquement — pas de prix contractuel ni de conseil juridique/commercial.",
    "tariff.duty": "Droits estimes",
    "tariff.freight": "Fret estime",
    "tariff.rate": "Taux tarifaire NPF",

    // Shortlists
    "shortlist.title": "Mes listes",
    "shortlist.create": "Nouvelle liste",
    "shortlist.export": "Exporter CSV",
    "shortlist.share": "Partager",
    "shortlist.empty": "Pas encore de listes. Commencez a chercher et sauvegardez des fournisseurs.",
    "shortlist.suppliers": "fournisseurs",

    // Features
    "features.title": "Pourquoi SourceLocal?",
    "features.search.title": "Recherche intelligente",
    "features.search.description": "Recherche alimentee par le NLP mappee aux codes SCIAN et UNSPSC.",
    "features.score.title": "Score de contenu canadien",
    "features.score.description": "Score de confiance transparent de 0 a 100 base sur l'enregistrement, le siege social, le lieu de production et les signaux de propriete.",
    "features.map.title": "Vue carte et densite",
    "features.map.description": "Carte interactive montrant les emplacements des fournisseurs avec vue en cluster et carte thermique.",
    "features.tariff.title": "Contexte tarifaire",
    "features.tariff.description": "Consultez les taux de droits applicables et les comparaisons de couts rendus estimes.",

    // Footer
    "footer.tagline": "Renforcer les chaines d'approvisionnement canadiennes, une connexion a la fois.",
    "footer.product": "Produit",
    "footer.company": "Entreprise",
    "footer.legal": "Juridique",
    "footer.about": "A propos",
    "footer.contact": "Contact",
    "footer.privacy": "Politique de confidentialite",
    "footer.terms": "Conditions d'utilisation",
    "footer.copyright": "SourceLocal. Tous droits reserves.",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.retry": "Reessayer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.km": "km",
  },
};

const provinceLabels: Record<string, Record<Locale, string>> = {
  AB: { en: "Alberta", fr: "Alberta" },
  BC: { en: "British Columbia", fr: "Colombie-Britannique" },
  MB: { en: "Manitoba", fr: "Manitoba" },
  NB: { en: "New Brunswick", fr: "Nouveau-Brunswick" },
  NL: { en: "Newfoundland and Labrador", fr: "Terre-Neuve-et-Labrador" },
  NS: { en: "Nova Scotia", fr: "Nouvelle-Écosse" },
  NT: { en: "Northwest Territories", fr: "Territoires du Nord-Ouest" },
  NU: { en: "Nunavut", fr: "Nunavut" },
  ON: { en: "Ontario", fr: "Ontario" },
  PE: { en: "Prince Edward Island", fr: "Île-du-Prince-Édouard" },
  QC: { en: "Quebec", fr: "Québec" },
  SK: { en: "Saskatchewan", fr: "Saskatchewan" },
  YT: { en: "Yukon", fr: "Yukon" },
};

const capacityTierLabels = {
  Small: { en: "Small", fr: "Petite" },
  Medium: { en: "Medium", fr: "Moyenne" },
  Large: { en: "Large", fr: "Grande" },
} as const;

export function getProvinceLabel(code: string | null | undefined, locale: Locale): string {
  if (!code) return "";
  return provinceLabels[code.toUpperCase()]?.[locale] ?? code;
}

export function getCapacityTierLabel(tier: string | null | undefined, locale: Locale): string {
  if (!tier) return "";
  return capacityTierLabels[tier as keyof typeof capacityTierLabels]?.[locale] ?? tier;
}

export function t(locale: Locale, key: string): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/fr")) return "fr";
  return "en";
}
