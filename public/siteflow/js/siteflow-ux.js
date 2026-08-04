/* ==========================================================================
   SiteFlow UX layer v2 — enterprise interaction polish.
   Loaded AFTER js/siteflow-ui.js. Pure presentation: no business logic,
   no Supabase calls, no data mutation. Everything here enhances what
   app.js already renders.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (id) {
    return document.getElementById(id);
  };
  var core = window.SiteFlowCore;

  /* ------------------------------------------------------------------ *
   * 1. Planner — hover preview, auto-scroll on drag, wheel/keyboard zoom
   * ------------------------------------------------------------------ */

  var hoverCard = document.createElement("div");
  hoverCard.className = "sf-hovercard hidden";
  document.body.appendChild(hoverCard);

  function hideHover() {
    hoverCard.classList.add("hidden");
  }

  function placeHover(x, y) {
    var w = hoverCard.offsetWidth || 260;
    var h = hoverCard.offsetHeight || 110;
    var left = Math.min(window.innerWidth - w - 12, x + 16);
    var top = y + 18 + h > window.innerHeight ? y - h - 14 : y + 18;
    hoverCard.style.left = Math.max(8, left) + "px";
    hoverCard.style.top = Math.max(8, top) + "px";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  }

  function statusLabel(bar) {
    if (bar.classList.contains("expired")) return ["Expirată", "expired"];
    if (bar.classList.contains("completed")) return ["Încheiată", "completed"];
    if (bar.classList.contains("planned")) return ["Planificată", "planned"];
    if (bar.classList.contains("ending")) return ["Plecare curând", "ending"];
    return ["Activă", "active"];
  }

  document.addEventListener(
    "mouseover",
    function (e) {
      var bar = e.target.closest && e.target.closest(".stay-bar");
      if (!bar) return;
      var row = bar.closest(".room-row");
      var roomCell = row && row.querySelector(".room-cell");
      var group = row;
      while (group && !group.matches(".location-group-row")) group = group.previousElementSibling;
      var person = (bar.querySelector("span") && bar.querySelector("span").textContent) || "—";
      var dates = bar.querySelector(".bar-dates");
      var st = statusLabel(bar);
      var span =
        Number(bar.dataset.endIndex || 0) - Number(bar.dataset.startIndex || 0);
      hoverCard.innerHTML =
        '<header><b>' +
        esc(person.replace(/^[⚠✓◌]\s*/, "")) +
        '</b><span class="sf-hc-pill ' +
        st[1] +
        '">' +
        st[0] +
        "</span></header>" +
        '<div class="sf-hc-grid">' +
        "<div><small>Locație</small><span>" +
        esc(group ? (group.querySelector("strong") || {}).textContent || "—" : "—") +
        "</span></div>" +
        "<div><small>Cameră</small><span>" +
        esc(roomCell ? (roomCell.querySelector("strong") || {}).textContent || "—" : "—") +
        "</span></div>" +
        "<div><small>Perioadă</small><span>" +
        esc(dates ? dates.textContent : bar.getAttribute("title") || "—") +
        "</span></div>" +
        "<div><small>Zile în fereastră</small><span>" +
        (span > 0 ? span : "—") +
        "</span></div>" +
        "</div>" +
        '<footer>Click pentru editare · trage pentru mutare · margini pentru redimensionare</footer>';
      hoverCard.classList.remove("hidden");
      placeHover(e.clientX, e.clientY);
    },
    true
  );

  document.addEventListener(
    "mousemove",
    function (e) {
      if (hoverCard.classList.contains("hidden")) return;
      if (!(e.target.closest && e.target.closest(".stay-bar"))) return hideHover();
      placeHover(e.clientX, e.clientY);
    },
    true
  );
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest(".stay-bar")) hideHover();
  });
  document.addEventListener("dragstart", hideHover, true);
  window.addEventListener("scroll", hideHover, true);

  /* Auto-scroll while dragging near planner edges ---------------------- */

  var autoTimer = null;
  function stopAuto() {
    if (autoTimer) cancelAnimationFrame(autoTimer);
    autoTimer = null;
  }
  function autoScroll(scroller, vx, vy) {
    stopAuto();
    var step = function () {
      scroller.scrollLeft += vx;
      scroller.scrollTop += vy;
      autoTimer = requestAnimationFrame(step);
    };
    if (vx || vy) autoTimer = requestAnimationFrame(step);
  }

  document.addEventListener("dragover", function (e) {
    var scroller = $("plannerScroll");
    if (!scroller) return;
    var r = scroller.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      return stopAuto();
    var edge = 90;
    var vx = 0;
    var vy = 0;
    if (e.clientX - r.left < edge) vx = -Math.ceil((edge - (e.clientX - r.left)) / 5);
    else if (r.right - e.clientX < edge) vx = Math.ceil((edge - (r.right - e.clientX)) / 5);
    if (e.clientY - r.top < edge + 30) vy = -Math.ceil((edge + 30 - (e.clientY - r.top)) / 8);
    else if (r.bottom - e.clientY < edge) vy = Math.ceil((edge - (r.bottom - e.clientY)) / 8);
    autoScroll(scroller, vx, vy);
  });
  ["dragend", "drop", "mouseup", "dragleave"].forEach(function (ev) {
    document.addEventListener(ev, stopAuto);
  });

  /* Zoom: Ctrl/⌘ + wheel and +/- keys --------------------------------- */

  function zoom(dir) {
    var btn = dir > 0 ? $("zoomInBtn") : $("zoomOutBtn");
    if (btn) btn.click();
  }

  document.addEventListener(
    "wheel",
    function (e) {
      var scroller = $("plannerScroll");
      if (!scroller || !scroller.contains(e.target)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 2) return;
      zoom(e.deltaY < 0 ? 1 : -1);
    },
    { passive: false }
  );

  document.addEventListener("keydown", function (e) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test((e.target && e.target.tagName) || "")) return;
    if (!core || core.state.view !== "housing") return;
    if (e.key === "+" || e.key === "=") zoom(1);
    else if (e.key === "-" || e.key === "_") zoom(-1);
    else if (e.key === "0") {
      var label = $("zoomLabel");
      for (var i = 0; i < 12 && label && label.textContent !== "100%"; i++)
        zoom(label.textContent.replace("%", "") > 100 ? -1 : 1);
    }
  });

  /* ------------------------------------------------------------------ *
   * 2. Generic table intelligence: instant search, sort, count, export
   *    Applied to every ERP-style page container automatically.
   * ------------------------------------------------------------------ */

  var TABLE_HOSTS = [
    ["historyPageContent", "Caută persoană, companie, cameră, locație…"],
    ["alertsPageContent", "Caută alertă, persoană, locație…"],
    ["unhousedPageContent", "Caută persoană, companie, șantier…"],
    ["reportsPageContent", "Caută în raport…"],
    ["stayList", "Caută în lista de cazări…"],
  ];

  function cellText(tr) {
    return (tr.textContent || "").toLowerCase();
  }

  function enhanceTable(host, placeholder) {
    var table = host.querySelector("table");
    if (!table) return;
    if (host.previousElementSibling && host.previousElementSibling.classList.contains("sf-tablebar")) {
      host.previousElementSibling.remove();
    }
    var tbody = table.tBodies[0];
    if (!tbody) return;
    table.classList.add("sf-table-enhanced");

    var bar = document.createElement("div");
    bar.className = "sf-tablebar";
    bar.innerHTML =
      '<div class="sf-search"><span>⌕</span><input type="search" placeholder="' +
      esc(placeholder) +
      '"></div>' +
      '<div class="sf-chips"></div>' +
      '<div class="sf-tablebar-right"><span class="sf-count"></span>' +
      '<button type="button" class="sf-mini-btn" data-act="csv">↧ CSV</button>' +
      '<button type="button" class="sf-mini-btn" data-act="print">⎙ Print</button></div>';
    host.parentNode.insertBefore(bar, host);

    var input = bar.querySelector("input");
    var count = bar.querySelector(".sf-count");
    var chipsHost = bar.querySelector(".sf-chips");
    var activeChip = "";

    /* status chips derived from rendered pills — presentation only */
    var found = {};
    Array.prototype.forEach.call(tbody.rows, function (tr) {
      var pill = tr.querySelector(".status-pill, .status-chip, .badge, .pill");
      if (pill) found[pill.textContent.trim()] = true;
    });
    var chipNames = Object.keys(found).slice(0, 6);
    if (chipNames.length > 1) {
      chipsHost.innerHTML =
        '<button type="button" class="sf-chip active" data-chip="">Toate</button>' +
        chipNames
          .map(function (n) {
            return '<button type="button" class="sf-chip" data-chip="' + esc(n) + '">' + esc(n) + "</button>";
          })
          .join("");
      chipsHost.addEventListener("click", function (e) {
        var b = e.target.closest(".sf-chip");
        if (!b) return;
        activeChip = b.dataset.chip;
        chipsHost.querySelectorAll(".sf-chip").forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
        apply();
      });
    }

    function apply() {
      var q = (input.value || "").trim().toLowerCase();
      var shown = 0;
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        var pill = tr.querySelector(".status-pill, .status-chip, .badge, .pill");
        var okChip = !activeChip || (pill && pill.textContent.trim() === activeChip);
        var okQ = !q || cellText(tr).indexOf(q) > -1;
        var ok = okChip && okQ;
        tr.classList.toggle("sf-row-hidden", !ok);
        if (ok) shown++;
      });
      count.textContent = shown + " / " + tbody.rows.length + " rânduri";
    }

    input.addEventListener("input", apply);

    /* Column sorting ------------------------------------------------- */
    var head = table.tHead && table.tHead.rows[0];
    if (head) {
      Array.prototype.forEach.call(head.cells, function (th, idx) {
        if (!th.textContent.trim()) return;
        th.classList.add("sf-sortable");
        th.addEventListener("click", function () {
          var dir = th.dataset.sfDir === "asc" ? "desc" : "asc";
          Array.prototype.forEach.call(head.cells, function (x) {
            delete x.dataset.sfDir;
            x.classList.remove("sf-sorted");
          });
          th.dataset.sfDir = dir;
          th.classList.add("sf-sorted");
          var rows = Array.prototype.slice.call(tbody.rows);
          var num = function (v) {
            var m = String(v).replace(/\s/g, "").replace(/\./g, "").replace(",", ".").match(/-?\d+(\.\d+)?/);
            return m ? parseFloat(m[0]) : null;
          };
          rows.sort(function (a, b) {
            var av = (a.cells[idx] || {}).textContent || "";
            var bv = (b.cells[idx] || {}).textContent || "";
            var an = num(av);
            var bn = num(bv);
            var r = an !== null && bn !== null ? an - bn : av.localeCompare(bv, "ro");
            return dir === "asc" ? r : -r;
          });
          rows.forEach(function (r) {
            tbody.appendChild(r);
          });
        });
      });
    }

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "print") return window.print();
      var lines = [];
      var head2 = table.tHead && table.tHead.rows[0];
      if (head2)
        lines.push(
          Array.prototype.map
            .call(head2.cells, function (c) {
              return '"' + c.textContent.trim().replace(/"/g, '""') + '"';
            })
            .join(";")
        );
      Array.prototype.forEach.call(tbody.rows, function (tr) {
        if (tr.classList.contains("sf-row-hidden")) return;
        lines.push(
          Array.prototype.map
            .call(tr.cells, function (c) {
              return '"' + c.textContent.trim().replace(/\s+/g, " ").replace(/"/g, '""') + '"';
            })
            .join(";")
        );
      });
      var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "siteflow-export.csv";
      a.click();
      URL.revokeObjectURL(url);
      if (core) core.toast("Export CSV generat");
    });

    apply();
  }

  function scan() {
    TABLE_HOSTS.forEach(function (cfg) {
      var host = $(cfg[0]);
      if (!host || host.offsetParent === null) return;
      var table = host.querySelector("table");
      if (!table || table.classList.contains("sf-table-enhanced")) return;
      enhanceTable(host, cfg[1]);
    });
  }

  var scanTimer;
  var observer = new MutationObserver(function () {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 60);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(scan, 800);
  document.addEventListener("click", function () {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 250);
  });
})();
