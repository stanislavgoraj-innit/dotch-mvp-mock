/* ============================================================
   dotch · MVP-Mock · App-JS
   Mobile navigation (hamburger + off-canvas drawer).
   Injects a burger button into every .topbar and wraps wide
   tables (table.data with >5 cols, .heat, .perm-grid) in a
   horizontal scroll container.
   ============================================================ */
(function () {
  function injectNavToggle() {
    var topbar = document.querySelector('.topbar');
    var sidebar = document.querySelector('.sidebar');
    if (!topbar || !sidebar) return;

    // Burger button, prepended to .topbar
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Navigation öffnen');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<line x1="3" y1="12" x2="21" y2="12"/>' +
      '<line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>';
    topbar.insertBefore(btn, topbar.firstChild);

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Navigation schließen' : 'Navigation öffnen');
    }
    btn.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });
    overlay.addEventListener('click', function () { setOpen(false); });

    // Close on nav-item click (mobile UX)
    sidebar.addEventListener('click', function (e) {
      var a = e.target.closest('a.nav-item');
      if (a) setOpen(false);
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    // Close when leaving mobile breakpoint
    var mq = window.matchMedia('(min-width: 1025px)');
    var handle = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', handle);
    else if (mq.addListener) mq.addListener(handle);
  }

  function wrapWideElements() {
    function wrap(el) {
      if (!el || !el.parentNode) return;
      if (el.parentNode.classList && el.parentNode.classList.contains('scroll-x')) return;
      var w = document.createElement('div');
      w.className = 'scroll-x';
      el.parentNode.insertBefore(w, el);
      w.appendChild(el);
    }
    // Wide data tables (>5 columns) — wrap so they scroll horizontally
    document.querySelectorAll('table.data').forEach(function (t) {
      var firstRow = t.querySelector('tr');
      if (firstRow && firstRow.children.length > 5) wrap(t);
    });
    // Heatmap + permissions grid always wrap
    document.querySelectorAll('table.heat, .perm-grid').forEach(wrap);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    injectNavToggle();
    wrapWideElements();
  });
})();
