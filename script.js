// RI Landscaping — site behavior
// 1. Mobile nav toggle
// 2. Full-bleed hero photo: crossfade + slow zoom, hero rotation jobs
// 3. Contact form -> real submission via Netlify Forms (AJAX, no page reload)
// 4. Recent Work gallery -> single gallery, auto-cycling fade, built from JOBS
// 5. "Also ask about" pills -> pre-fill contact form message
// 6. Footer year

/* =========================================================
   GALLERY DATA
   Filenames follow: job{N}-after-{n}.jpg / job{N}-before-{n}.jpg

   Each job's `sequence` is the exact, hand-confirmed display
   order — before/after pairs are matched by angle, not just
   cycled in filename order. Do not reorder without checking
   the actual photos.
   ========================================================= */
const HERO_JOB_IDS = ["job13", "job12", "job10", "job18", "job17", "job15"];

const JOBS = [
  { id: "job1", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job2", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job3", sequence: [
    { phase: "after", num: 2 }, { phase: "before", num: 1 }, { phase: "after", num: 1 },
  ]},
  { id: "job4", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 }, { phase: "before", num: 2 },
  ]},
  { id: "job5", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job6", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job7", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 },
    { phase: "after", num: 2 }, { phase: "after", num: 3 },
    { phase: "before", num: 2 }, { phase: "before", num: 3 }, { phase: "before", num: 4 },
  ]},
  { id: "job8", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job9", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job10", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 },
    { phase: "after", num: 2 }, { phase: "after", num: 3 },
  ]},
  { id: "job11", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 },
    { phase: "after", num: 2 }, { phase: "before", num: 2 },
  ]},
  { id: "job12", sequence: [
    { phase: "before", num: 1 }, { phase: "before", num: 2 },
    { phase: "before", num: 3 }, { phase: "after", num: 1 },
  ]},
  { id: "job13", sequence: [
    { phase: "after", num: 2 }, { phase: "before", num: 1 },
    { phase: "after", num: 1 }, { phase: "before", num: 2 },
  ]},
  { id: "job14", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job15", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 }, { phase: "after", num: 2 },
  ]},
  { id: "job16", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job17", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job18", sequence: [{ phase: "after", num: 1 }, { phase: "before", num: 1 }] },
  { id: "job19", sequence: [
    { phase: "after", num: 1 }, { phase: "before", num: 1 },
    { phase: "after", num: 2 }, { phase: "before", num: 2 },
    { phase: "after", num: 3 }, { phase: "before", num: 3 },
  ]},
];

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initHeroPhoto();
  initContactForm();
  initServicePills();
  buildGallery();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Mobile nav ---------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Hero background: full-bleed crossfade + slow zoom ---------- */
function initHeroPhoto() {
  const container = document.getElementById("hero-bg");
  if (!container) return;

  const sources = HERO_JOB_IDS.map((id) => `images/${id}-after-1.jpg`);
  if (sources.length === 0) return;

  sources.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    if (idx === 0) img.classList.add("is-active");
    container.appendChild(img);
  });

  if (sources.length > 1) {
    let current = 0;
    setInterval(() => {
      const imgs = container.querySelectorAll("img");
      imgs[current].classList.remove("is-active");
      current = (current + 1) % imgs.length;
      imgs[current].classList.add("is-active");
    }, 6000);
  }
}

/* ---------- Contact form: real Netlify Forms submission ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const area = form.area.value.trim();

    if (!name || !area) {
      note.textContent = "Please add your name and neighbourhood so we know where the job is.";
      return;
    }

    const formData = new FormData(form);
    const encoded = new URLSearchParams(formData).toString();

    note.textContent = "Sending...";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encoded,
    })
      .then(() => {
        note.textContent = "Got it — we'll be in touch shortly. You can also call or text 647 529 2017 directly.";
        form.reset();
      })
      .catch(() => {
        note.textContent = "Something didn't go through — please call or text 647 529 2017 or email caden@rilandscaping.ca directly.";
      });
  });
}

/* ---------- "Also ask about" pills: pre-fill the contact message on click ---------- */
function initServicePills() {
  const pills = document.querySelectorAll(".pill[data-service]");
  const message = document.getElementById("message");
  if (!pills.length || !message) return;

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const service = pill.dataset.service;
      message.value = `I'm interested in: ${service}`;
    });
  });
}

/* ---------- Recent Work gallery: all jobs, auto-cycling fade ---------- */
function buildGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  if (JOBS.length === 0) {
    grid.innerHTML = `<p style="color: var(--color-moss); font-family: var(--font-mono); font-size: 0.85rem;">Gallery photos coming soon.</p>`;
    return;
  }

  JOBS.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    const label = document.createElement("span");
    label.className = "job-card-label";
    label.textContent = job.sequence[0].phase === "after" ? "After" : "Before";
    card.appendChild(label);

    job.sequence.forEach((step, idx) => {
      const img = document.createElement("img");
      img.src = `images/${job.id}-${step.phase}-${step.num}.jpg`;
      img.alt = `${step.phase === "after" ? "After" : "Before"} photo of a landscaping job`;
      img.dataset.phase = step.phase === "after" ? "After" : "Before";
      if (idx === 0) img.classList.add("is-active");
      card.appendChild(img);
    });

    grid.appendChild(card);

    if (job.sequence.length > 1) {
      let current = 0;
      setInterval(() => {
        const imgs = card.querySelectorAll("img");
        imgs[current].classList.remove("is-active");
        current = (current + 1) % imgs.length;
        imgs[current].classList.add("is-active");
        label.textContent = imgs[current].dataset.phase;
      }, 5000);
    }
  });
}
