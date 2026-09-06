/*!
 * Clickscreation — révélation progressive du texte au défilement
 * Vanilla JS, chargé en defer. Amélioration progressive stricte : le texte est
 * rendu d'emblée dans sa couleur d'arrivée. Ce script le repasse en couleur de
 * départ puis le rallume mot à mot. S'il ne s'exécute pas, le paragraphe reste
 * lisible — il ne perd que l'animation.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setup(el) {
    if (!el || el.dataset.ccReady === 'true') return;
    el.dataset.ccReady = 'true';

    var words = Array.prototype.slice.call(el.querySelectorAll('.cc-reveal__w'));
    if (!words.length) return;

    // On n'arme l'effet que si les animations sont acceptées. Sinon on laisse
    // le paragraphe dans son état lisible par défaut.
    if (reduce.matches) return;
    el.setAttribute('data-armed', 'true');

    var ticking = false;
    var visible = false;

    function paint() {
      ticking = false;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;

      // La révélation court entre le moment où le bloc entre dans le bas de
      // l'écran et celui où il atteint le tiers supérieur.
      var start = vh * 0.88;
      var end = vh * 0.32;
      var progress = (start - rect.top) / (start - end);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      var lit = Math.round(progress * words.length);
      for (var i = 0; i < words.length; i++) {
        var on = i < lit;
        if (words[i].classList.contains('is-on') !== on) words[i].classList.toggle('is-on', on);
      }
    }

    function onScroll() {
      if (ticking || !visible) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    }

    // On ne calcule que pendant que le bloc est à l'écran.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) paint();
      }, { rootMargin: '120px 0px' }).observe(el);
    } else {
      visible = true;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  }

  function boot(scope) {
    var nodes = (scope || document).querySelectorAll('[data-cc-reveal]');
    Array.prototype.forEach.call(nodes, setup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { boot(); });
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) { boot(event.target); });
})();
