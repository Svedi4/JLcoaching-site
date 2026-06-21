/* =========================================================
   Julien Lejeune — Coaching Performance
   Interactions
   ========================================================= */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Year ---- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header scrolled state + progress bar ---- */
  const header = $("#header");
  const progress = $("#scrollProgress");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);

    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  const toggle = $("#navToggle");
  const nav = $("#primaryNav");

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-link, .nav-cta", nav).forEach((a) => a.addEventListener("click", closeNav));

  /* ---- Scroll reveal ---- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Scroll spy (active nav link) ---- */
  const sections = $$("section[id]");
  const links = $$(".nav-link");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            links.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Animated stat counters ---- */
  const stats = $$(".stats strong[data-count]");
  let counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    stats.forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.textContent.replace(/[0-9]/g, "");
      const dur = 1100;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ("IntersectionObserver" in window && stats.length) {
    const cObs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          runCounters();
          cObs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    cObs.observe($(".stats"));
  }

  /* ---- Contact form (front-end demo handling) ---- */
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const valid = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        note.style.color = "#b4451f";
        note.textContent = "Merci de renseigner un nom et un email valides.";
        return;
      }
      note.style.color = "var(--gold)";
      note.textContent = "Merci " + name + " ! Votre demande a bien été prise en compte.";
      form.reset();
    });
  }
})();
