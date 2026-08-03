/* ==========================================================================
   SiteFlow i18n — Romanian default, English scaffold, German ready.
   Usage in markup:  <span data-i18n="nav.dashboard">Dashboard</span>
                     <input data-i18n-placeholder="search.placeholder">
                     <button data-i18n-title="topbar.theme">
   Usage in JS:      SiteFlowI18n.t('nav.dashboard')
   Adding a language = add a dictionary below + an entry in LANGS.
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = [
    { code: "ro", label: "Română", flag: "RO", complete: true },
    { code: "en", label: "English", flag: "EN", complete: false },
    { code: "de", label: "Deutsch", flag: "DE", complete: false },
  ];

  var DICT = {
    ro: {
      "brand.tagline": "Operations Platform",

      "group.housing": "HOUSING",
      "group.planning": "PLANIFICARE",
      "group.stays": "CAZĂRI",
      "group.people": "PERSOANE",
      "group.config": "CONFIGURARE",
      "group.analytics": "ANALIZĂ",
      "group.modules": "MODULE",
      "group.system": "SISTEM",

      "nav.housing": "Housing",
      "nav.dashboard": "Dashboard",
      "nav.planner": "Planner",
      "nav.active": "Active",
      "nav.planned": "Planificate",
      "nav.movements": "Sosiri și plecări",
      "nav.expired": "Expirate",
      "nav.unhoused": "Necazate",
      "nav.history": "Istoric cazări",
      "nav.locations": "Locații",
      "nav.rooms": "Camere",
      "nav.costs": "Costuri și facturare",
      "nav.reports": "Rapoarte",
      "nav.alerts": "Alerte",
      "nav.settings": "Setări modul",
      "nav.people": "Persoane",
      "nav.companies": "Companii",
      "nav.sites": "Șantiere",
      "nav.users": "Utilizatori",
      "nav.roles": "Roluri și permisiuni",
      "nav.general": "Setări generale",
      "nav.soon": "Curând",
      "nav.collapse": "Restrânge meniul",
      "nav.expand": "Extinde meniul",
      "nav.resize": "Trage pentru redimensionarea meniului",

      "topbar.module": "MODUL",
      "topbar.refresh": "Actualizează",
      "topbar.newStay": "Cazare nouă",
      "topbar.theme": "Schimbă tema",
      "topbar.menu": "Deschide meniul",
      "search.placeholder": "Caută persoană, locație sau cameră",

      "page.dashboard.title": "Dashboard Housing",
      "page.dashboard.sub":
        "Ocupare, mișcări, capacitate și costuri pentru modulul Housing.",
      "page.planner.title": "Planner cazare",
      "page.planner.sub": "Mută, filtrează și gestionează perioadele de cazare.",

      "page.reports.crumb": "SITEFLOW / HOUSING / ANALIZĂ",
      "page.reports.title": "Centru de rapoarte",
      "page.reports.sub":
        "Filtrează, generează și exportă rapoarte operaționale pentru Housing.",
      "reports.filters": "Filtre raport",
      "reports.generate": "Generează raport",
      "reports.from": "De la",
      "reports.to": "Până la",
      "reports.site": "Șantier",
      "reports.location": "Locație",
      "reports.room": "Cameră",
      "reports.person": "Persoană",
      "reports.company": "Companie",
      "reports.status": "Status",
      "reports.all": "Toate",
      "reports.result": "Rezultat",
      "reports.export": "Export",
      "reports.print": "Printează",
      "reports.empty": "Setează filtrele și apasă „Generează raport”.",
      "reports.periods": "perioade",
      "reports.persons": "persoane",
      "reports.locations": "locații",
      "reports.rooms": "camere",
      "reports.nights": "nopți totale",
      "reports.cost": "cost estimat",

      "page.settings.crumb": "SITEFLOW / HOUSING / SETĂRI",
      "page.settings.title": "Setări",
      "page.settings.sub":
        "Preferințe de afișare, limbă și comportament pentru modulul Housing.",
      "settings.appearance": "Aspect",
      "settings.theme": "Temă",
      "settings.theme.hint": "Comută între tema luminoasă și cea întunecată.",
      "settings.theme.light": "Luminoasă",
      "settings.theme.dark": "Întunecată",
      "settings.density": "Densitate",
      "settings.density.hint": "Cât de compact este afișat conținutul.",
      "settings.density.comfortable": "Confortabilă",
      "settings.density.compact": "Compactă",
      "settings.language": "Limbă și regiune",
      "settings.language.label": "Limba interfeței",
      "settings.language.hint":
        "Româna este limba implicită. Traducerile pot fi completate ulterior.",
      "settings.language.partial": "traducere în lucru",
      "settings.workspace": "Spațiu de lucru",
      "settings.sidebar": "Meniu lateral",
      "settings.sidebar.hint": "Restrâns la pornire sau extins.",
      "settings.shortcuts": "Scurtături de tastatură",
      "settings.reset": "Resetează preferințele locale",
      "settings.saved": "Preferință salvată",

      "kbd.search": "Caută",
      "kbd.newStay": "Cazare nouă",
      "kbd.toggleNav": "Restrânge / extinde meniul",
      "kbd.theme": "Schimbă tema",
      "kbd.refresh": "Reîncarcă datele",
      "kbd.close": "Închide fereastra",
    },

    /* English scaffold — complete progressively; missing keys fall back to RO. */
    en: {
      "brand.tagline": "Operations Platform",
      "group.housing": "HOUSING",
      "group.planning": "PLANNING",
      "group.stays": "STAYS",
      "group.people": "PEOPLE",
      "group.config": "CONFIGURATION",
      "group.analytics": "ANALYTICS",
      "group.modules": "MODULES",
      "group.system": "SYSTEM",
      "nav.housing": "Housing",
      "nav.dashboard": "Dashboard",
      "nav.planner": "Planner",
      "nav.active": "Active",
      "nav.planned": "Planned",
      "nav.movements": "Arrivals & departures",
      "nav.expired": "Expired",
      "nav.unhoused": "Unhoused",
      "nav.history": "Stay history",
      "nav.locations": "Locations",
      "nav.rooms": "Rooms",
      "nav.costs": "Costs & billing",
      "nav.reports": "Reports",
      "nav.alerts": "Alerts",
      "nav.settings": "Module settings",
      "nav.people": "People",
      "nav.companies": "Companies",
      "nav.sites": "Construction sites",
      "nav.users": "Users",
      "nav.roles": "Roles & permissions",
      "nav.general": "General settings",
      "nav.soon": "Soon",
      "nav.collapse": "Collapse sidebar",
      "nav.expand": "Expand sidebar",
      "nav.resize": "Drag to resize the sidebar",
      "topbar.module": "MODULE",
      "topbar.refresh": "Refresh",
      "topbar.newStay": "New stay",
      "topbar.theme": "Toggle theme",
      "topbar.menu": "Open menu",
      "search.placeholder": "Search a person, location or room",
      "page.dashboard.title": "Housing dashboard",
      "page.dashboard.sub":
        "Occupancy, movements, capacity and costs for the Housing module.",
      "page.planner.title": "Accommodation planner",
      "page.planner.sub": "Move, filter and manage accommodation periods.",
      "page.reports.crumb": "SITEFLOW / HOUSING / ANALYTICS",
      "page.reports.title": "Reporting center",
      "page.reports.sub":
        "Filter, generate and export operational reports for Housing.",
      "reports.filters": "Report filters",
      "reports.generate": "Generate report",
      "reports.from": "From",
      "reports.to": "To",
      "reports.site": "Construction site",
      "reports.location": "Location",
      "reports.room": "Room",
      "reports.person": "Person",
      "reports.company": "Company",
      "reports.status": "Status",
      "reports.all": "All",
      "reports.result": "Result",
      "reports.export": "Export",
      "reports.print": "Print",
      "reports.empty": "Set the filters and press “Generate report”.",
      "reports.periods": "periods",
      "reports.persons": "people",
      "reports.locations": "locations",
      "reports.rooms": "rooms",
      "reports.nights": "total nights",
      "reports.cost": "estimated cost",
      "page.settings.crumb": "SITEFLOW / HOUSING / SETTINGS",
      "page.settings.title": "Settings",
      "page.settings.sub":
        "Display, language and behaviour preferences for the Housing module.",
      "settings.appearance": "Appearance",
      "settings.theme": "Theme",
      "settings.theme.hint": "Switch between the light and dark theme.",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.density": "Density",
      "settings.density.hint": "How compact the content is displayed.",
      "settings.density.comfortable": "Comfortable",
      "settings.density.compact": "Compact",
      "settings.language": "Language & region",
      "settings.language.label": "Interface language",
      "settings.language.hint":
        "Romanian is the default. Translations can be completed later.",
      "settings.language.partial": "translation in progress",
      "settings.workspace": "Workspace",
      "settings.sidebar": "Sidebar",
      "settings.sidebar.hint": "Collapsed or expanded on start.",
      "settings.shortcuts": "Keyboard shortcuts",
      "settings.reset": "Reset local preferences",
      "settings.saved": "Preference saved",
      "kbd.search": "Search",
      "kbd.newStay": "New stay",
      "kbd.toggleNav": "Collapse / expand sidebar",
      "kbd.theme": "Toggle theme",
      "kbd.refresh": "Reload data",
      "kbd.close": "Close dialog",
    },

    /* German scaffold — intentionally empty, falls back to Romanian. */
    de: {},
  };

  var STORAGE_KEY = "siteflow-lang";
  var current = localStorage.getItem(STORAGE_KEY) || "ro";
  if (!DICT[current]) current = "ro";

  function t(key, fallback) {
    var pack = DICT[current] || {};
    if (pack[key] != null) return pack[key];
    if (DICT.ro[key] != null) return DICT.ro[key];
    return fallback != null ? fallback : key;
  }

  function apply(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.dataset.i18n, el.textContent);
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder, el.placeholder);
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var v = t(el.dataset.i18nTitle, el.title);
      el.title = v;
      if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", v);
    });
    document.documentElement.lang = current;
  }

  function set(code) {
    if (!DICT[code]) return;
    current = code;
    localStorage.setItem(STORAGE_KEY, code);
    apply();
    document.dispatchEvent(new CustomEvent("siteflow:language", { detail: code }));
  }

  window.SiteFlowI18n = {
    t: t,
    apply: apply,
    set: set,
    langs: LANGS,
    get current() {
      return current;
    },
  };
})();
