// Ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Animação de entrada (reveal)
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  io.observe(el);
});

// Barra de progresso
const PROGRESS = 78;
const bar = document.getElementById('progress-bar');
const val = document.getElementById('progress-value');
setTimeout(() => {
  bar.style.width = PROGRESS + '%';
  let n = 0;
  const t = setInterval(() => {
    n++; val.textContent = n + '%';
    if (n >= PROGRESS) clearInterval(t);
  }, 2200 / PROGRESS);
}, 600);

// Lightbox
const cards = [...document.querySelectorAll('.card')];
const images = cards.map((c) => c.querySelector('img'));
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
let current = 0;

function show(i) {
  current = (i + images.length) % images.length;
  lbImg.src = images[current].src;
  lbImg.alt = images[current].alt;
  lbCounter.textContent = `${current + 1} / ${images.length}`;
}
function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }

cards.forEach((c, i) => {
  c.addEventListener('click', () => open(i));
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
});
document.getElementById('lb-close').addEventListener('click', close);
document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Swipe no celular
let startX = 0;
lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
});

// Partículas douradas
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const count = Math.min(70, Math.floor(W / 20));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.8 + 0.4,
    vy: -(Math.random() * 0.35 + 0.1),
    vx: (Math.random() - 0.5) * 0.2,
    a: Math.random() * 0.6 + 0.2,
  }));
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 196, 90, ${p.a})`;
    ctx.shadowColor = 'rgba(212,175,55,.8)';
    ctx.shadowBlur = 8;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
window.addEventListener('resize', resize);
resize();
if (!reduce) draw();
