/* =========================================================
   Arjun & Meera — interactions
   scroll reveals · countdown · gallery & blessings carousels · photos
   ========================================================= */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- always open at the hero (top) on reload ----------
     Stop the browser from restoring the previous scroll position. */
  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
  window.addEventListener('load', function () { window.scrollTo(0, 0); });
  window.addEventListener('beforeunload', function () { window.scrollTo(0, 0); });

  /* ---------- inject real photos if present ----------
     Drop files named exactly as the data-fill value (e.g. story-1.jpg)
     into assets/images/ and they will appear automatically. */
  var PHOTO_V = '6'; // bump to force browsers to reload updated photos
  document.querySelectorAll('.ph[data-fill]').forEach(function (el) {
    var name = el.getAttribute('data-fill');
    var src = 'assets/images/' + name + '.jpg?v=' + PHOTO_V;
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.add('filled');
    };
    img.src = src;
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 5, 4) * 80) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- scroll progress ---------- */
  var bar = document.getElementById('scrollProgress');
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- countdown to wedding ceremony ----------
     5 July 2026, 07:30 AM IST. Edit this line to change. */
  var target = new Date('2026-07-05T07:30:00+05:30').getTime();
  var elD = document.getElementById('cd-days'),
      elH = document.getElementById('cd-hours'),
      elM = document.getElementById('cd-mins'),
      elS = document.getElementById('cd-secs');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff / 86400000); diff -= d * 86400000;
    var h = Math.floor(diff / 3600000); diff -= h * 3600000;
    var m = Math.floor(diff / 60000); diff -= m * 60000;
    var s = Math.floor(diff / 1000);
    if (elD) elD.textContent = pad(d);
    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(m);
    if (elS) elS.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Glimpses carousel ---------- */
  (function () {
    var track = document.getElementById('carTrack');
    var prev = document.getElementById('carPrev');
    var next = document.getElementById('carNext');
    var dotsWrap = document.getElementById('carDots');
    if (!track) return;
    var slides = track.children.length;
    var index = 0;

    function perView() { return window.innerWidth <= 600 ? 1 : (window.innerWidth <= 900 ? 2 : 3); }

    function maxIndex() { return Math.max(0, slides - perView()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { index = n; render(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    function render() {
      if (index > maxIndex()) index = maxIndex();
      var first = track.children[0];
      var gap = parseFloat(getComputedStyle(track).gap) || 16;
      var step = first.getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * step) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
    prev.addEventListener('click', function () { index = index <= 0 ? maxIndex() : index - 1; render(); });
    next.addEventListener('click', function () { index = index >= maxIndex() ? 0 : index + 1; render(); });
    window.addEventListener('resize', function () { buildDots(); render(); }, { passive: true });
    buildDots(); render();

    // gentle autoplay
    if (!reduced) {
      setInterval(function () { index = index >= maxIndex() ? 0 : index + 1; render(); }, 4500);
    }
  })();

  /* ---------- Save the Date → choose Google / Apple / Outlook ---------- */
  (function () {
    var wrap = document.getElementById('saveDateWrap');
    var btn = document.getElementById('saveDateBtn');
    var menu = document.getElementById('saveDateMenu');
    if (!wrap || !btn || !menu) return;

    // Event details (Muhurtham: 5 Jul 2026, 07:30–09:00 AM IST → UTC)
    var startUTC = '20260705T020000Z', endUTC = '20260705T033000Z';
    var title = 'Monesh & Jeyshree — Muhurtham (Wedding)';
    var details = 'Together with our families, we joyfully invite you to the wedding of Monesh & Jeyshree. Muhurtham at 7:30 AM.';
    var location = 'Arunodaya Convention Hall, #39/2, Dairy Circle, Bannerghatta Road, Bengaluru, Karnataka 560029';

    // Google Calendar
    var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(title) +
      '&dates=' + startUTC + '/' + endUTC +
      '&details=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(location);
    var gEl = document.getElementById('sdGoogle');
    if (gEl) gEl.href = g;

    // Outlook (web) Calendar — uses local-time params
    var o = 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent' +
      '&subject=' + encodeURIComponent(title) +
      '&startdt=2026-07-05T07:30:00+05:30' +
      '&enddt=2026-07-05T09:00:00+05:30' +
      '&body=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(location);
    var oEl = document.getElementById('sdOutlook');
    if (oEl) oEl.href = o;

    function open() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });
    // pick an option → mark saved, close
    menu.addEventListener('click', function (e) {
      if (e.target.closest('.sd-opt')) {
        btn.classList.add('saved');
        btn.lastChild.textContent = ' Date Saved ✓';
        setTimeout(close, 100);
      }
    });
    // close on outside click / Esc
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  /* ---------- background music (loop, ~-20dB, starts unmuted ASAP) ---------- */
  (function () {
    var audio = document.getElementById('bgMusic');
    var btn = document.getElementById('musicToggle');
    if (!audio || !btn) return;
    audio.volume = 0.1;   // soft background level (audible)
    audio.loop = true;
    var userMuted = false;   // becomes true only if the visitor taps mute

    var GESTURES = ['mousemove', 'pointermove', 'pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'click', 'wheel', 'scroll'];
    var tryingPlay = false;   // guard so rapid mousemove doesn't spam play()

    function reflect() {
      var on = !audio.muted && !audio.paused;
      btn.classList.toggle('playing', on);
      btn.classList.toggle('muted', !on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    // 1) try to play WITH sound immediately
    audio.muted = false;
    audio.play().then(reflect).catch(function () {
      // 2) blocked → play MUTED now (allowed everywhere), unmute on first gesture
      audio.muted = true;
      audio.play().catch(function () {});
      reflect();
    });

    // start/unmute on the first interaction — scroll, tap, click or key (unless muted)
    function onFirst(ev) {
      if (ev && ev.target && ev.target.closest && ev.target.closest('#musicToggle')) return;
      if (userMuted || tryingPlay) return;
      tryingPlay = true;
      audio.muted = false;
      audio.play().then(function () {        // re-assert play inside the gesture (iOS-safe)
        reflect();
        GESTURES.forEach(function (e) { window.removeEventListener(e, onFirst); });
      }).catch(function () { tryingPlay = false; reflect(); });
    }
    GESTURES.forEach(function (e) {
      window.addEventListener(e, onFirst, { passive: true });
    });

    // mute / unmute toggle button
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (audio.muted || audio.paused) {
        userMuted = false; audio.muted = false;
        audio.play().catch(function () {});
      } else {
        userMuted = true; audio.muted = true;
      }
      reflect();
    });

    // pause when the page is hidden (minimized / tab switched / app backgrounded),
    // resume when it returns — unless the visitor chose to mute
    function onHidden() { audio.pause(); reflect(); }
    function onVisible() { if (!userMuted) { audio.play().catch(function () {}); } reflect(); }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) onHidden(); else onVisible();
    });
    window.addEventListener('pagehide', onHidden);
    window.addEventListener('blur', onHidden);
    window.addEventListener('focus', function () { if (!document.hidden) onVisible(); });

    reflect();
  })();

  /* ---------- smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
      }
    });
  });
})();
