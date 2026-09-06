/*!
 * Clickscreation — comportements de l'en-tête
 * Vanilla JS, sans dépendance. Chargé en defer : jamais bloquant pour le rendu.
 * Périmètre volontairement restreint : état collant, panneau mobile accessible,
 * accordéons du panneau. Le sous-menu desktop est piloté en CSS pur
 * (:hover + :focus-within), donc il reste utilisable si ce script échoue.
 */
(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function lockScroll() {
    var gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.dataset.ccScrollLock = 'true';
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
  }

  function unlockScroll() {
    delete document.body.dataset.ccScrollLock;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  function setupHeader(root) {
    if (!root || root.dataset.ccReady === 'true') return;
    root.dataset.ccReady = 'true';

    var bar = root.querySelector('[data-cc-bar]');
    var burger = root.querySelector('[data-cc-burger]');
    var drawer = root.querySelector('[data-cc-drawer]');
    var closeBtn = root.querySelector('[data-cc-close]');
    var cleanups = [];

    /* --- État collant --------------------------------------------------- */
    if (bar) {
      var ticking = false;
      var applyStuck = function () {
        bar.classList.toggle('is-stuck', window.scrollY > 4);
        ticking = false;
      };
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(applyStuck);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(function () { window.removeEventListener('scroll', onScroll); });
      applyStuck();
    }

    /* --- Panneau mobile ------------------------------------------------- */
    if (burger && drawer) {
      var lastFocused = null;

      var isOpen = function () { return drawer.getAttribute('data-open') === 'true'; };

      var openDrawer = function () {
        lastFocused = document.activeElement;
        drawer.setAttribute('data-open', 'true');
        drawer.removeAttribute('inert');
        burger.setAttribute('aria-expanded', 'true');
        lockScroll();
        // Un élément en visibility: hidden n'est pas focusable. À l'instant où
        // l'attribut vient d'être posé, le style n'est pas encore recalculé —
        // et requestAnimationFrame ne suffit pas, il s'exécute avant le
        // recalcul de la frame. On force donc un reflux synchrone.
        void drawer.offsetHeight;
        var first = drawer.querySelector(FOCUSABLE);
        if (first) first.focus();
        if (!drawer.contains(document.activeElement)) drawer.focus();
      };

      var closeDrawer = function (restoreFocus) {
        if (!isOpen()) return;
        drawer.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
        unlockScroll();
        // inert n'est reposé qu'une fois la transition finie, sinon le focus
        // serait retiré d'un élément encore visible à l'écran.
        window.setTimeout(function () {
          if (!isOpen()) drawer.setAttribute('inert', '');
        }, 260);
        if (restoreFocus !== false) {
          (lastFocused && document.contains(lastFocused) ? lastFocused : burger).focus();
        }
      };

      var onBurger = function () { isOpen() ? closeDrawer() : openDrawer(); };
      burger.addEventListener('click', onBurger);
      cleanups.push(function () { burger.removeEventListener('click', onBurger); });

      if (closeBtn) {
        closeBtn.addEventListener('click', function () { closeDrawer(); });
      }

      // Échap ferme, Tab reste piégé dans le panneau.
      var onKeydown = function (event) {
        if (!isOpen()) return;

        if (event.key === 'Escape') {
          event.preventDefault();
          closeDrawer();
          return;
        }
        if (event.key !== 'Tab') return;

        // Filet de sécurité : le focus ne doit jamais rester hors d'un panneau ouvert.
        if (!drawer.contains(document.activeElement)) {
          var entry = drawer.querySelector(FOCUSABLE);
          if (entry) {
            event.preventDefault();
            entry.focus();
            return;
          }
        }

        var items = Array.prototype.filter.call(
          drawer.querySelectorAll(FOCUSABLE),
          function (el) { return el.offsetParent !== null || el === document.activeElement; }
        );
        if (!items.length) return;

        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onKeydown);
      cleanups.push(function () { document.removeEventListener('keydown', onKeydown); });

      // Repasser au-dessus du point de bascule referme le panneau : on se fie
      // à la visibilité réelle du bouton, donc au seuil choisi dans l'éditeur.
      var onResize = function () {
        if (isOpen() && window.getComputedStyle(burger).display === 'none') {
          closeDrawer(false);
        }
      };
      window.addEventListener('resize', onResize, { passive: true });
      cleanups.push(function () { window.removeEventListener('resize', onResize); });

      // Une navigation interne doit rendre la page au visiteur, pas un panneau ouvert.
      drawer.addEventListener('click', function (event) {
        var link = event.target.closest('a[href]');
        if (link) closeDrawer(false);
      });
    }

    /* --- Accordéons du panneau ------------------------------------------ */
    Array.prototype.forEach.call(root.querySelectorAll('[data-cc-acc]'), function (toggle) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });

    root.ccCleanup = function () {
      cleanups.forEach(function (fn) { fn(); });
      unlockScroll();
      root.dataset.ccReady = 'false';
    };
  }

  function boot(scope) {
    var nodes = (scope || document).querySelectorAll('.cc-header-section');
    Array.prototype.forEach.call(nodes, setupHeader);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { boot(); });
  } else {
    boot();
  }

  /* --- Éditeur de thème : les sections sont re-rendues à chaud ----------- */
  document.addEventListener('shopify:section:load', function (event) {
    boot(event.target);
  });
  document.addEventListener('shopify:section:unload', function (event) {
    var root = event.target.querySelector('.cc-header-section') || event.target;
    if (root && typeof root.ccCleanup === 'function') root.ccCleanup();
  });
})();
