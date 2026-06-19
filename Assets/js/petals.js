/* =========================================================
   Floating jasmine petals — canvas animation
   ========================================================= */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('petals');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, petals = [];
  var COUNT = window.innerWidth < 600 ? 14 : 28;

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function rand(a, b) { return a + Math.random() * (b - a); }

  function make(initial) {
    return {
      x: rand(0, w),
      y: initial ? rand(0, h) : rand(-60, -10),
      r: rand(5, 11),
      sway: rand(0.5, 1.6),
      ss: rand(0.008, 0.02),
      phase: rand(0, Math.PI * 2),
      vy: rand(0.32, 0.9),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.012, 0.012),
      op: rand(0.5, 0.95),
      gold: Math.random() > 0.78
    };
  }
  for (var i = 0; i < COUNT; i++) petals.push(make(true));

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.op;
    var r = p.r;
    ctx.fillStyle = p.gold ? 'rgba(230,204,132,0.95)' : 'rgba(255,252,245,0.96)';
    ctx.shadowColor = p.gold ? 'rgba(194,160,74,0.5)' : 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 6;
    for (var k = 0; k < 5; k++) {
      var a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.55, r * 0.32, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = p.gold ? 'rgba(154,122,46,0.9)' : 'rgba(230,204,132,0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < petals.length; i++) {
      var p = petals[i];
      p.phase += p.ss;
      p.x += Math.sin(p.phase) * p.sway;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > h + 30) petals[i] = make(false);
      draw(p);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
