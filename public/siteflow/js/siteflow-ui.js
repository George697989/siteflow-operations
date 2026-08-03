/* ==========================================================================
   SiteFlow UI layer — enterprise shell behaviour.
   Loaded AFTER js/app.js. Adds: real Reports page, real Settings page,
   collapsible sidebar, density control, keyboard shortcuts, i18n binding.
   No business logic is duplicated here — everything reads SiteFlowCore.
   ========================================================================== */
(function () {
  "use strict";

  var core = window.SiteFlowCore;
  var I18n = window.SiteFlowI18n;
  var $ = function (id) {
    return document.getElementById(id);
  };
  var t = function (k, f) {
    return I18n ? I18n.t(k, f) : f || k;
  };
  var LS = {
    nav: "siteflow-nav-collapsed",
    width: "siteflow-nav-width",
    density: "siteflow-density",
  };

  /* ---------- Sidebar: collapse + resize + persistence ------------------- */

  var shell = document.querySelector(".app-shell");
  var sidebar = $("sidebar");

  function setCollapsed(on) {
    shell.classList.toggle("nav-collapsed", !!on);
    localStorage.setItem(LS.nav, on ? "1" : "0");
    var btn = $("navCollapseBtn");
    if (btn) {
      btn.textContent = on ? "»" : "«";
      btn.title = t(on ? "nav.expand" : "nav.collapse");
    }
  }

  function setWidth(px) {
    var w = Math.min(400, Math.max(210, px));
    document.documentElement.style.setProperty("--sidebar-w", w + "px");
    localStorage.setItem(LS.width, String(w));
  }

  var storedWidth = Number(localStorage.getItem(LS.width) || 0);
  if (storedWidth) setWidth(storedWidth);
  setCollapsed(localStorage.getItem(LS.nav) === "1");

  var collapseBtn = $("navCollapseBtn");
  if (collapseBtn) {
    collapseBtn.onclick = function () {
      setCollapsed(!shell.classList.contains("nav-collapsed"));
    };
  }

  var resizer = $("sidebarResizer");
  if (resizer) {
    resizer.addEventListener("pointerdown", function (e) {
      if (shell.classList.contains("nav-collapsed")) return;
      e.preventDefault();
      resizer.classList.add("dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      var move = function (ev) {
        setWidth(ev.clientX - sidebar.getBoundingClientRect().left);
      };
      var up = function () {
        resizer.classList.remove("dragging");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }

  /* ---------- Density ----------------------------------------------------- */

  function setDensity(mode) {
    document.documentElement.dataset.density = mode;
    localStorage.setItem(LS.density, mode);
    document.documentElement.style.setProperty(
      "--page-y",
      mode === "compact" ? "14px" : "22px"
    );
    document.documentElement.style.setProperty(
      "--gap",
      mode === "compact" ? "12px" : "16px"
    );
  }
  setDensity(localStorage.getItem(LS.density) || "comfortable");

  /* ---------- Keyboard shortcuts ------------------------------------------ */

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|SELECT|TEXTAREA)$/.test(
      (e.target && e.target.tagName) || ""
    );
    if (e.key === "Escape") {
      var backdrop = $("modalBackdrop");
      if (backdrop && !backdrop.classList.contains("hidden")) {
        backdrop.classList.add("hidden");
        return;
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      var s = $("globalSearch");
      if (s) s.focus();
      return;
    }
    if (typing) return;
    if (e.key === "/") {
      e.preventDefault();
      var q = $("globalSearch");
      if (q) q.focus();
    } else if (e.key.toLowerCase() === "n") {
      var nb = $("newStayBtn");
      if (nb && nb.style.display !== "none") nb.click();
    } else if (e.key === "[") {
      setCollapsed(!shell.classList.contains("nav-collapsed"));
    } else if (e.key.toLowerCase() === "d") {
      var th = $("themeToggle");
      if (th) th.click();
    } else if (e.key.toLowerCase() === "r") {
      var rb = $("refreshBtn");
      if (rb) rb.click();
    }
  });

  /* ---------- Reports page ------------------------------------------------ */

  var reportRows = [];

  function esc(s) {
    return core.esc(s);
  }

  window.renderReportsPage = function () {
    var form = $("reportsFilters");
    var out = $("reportsPageContent");
    var summary = $("reportsSummary");
    if (!form || !out || !summary || !core) return;

    var st = core.state;
    var dates = st.stays
      .flatMap(function (s) {
        return [s.check_in_date, s.check_out_date];
      })
      .filter(Boolean)
      .sort();
    var from = dates[0] || core.iso(new Date());
    var to = dates[dates.length - 1] || core.iso(new Date());

    var companies = Array.from(
      new Set(st.people.map(function (p) {
        return p.company_name;
      }).filter(Boolean))
    ).sort();

    if (!form.dataset.ready) {
      form.innerHTML =
        '<label><span data-i18n="reports.from">De la</span><input type="date" name="from" value="' +
        from +
        '"></label>' +
        '<label><span data-i18n="reports.to">Până la</span><input type="date" name="to" value="' +
        to +
        '"></label>' +
        '<label><span data-i18n="reports.site">Șantier</span><select name="site"><option value="">' +
        t("reports.all") +
        "</option>" +
        core
          .siteOptions()
          .map(function (x) {
            return '<option value="' + esc(x.id) + '">' + esc(x.name) + "</option>";
          })
          .join("") +
        "</select></label>" +
        '<label><span data-i18n="reports.location">Locație</span><select name="location"><option value="">' +
        t("reports.all") +
        "</option>" +
        st.locations
          .map(function (l) {
            return (
              '<option value="' + l.id + '">' + esc(core.locName(l)) + "</option>"
            );
          })
          .join("") +
        "</select></label>" +
        '<label><span data-i18n="reports.room">Cameră</span><select name="room"><option value="">' +
        t("reports.all") +
        "</option>" +
        st.units
          .map(function (u) {
            return (
              '<option value="' + u.id + '">' + esc(u.name || "Cameră") + "</option>"
            );
          })
          .join("") +
        "</select></label>" +
        '<label><span data-i18n="reports.person">Persoană</span><select name="person"><option value="">' +
        t("reports.all") +
        "</option>" +
        st.people
          .slice()
          .sort(function (a, b) {
            return (a.full_name || "").localeCompare(b.full_name || "");
          })
          .map(function (p) {
            return (
              '<option value="' + p.id + '">' + esc(p.full_name) + "</option>"
            );
          })
          .join("") +
        "</select></label>" +
        '<label><span data-i18n="reports.company">Companie</span><select name="company"><option value="">' +
        t("reports.all") +
        "</option>" +
        companies
          .map(function (c) {
            return '<option value="' + esc(c) + '">' + esc(c) + "</option>";
          })
          .join("") +
        "</select></label>" +
        '<label><span data-i18n="reports.status">Status</span><select name="status"><option value="">' +
        t("reports.all") +
        '</option><option value="active">Active</option><option value="planned">Planificate</option><option value="completed">Încheiate</option></select></label>' +
        '<button class="primary-btn" type="submit" data-i18n="reports.generate">Generează raport</button>';
      form.dataset.ready = "1";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        draw();
      });
      if (I18n) I18n.apply(form);
    }

    function draw() {
      var f = Object.fromEntries(new FormData(form).entries());
      var lm = Object.fromEntries(st.locations.map(function (x) {
        return [String(x.id), x];
      }));
      var um = Object.fromEntries(st.units.map(function (x) {
        return [String(x.id), x];
      }));
      var pm = Object.fromEntries(st.people.map(function (x) {
        return [String(x.id), x];
      }));
      var a = core.parse(f.from);
      var b = new Date(core.parse(f.to).getTime() + core.DAY);
      var today = core.iso(new Date());

      var rows = st.stays.filter(function (s) {
        var u = um[String(s.unit_id)];
        var l = u && lm[String(u.location_id)];
        var p = pm[String(s.person_id)];
        var status = s.archived_at || s.status === "completed"
          ? "completed"
          : s.check_in_date > today
            ? "planned"
            : "active";
        return (
          (!f.site || String((l && (l.site_id || l.project_id)) || s.site_id) === String(f.site)) &&
          (!f.location || String(u && u.location_id) === String(f.location)) &&
          (!f.room || String(s.unit_id) === String(f.room)) &&
          (!f.person || String(s.person_id) === String(f.person)) &&
          (!f.company || (p && p.company_name) === f.company) &&
          (!f.status || status === f.status) &&
          core.parse(s.check_in_date) < b &&
          (!s.check_out_date || core.parse(s.check_out_date) > a)
        );
      });

      var nights = 0;
      var cost = 0;
      reportRows = rows.map(function (s) {
        var u = um[String(s.unit_id)];
        var l = u && lm[String(u.location_id)];
        var p = pm[String(s.person_id)];
        var x = Math.max(a, core.parse(s.check_in_date));
        var y = Math.min(b, s.check_out_date ? core.parse(s.check_out_date) : b);
        var n = Math.max(0, Math.round((y - x) / core.DAY));
        nights += n;
        var c = core.stayCost(s, u, n);
        cost += c;
        return {
          person: (p && p.full_name) || "—",
          company: (p && p.company_name) || "—",
          location: l ? core.locName(l) : "—",
          room: (u && u.name) || "—",
          from: s.check_in_date,
          to: s.check_out_date || "—",
          nights: n,
          cost: c,
          status:
            s.archived_at || s.status === "completed"
              ? "completed"
              : s.check_out_date && s.check_out_date < today
                ? "expired"
                : s.check_in_date > today
                  ? "planned"
                  : "active",
        };
      });

      var persons = new Set(rows.map(function (s) {
        return s.person_id;
      })).size;
      var locations = new Set(
        rows.map(function (s) {
          return um[String(s.unit_id)] && um[String(s.unit_id)].location_id;
        }).filter(Boolean)
      ).size;
      var roomsCount = new Set(rows.map(function (s) {
        return s.unit_id;
      })).size;

      summary.innerHTML = [
        [t("reports.periods"), rows.length],
        [t("reports.persons"), persons],
        [t("reports.locations"), locations],
        [t("reports.rooms"), roomsCount],
        [t("reports.nights"), nights],
        [t("reports.cost"), core.money(cost) + " €"],
      ]
        .map(function (x) {
          return (
            "<div><small>" +
            String(x[0]).toUpperCase() +
            "</small><b>" +
            x[1] +
            "</b></div>"
          );
        })
        .join("");

      var labels = {
        active: "Activ",
        planned: "Planificat",
        expired: "Expirat",
        completed: "Încheiat",
      };
      out.innerHTML = reportRows.length
        ? '<table class="data-table history-table"><thead><tr><th>' +
          t("reports.person") +
          "</th><th>" +
          t("reports.company") +
          "</th><th>" +
          t("reports.location") +
          "</th><th>" +
          t("reports.room") +
          "</th><th>" +
          t("reports.from") +
          "</th><th>" +
          t("reports.to") +
          "</th><th>Nopți</th><th>Cost</th><th>" +
          t("reports.status") +
          "</th></tr></thead><tbody>" +
          reportRows
            .map(function (r) {
              return (
                "<tr><td><b>" +
                esc(r.person) +
                "</b></td><td>" +
                esc(r.company) +
                "</td><td>" +
                esc(r.location) +
                "</td><td>" +
                esc(r.room) +
                "</td><td>" +
                core.roDate(r.from) +
                "</td><td>" +
                (r.to === "—" ? "—" : core.roDate(r.to)) +
                "</td><td>" +
                r.nights +
                "</td><td>" +
                core.money(r.cost) +
                ' €</td><td><span class="status-pill ' +
                r.status +
                '">' +
                labels[r.status] +
                "</span></td></tr>"
              );
            })
            .join("") +
          "</tbody></table>"
        : '<div class="sf-empty"><i>⌕</i><b>Niciun rezultat</b><span>Nu există cazări care să corespundă filtrelor selectate. Lărgește intervalul de date sau elimină un filtru.</span></div>';
    }

    draw();

    var exportBtn = $("reportsExportBtn");
    if (exportBtn)
      exportBtn.onclick = function () {
        if (!reportRows.length) return core.toast("Nu există date de exportat", "error");
        var head = [
          "Persoana",
          "Companie",
          "Locatie",
          "Camera",
          "De la",
          "Pana la",
          "Nopti",
          "Cost",
          "Status",
        ];
        var csv = [head.join(";")]
          .concat(
            reportRows.map(function (r) {
              return [
                r.person,
                r.company,
                r.location,
                r.room,
                r.from,
                r.to,
                r.nights,
                r.cost.toFixed(2),
                r.status,
              ]
                .map(function (v) {
                  return '"' + String(v).replace(/"/g, '""') + '"';
                })
                .join(";");
            })
          )
          .join("\n");
        var blob = new Blob(["\ufeff" + csv], {
          type: "text/csv;charset=utf-8;",
        });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "siteflow-raport-" + core.iso(new Date()) + ".csv";
        link.click();
        URL.revokeObjectURL(url);
        core.toast("Raport exportat (CSV)");
      };

    var printBtn = $("reportsPrintBtn");
    if (printBtn) printBtn.onclick = function () {
      window.print();
    };
  };

  /* ---------- Settings page ------------------------------------------------ */

  window.renderSettingsPage = function () {
    var host = $("settingsContent");
    if (!host) return;
    var theme = document.documentElement.dataset.theme || "light";
    var density = localStorage.getItem(LS.density) || "comfortable";
    var lang = I18n ? I18n.current : "ro";

    host.innerHTML =
      '<div class="settings-grid">' +
      '<article class="panel"><div class="panel-heading"><div><span class="eyebrow">' +
      t("settings.appearance").toUpperCase() +
      "</span><h2>" +
      t("settings.appearance") +
      "</h2></div></div>" +
      '<div class="setting-row"><div><b>' +
      t("settings.theme") +
      "</b><small>" +
      t("settings.theme.hint") +
      '</small></div><div class="seg" data-seg="theme">' +
      '<button data-value="light" class="' +
      (theme === "light" ? "active" : "") +
      '">' +
      t("settings.theme.light") +
      '</button><button data-value="dark" class="' +
      (theme === "dark" ? "active" : "") +
      '">' +
      t("settings.theme.dark") +
      "</button></div></div>" +
      '<div class="setting-row"><div><b>' +
      t("settings.density") +
      "</b><small>" +
      t("settings.density.hint") +
      '</small></div><div class="seg" data-seg="density">' +
      '<button data-value="comfortable" class="' +
      (density === "comfortable" ? "active" : "") +
      '">' +
      t("settings.density.comfortable") +
      '</button><button data-value="compact" class="' +
      (density === "compact" ? "active" : "") +
      '">' +
      t("settings.density.compact") +
      "</button></div></div>" +
      '<div class="setting-row"><div><b>' +
      t("settings.sidebar") +
      "</b><small>" +
      t("settings.sidebar.hint") +
      '</small></div><div class="seg" data-seg="nav">' +
      '<button data-value="0" class="' +
      (shell.classList.contains("nav-collapsed") ? "" : "active") +
      '">' +
      t("nav.expand") +
      '</button><button data-value="1" class="' +
      (shell.classList.contains("nav-collapsed") ? "active" : "") +
      '">' +
      t("nav.collapse") +
      "</button></div></div></article>" +
      '<article class="panel"><div class="panel-heading"><div><span class="eyebrow">' +
      t("settings.language").toUpperCase() +
      "</span><h2>" +
      t("settings.language") +
      "</h2></div></div>" +
      '<div class="setting-row"><div><b>' +
      t("settings.language.label") +
      "</b><small>" +
      t("settings.language.hint") +
      '</small></div><select id="languageSelect">' +
      (I18n ? I18n.langs : [])
        .map(function (l) {
          return (
            '<option value="' +
            l.code +
            '"' +
            (l.code === lang ? " selected" : "") +
            ">" +
            l.label +
            (l.complete ? "" : " · " + t("settings.language.partial")) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="setting-row"><div><b>' +
      t("settings.reset") +
      '</b><small>localStorage · temă, densitate, meniu, planner</small></div><button class="secondary-btn" id="resetPrefsBtn">' +
      t("settings.reset") +
      "</button></div></article>" +
      '<article class="panel"><div class="panel-heading"><div><span class="eyebrow">' +
      t("settings.shortcuts").toUpperCase() +
      "</span><h2>" +
      t("settings.shortcuts") +
      '</h2></div></div><div class="kbd-list">' +
      [
        ["kbd.search", "/  ·  Ctrl K"],
        ["kbd.newStay", "N"],
        ["kbd.toggleNav", "["],
        ["kbd.theme", "D"],
        ["kbd.refresh", "R"],
        ["kbd.close", "Esc"],
      ]
        .map(function (x) {
          return "<div><span>" + t(x[0]) + "</span><kbd>" + x[1] + "</kbd></div>";
        })
        .join("") +
      "</div></article></div>";

    host.querySelectorAll(".seg").forEach(function (seg) {
      seg.querySelectorAll("button").forEach(function (btn) {
        btn.onclick = function () {
          var v = btn.dataset.value;
          if (seg.dataset.seg === "theme") {
            if ((document.documentElement.dataset.theme || "light") !== v) {
              $("themeToggle").click();
            }
          } else if (seg.dataset.seg === "density") {
            setDensity(v);
          } else if (seg.dataset.seg === "nav") {
            setCollapsed(v === "1");
          }
          seg.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("active", b === btn);
          });
          core.toast(t("settings.saved"));
        };
      });
    });

    var sel = $("languageSelect");
    if (sel)
      sel.onchange = function () {
        I18n.set(sel.value);
        core.toast(t("settings.saved"));
        window.renderSettingsPage();
      };

    var reset = $("resetPrefsBtn");
    if (reset)
      reset.onclick = function () {
        [LS.nav, LS.width, LS.density, "siteflow-planner-settings"].forEach(
          function (k) {
            localStorage.removeItem(k);
          }
        );
        location.reload();
      };
  };

  /* ---------- Nav wiring for the new sections ----------------------------- */

  document.querySelectorAll("[data-section='settings']").forEach(function (b) {
    b.addEventListener(
      "click",
      function () {
        core.switchView("settings");
      },
      true
    );
  });

  document.addEventListener("siteflow:language", function () {
    if (core.state.view === "settings") window.renderSettingsPage();
    if (core.state.view === "reports") window.renderReportsPage();
  });

  if (I18n) I18n.apply();
})();
