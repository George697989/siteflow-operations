/* ==========================================================================
   SiteFlow · Site Activities — Centrul operațional (UI prototype)
   Self-contained demo screen. Local demo data only — no Supabase queries,
   no backend writes, no shared state with other modules.
   ========================================================================== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Demo data (Buchloe) -------------------------------------- */
  var DISCIPLINES = [
    { id: 'mecanic', label: 'Mecanic', color: '#2f6cb0' },
    { id: 'electric', label: 'Electric', color: '#6d55c4' },
    { id: 'gard', label: 'Gard', color: '#0f8a94' },
    { id: 'auxiliar', label: 'Auxiliar', color: '#64748b' }
  ];
  var ZONES = ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4'];
  var ROWS = ['WR1', 'WR2', 'WR3', 'WR4', 'WR5', 'WR6', 'WR7', 'WR8', 'WR9', 'WR10', 'WR11'];

  // progress[disc][row][zone] = 0..100  (deterministic demo values)
  var SEED = { mecanic: 91, electric: 63, gard: 47, auxiliar: 85 };
  function pseudo(i, j, k) { var x = (i * 37 + j * 61 + k * 17) % 100; return x; }
  var PROGRESS = {};
  DISCIPLINES.forEach(function (d, di) {
    PROGRESS[d.id] = ROWS.map(function (_, ri) {
      return ZONES.map(function (_, zi) {
        var base = SEED[d.id] - zi * 14 - Math.max(0, ri - 4) * 4 + pseudo(di, ri, zi) % 18 - 9;
        return Math.max(0, Math.min(100, Math.round(base)));
      });
    });
  });

  var KPIS = [
    { label: 'Progres total', value: '62%', sub: '+3,1 pp față de săpt. trecută', tone: 'brand', spark: [41, 44, 47, 51, 54, 58, 62] },
    { label: 'Module montate', value: '148 / 236', sub: '12 module în ultimele 7 zile', tone: 'green', spark: [98, 105, 112, 121, 130, 138, 148] },
    { label: 'Ore raportate', value: '1.284 h', sub: 'săptămâna curentă · 6 echipe', tone: 'purple', spark: [210, 224, 198, 236, 244, 231, 261] },
    { label: 'Activități sub normă', value: '5', sub: '2 critice · 3 monitorizate', tone: 'orange', spark: [3, 4, 4, 6, 5, 6, 5] }
  ];

  var FEED = [
    { time: '14:20', text: '<b>Echipa M2</b> a raportat montaj module WR5 · Zona 2 (+8 module)', tag: 'Mecanic', tone: 'brand' },
    { time: '13:05', text: '<b>Echipa E1</b> a finalizat cablarea WR3 · Zona 1', tag: 'Electric', tone: 'purple' },
    { time: '11:40', text: 'Recepție material: 24 module livrate în Zona 3', tag: 'Logistică', tone: 'teal' },
    { time: '10:15', text: '<b>Echipa G1</b> a raportat întârziere fundații gard WR8 (teren)', tag: 'Gard', tone: 'orange' },
    { time: '08:30', text: 'Toolbox talk finalizat — 42 prezenți, fără incidente', tag: 'HSE', tone: 'green' }
  ];

  var CREWS = [
    { name: 'M1 · Montaj mecanic', people: 9, zone: 'Zona 1', status: 'ok' },
    { name: 'M2 · Montaj mecanic', people: 8, zone: 'Zona 2', status: 'ok' },
    { name: 'E1 · Electricieni', people: 6, zone: 'Zona 1', status: 'ok' },
    { name: 'E2 · Electricieni', people: 5, zone: 'Zona 3', status: 'warn' },
    { name: 'G1 · Gard și fundații', people: 7, zone: 'Zona 4', status: 'late' },
    { name: 'A1 · Auxiliar / logistică', people: 7, zone: 'Baza șantier', status: 'ok' }
  ];

  var QUANTITIES = [
    { label: 'Module montate', value: 12, unit: 'buc', target: 14, tone: 'brand' },
    { label: 'Cablu tras', value: 840, unit: 'm', target: 800, tone: 'purple' },
    { label: 'Gard montat', value: 95, unit: 'ml', target: 120, tone: 'teal' },
    { label: 'Fundații turnate', value: 6, unit: 'buc', target: 8, tone: 'orange' }
  ];

  var PROD = [
    { disc: 'Mecanic', plan: 66, real: 71, delta: '+5 pp', tone: 'green' },
    { disc: 'Electric', plan: 58, real: 52, delta: '-6 pp', tone: 'orange' },
    { disc: 'Gard', plan: 49, real: 41, delta: '-8 pp', tone: 'danger' },
    { disc: 'Auxiliar', plan: 80, real: 84, delta: '+4 pp', tone: 'green' },
    { label: 'Total', disc: '<b>Total</b>', plan: 63, real: 62, delta: '-1 pp', tone: 'muted' }
  ];

  var ISSUES = [
    { sev: 'critical', title: 'WR8 · Zona 4 — fundații gard blocate de teren instabil', meta: 'Gard · deschis ieri · responsabil: G1' },
    { sev: 'critical', title: 'Livrare invertoare întârziată cu 4 zile — impact Zona 3', meta: 'Electric · deschis luni · responsabil: Logistică' },
    { sev: 'warning', title: 'WR6 · Zona 2 — cupluri de strângere sub documentație', meta: 'Mecanic · deschis ieri' },
    { sev: 'warning', title: 'Personal E2 sub efectiv (5/7) până vineri', meta: 'Electric · deschis marți' },
    { sev: 'info', title: 'Documentație as-built Zona 1 la 80% — termen vineri', meta: 'Auxiliar · deschis luni' }
  ];

  var state = { disc: 'mecanic' };

  /* ---------- Helpers --------------------------------------------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function statusOf(p) { return p >= 90 ? 'done' : p >= 60 ? 'ontrack' : p >= 30 ? 'late' : p > 0 ? 'blocked' : 'planned'; }
  function sparkSVG(vals, tone) {
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var pts = vals.map(function (v, i) {
      var x = 2 + i * (76 / (vals.length - 1));
      var y = 22 - ((v - min) / (max - min || 1)) * 18;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg class="sa-spark sa-spark-' + tone + '" viewBox="0 0 80 24" preserveAspectRatio="none"><polyline points="' + pts + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- Renderers -------------------------------------------------- */
  function renderKpis() {
    $('saKpis').innerHTML = KPIS.map(function (k) {
      return '<article class="metric-card sa-kpi sa-tone-' + k.tone + '">' +
        '<span class="metric-label">' + esc(k.label) + '</span>' +
        '<div class="sa-kpi-row"><strong>' + esc(k.value) + '</strong>' + sparkSVG(k.spark, k.tone) + '</div>' +
        '<small>' + esc(k.sub) + '</small></article>';
    }).join('');
  }

  function renderDiscFilters() {
    $('saDiscFilters').innerHTML = DISCIPLINES.map(function (d) {
      return '<button class="sa-disc' + (state.disc === d.id ? ' active' : '') + '" data-disc="' + d.id + '">' +
        '<i style="background:' + d.color + '"></i>' + esc(d.label) + '</button>';
    }).join('');
    $('saDiscFilters').querySelectorAll('.sa-disc').forEach(function (b) {
      b.onclick = function () { state.disc = b.dataset.disc; renderDiscFilters(); renderMap(); };
    });
  }

  function renderLegend() {
    $('saMapLegend').innerHTML = [
      ['done', 'Finalizat ≥90%'], ['ontrack', 'În grafic 60–89%'], ['late', 'Întârziere 30–59%'], ['blocked', 'Blocat / sub 30%'], ['planned', 'Neînceput']
    ].map(function (l) { return '<span class="sa-leg"><i class="sa-cell-' + l[0] + '"></i>' + l[1] + '</span>'; }).join('');
  }

  function renderMap() {
    var data = PROGRESS[state.disc];
    var html = '<div class="sa-map-grid">';
    html += '<div class="sa-corner"></div>' + ZONES.map(function (z) { return '<div class="sa-zone-h">' + esc(z) + '</div>'; }).join('');
    ROWS.forEach(function (r, ri) {
      html += '<div class="sa-row-h">' + r + '</div>';
      ZONES.forEach(function (_, zi) {
        var p = data[ri][zi], st = statusOf(p);
        html += '<div class="sa-cell sa-cell-' + st + '" title="' + r + ' · ' + ZONES[zi] + ' — ' + p + '%">' +
          '<i style="width:' + Math.max(4, p) + '%"></i><em>' + (p > 0 ? p + '%' : '—') + '</em></div>';
      });
    });
    html += '</div>';
    $('saMap').innerHTML = html;
  }

  function renderFeed() {
    $('saFeed').innerHTML = FEED.map(function (f) {
      return '<div class="sa-feed-item"><span class="sa-feed-time">' + f.time + '</span>' +
        '<div class="sa-feed-body"><p>' + f.text + '</p><span class="sa-chip sa-chip-' + f.tone + '">' + esc(f.tag) + '</span></div></div>';
    }).join('');
  }

  function renderCrews() {
    var labels = { ok: ['În lucru', 'green'], warn: ['Sub efectiv', 'orange'], late: ['Întârziere', 'danger'] };
    $('saCrews').innerHTML = '<div class="sa-crew-list">' + CREWS.map(function (c) {
      var l = labels[c.status];
      return '<div class="sa-crew"><div><b>' + esc(c.name) + '</b><small>' + c.people + ' persoane · ' + esc(c.zone) + '</small></div>' +
        '<span class="sa-chip sa-chip-' + l[1] + '">' + l[0] + '</span></div>';
    }).join('') + '</div>' +
    '<div class="sa-crew-total"><span>Total prezenți</span><b>42 persoane</b></div>';
  }

  function renderQuantities() {
    $('saQuantities').innerHTML = QUANTITIES.map(function (q) {
      var pct = Math.min(100, Math.round(q.value / q.target * 100));
      return '<div class="sa-qty"><div class="sa-qty-head"><span>' + esc(q.label) + '</span><b>' + q.value + ' / ' + q.target + ' ' + q.unit + '</b></div>' +
        '<div class="sa-qty-track"><i class="sa-qty-' + q.tone + '" style="width:' + pct + '%"></i></div></div>';
    }).join('');
  }

  function renderProd() {
    $('saProdTable').innerHTML = '<table class="data-table sa-table"><thead><tr><th>Disciplină</th><th>Plan %</th><th>Real %</th><th>Δ</th><th>Realizat</th></tr></thead><tbody>' +
      PROD.map(function (r) {
        return '<tr' + (r.label ? ' class="sa-total-row"' : '') + '><td>' + r.disc + '</td><td>' + r.plan + '%</td><td><b>' + r.real + '%</b></td>' +
          '<td><span class="sa-chip sa-chip-' + r.tone + '">' + r.delta + '</span></td>' +
          '<td><div class="sa-qty-track sa-prod-track"><i style="width:' + r.real + '%"></i></div></td></tr>';
      }).join('') + '</tbody></table>';
  }

  function renderIssues() {
    var sevLabel = { critical: ['Critic', 'danger'], warning: ['Atenție', 'orange'], info: ['Info', 'brand'] };
    $('saIssueCount').textContent = ISSUES.length + ' deschise';
    $('saIssues').innerHTML = ISSUES.map(function (i) {
      var s = sevLabel[i.sev];
      return '<div class="sa-issue sa-issue-' + i.sev + '"><span class="sa-chip sa-chip-' + s[1] + '">' + s[0] + '</span>' +
        '<div><b>' + esc(i.title) + '</b><small>' + esc(i.meta) + '</small></div></div>';
    }).join('');
  }

  function renderAll() { renderKpis(); renderDiscFilters(); renderLegend(); renderMap(); renderFeed(); renderCrews(); renderQuantities(); renderProd(); renderIssues(); }

  /* ---------- View wiring (coexists with app.js switchView) -------------- */
  var PAGES = ['dashboardView', 'housingView', 'historyView', 'unhousedView', 'alertsView', 'financeView', 'reportsView', 'settingsView'];
  function showActivities() {
    PAGES.forEach(function (id) { var el = $(id); if (el) el.classList.add('hidden'); });
    $('activitiesView').classList.remove('hidden');
    document.querySelectorAll('.nav-link[data-view], .nav-child').forEach(function (b) { b.classList.remove('active'); });
    $('activitiesNav').classList.add('active');
    var t = $('moduleTitle'); if (t) t.textContent = 'Site Activities';
    var ns = $('newStayBtn'); if (ns) ns.style.display = 'none';
    if (!$('activitiesView').dataset.rendered) { renderAll(); $('activitiesView').dataset.rendered = '1'; }
    window.scrollTo(0, 0);
  }
  function hideActivities() {
    if (!$('activitiesView').classList.contains('hidden')) {
      $('activitiesView').classList.add('hidden');
      $('activitiesNav').classList.remove('active');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nav = $('activitiesNav'); if (!nav) return;
    nav.onclick = showActivities;
    // Any other navigation click returns to the Housing module views.
    document.querySelectorAll('.nav-link[data-view], .nav-child, .nav-parent, #adminPeople, #adminCompanies, #adminSites, #adminUsers, #adminRoles, #adminBtn').forEach(function (b) {
      b.addEventListener('click', hideActivities);
    });
    var d = $('saDate'); if (d) { var t = new Date(); d.value = t.toISOString().slice(0, 10); }
    var rb = $('saReportBtn'); if (rb) rb.onclick = function () {
      var toast = $('toast');
      if (toast) { toast.textContent = 'Prototip vizual — raportarea va fi disponibilă în modulul final.'; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 2600); }
    };
  });
})();
