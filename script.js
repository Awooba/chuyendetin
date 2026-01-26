// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const progressBar = $("#progressBar");
const yearEl = $("#year");
const menuBtn = $("#menuBtn");
const nav = $("#siteNav");
const navLinks = $$(".nav__link");

const openDetail = $("#openDetail");
const modal = $("#detailModal");
const closeModalBtn = $("#closeModal");
const form = $("#contactForm");
const formHint = $("#formHint");

let lastFocused = null;

// Set year
yearEl.textContent = new Date().getFullYear();

// Scroll progress
function updateProgress() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Reveal on scroll
const revealEls = $$("[data-reveal]");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => io.observe(el));

// Active nav link while scrolling
const sections = navLinks
  .map(a => $(a.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === id));
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0.02 });

sections.forEach(sec => sectionObserver.observe(sec));

// Smooth scroll + close drawer on click
navLinks.forEach(a => {
  a.addEventListener("click", (ev) => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = $(href);
    if (!target) return;

    ev.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // close mobile drawer
    if (nav.classList.contains("is-drawer")) {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});

// Mobile menu behavior
function setNavMode() {
  const isMobile = window.matchMedia("(max-width: 980px)").matches;
  nav.classList.toggle("is-drawer", isMobile);
  if (!isMobile) {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
}
window.addEventListener("resize", setNavMode);
setNavMode();

menuBtn.addEventListener("click", () => {
  if (!nav.classList.contains("is-drawer")) return;
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Modal open/close
function openModal() {
  lastFocused = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // focus close button for accessibility
  closeModalBtn.focus({ preventScroll: true });
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus({ preventScroll: true });
}

openDetail?.addEventListener("click", openModal);
closeModalBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (e) => {
  const t = e.target;
  if (t?.dataset?.close === "true" || t.classList.contains("modal__overlay")) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// Accordion
const accButtons = $$(".acc__btn");
accButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    // close others (optional)
    accButtons.forEach(b => {
      if (b !== btn) {
        b.setAttribute("aria-expanded", "false");
        const p = b.nextElementSibling;
        if (p) p.style.maxHeight = 0;
      }
    });

    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    const panel = btn.nextElementSibling;
    if (!panel) return;
    panel.style.maxHeight = expanded ? 0 : `${panel.scrollHeight}px`;
  });
});

// Demo "podPlay" buttons (placeholder)
$$(".podPlay").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.textContent = btn.textContent.includes("▶") ? "⏸ Tạm dừng" : "▶ Nghe thử";
    // Khi bạn gắn <audio> thật: tìm audio gần nhất và play/pause tại đây.
    // const card = btn.closest(".pod");
    // const audio = card?.querySelector("audio");
    // if (audio) (audio.paused ? audio.play() : audio.pause());
  });
});

// Fake submit (front-end only)
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  formHint.textContent = "✅ Đã nhận form (demo). Nếu muốn gửi thật, bạn nối backend hoặc dịch vụ form.";
  form.reset();
});