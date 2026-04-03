/* ============================================================
   Perfect Beauty Parlour — script.js  v5
   ============================================================ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ── 1. NAVBAR ─────────────────────────────────────────── */
(function () {
  const nav = $('#navbar');
  const ham = $('#hamburger');
  const menu = $('#mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ── 2. SMOOTH SCROLL ──────────────────────────────────── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const el = $(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 66, behavior: 'smooth' });
});

/* ── 3. REVEAL ON SCROLL ───────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });

$$('.reveal, .rev-l, .rev-r').forEach(el => revObs.observe(el));

/* ── 4. SERVICE SLIDER ─────────────────────────────────── */
(function () {
  const track = $('#svcTrack');
  const prev  = $('#svcPrev');
  const next  = $('#svcNext');
  if (!track) return;

  const amount = () => {
    const card = track.querySelector('.svc-card');
    return card ? card.offsetWidth + 18 : 278;
  };

  next?.addEventListener('click', () => track.scrollBy({ left:  amount(), behavior: 'smooth' }));
  prev?.addEventListener('click', () => track.scrollBy({ left: -amount(), behavior: 'smooth' }));

  /* Drag-to-scroll */
  let isDown = false, sx = 0, sl = 0;
  track.addEventListener('mousedown',  e => { isDown = true; track.classList.add('grabbing'); sx = e.pageX - track.offsetLeft; sl = track.scrollLeft; });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); track.scrollLeft = sl - (e.pageX - track.offsetLeft - sx) * 1.5; });

  /* Button state */
  const upd = () => {
    if (!prev || !next) return;
    prev.style.opacity = track.scrollLeft < 8 ? '.35' : '1';
    next.style.opacity = track.scrollLeft >= track.scrollWidth - track.offsetWidth - 8 ? '.35' : '1';
  };
  track.addEventListener('scroll', upd, { passive: true });
  upd();
})();

/* ── 5. SERVICE CARD BOOK BUTTONS ──────────────────────── */
// Each "Book →" opens WhatsApp with the service name pre-filled
(function () {
  const BASE = 'https://wa.me/917620323053?text=';
  document.addEventListener('click', e => {
    const btn = e.target.closest('.svc-book-btn');
    if (!btn) return;
    const card = btn.closest('.svc-card');
    const svc  = card?.querySelector('h3')?.textContent?.trim() || 'a service';
    const msg  = `Hello! I'd like to book an appointment for *${svc}* at Perfect Beauty Parlour. Please let me know your available slots. 🌸`;
    window.open(BASE + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();

/* ── 6. CONTACT FORM ───────────────────────────────────── */
(function () {
  const form = $('#contactForm');
  if (!form) return;
  const msgEl = $('#formMsg');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.f-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    msgEl.className = 'form-msg';

    const d = new FormData(form);
    const name = d.get('name')?.trim();
    const phone = d.get('phone')?.trim();
    const email = d.get('email')?.trim();
    const service = d.get('service')?.trim();
    const message = d.get('message')?.trim();

    const waMsg = `Hello! New booking request from website.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nService: ${service || 'N/A'}\nMessage: ${message || 'N/A'}`;
    const waLink = `https://wa.me/917620323053?text=${encodeURIComponent(waMsg)}`;

    try {
      const res = await fetch('https://formsubmit.co/ajax/ny244301@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, message, _subject: `Booking — ${name}` })
      });
      const r = await res.json();
      if (r.success === 'true' || res.ok) {
        msgEl.textContent = '✓ Message sent! We\'ll contact you shortly.';
        msgEl.className = 'form-msg ok';
        form.reset();
      } else throw new Error();
    } catch {
      msgEl.innerHTML = `✓ Opening WhatsApp with your details. <a href="${waLink}" target="_blank" style="color:var(--pink)">Click here</a> if it didn't open.`;
      msgEl.className = 'form-msg ok';
      window.open(waLink, '_blank', 'noopener');
    } finally {
      btn.textContent = orig; btn.disabled = false;
    }
  });
})();

/* ── 7. ACTIVE NAV LINK ─────────────────────────────────── */
(function () {
  const sections = $$('section[id]');
  const links    = $$('.nav-links a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const l = $(`.nav-links a[href="#${e.target.id}"]`);
        if (l) l.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
})();
