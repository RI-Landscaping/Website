// RI Landscaping — site behavior
// 1. Mobile nav toggle
// 2. Hero photo crossfade (featured jobs' after shots)
// 3. Contact form -> real submission via Netlify Forms (AJAX, no page reload)
// 4. Featured gallery -> auto-cycling, built from PREFERRED_JOB_IDS
// 5. Full gallery -> click-to-toggle before/after, built from JOBS
// 6. Footer year

/* =========================================================
   GALLERY DATA
   See GALLERY-GUIDE.md for full instructions.
   Filenames must follow: job{N}-after-{n}.jpg / job{N}-before-{n}.jpg
   ========================================================= */
const PREFERRED_JOB_IDS = ["job13", "job12", "job9", "job18", "job17", "job15"];

const JOBS = [
  { id: "job1", afterCount: 1, beforeCount: 1 },
  { id: "job2", afterCount: 1, beforeCount: 1 },
  { id: "job3", afterCount: 2, beforeCount: 1 },
  { id: "job4", afterCount: 1, beforeCount: 2 },
  { id: "job5", afterCount: 1, beforeCount: 1 },
  { id: "job6", afterCount: 1, beforeCount: 1 },
  { id: "job7", afterCount: 3, beforeCount: 4 },
  { id: "job8", afterCount: 1, beforeCount: 1 },
  { id: "job9", afterCount: 1, beforeCount: 1 },
  { id: "job10", afterCount: 3, beforeCount: 1 },
  { id: "job11", afterCount: 2, beforeCount: 2 },
  { id: "job12", afterCount: 1, beforeCount: 3 },
  { id: "job13", afterCount: 2, beforeCount: 2 },
  { id: "job14", afterCount: 1, beforeCount: 1 },
  { id: "job15", afterCount: 2, beforeCount: 1 },
  { id: "job16", afterCount: 1, beforeCount: 1 },
  { id: "job17", afterCount: 1, beforeCount: 1 },
  { id: "job18", afterCount: 1, beforeCount: 1 },
  { id: "job19", afterCount: 3, beforeCount: 3 },
];

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initHeroPhoto();
  initContactForm();
  buildFeatured();
  buildFullGallery();
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

/* ---------- Hero photo: crossfades through featured jobs' after-1 shots ---------- */
function initHeroPhoto() {
  const container = document.getElementById("hero-photo");
  if (!container) return;

  const sources = PREFERRED_JOB_IDS.map((id) => `images/${id}-after-1.jpg`);
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
    }, 5000);
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

/* ---------- Shared: builds the image list for a job ---------- */
function getJobImages(job) {
  const images = [];
  for (let i = 1; i <= job.afterCount; i++) {
    images.push({ src: `images/${job.id}-after-${i}.jpg`, phase: "After" });
  }
  for (let i = 1; i <= job.beforeCount; i++) {
    images.push({ src: `images/${job.id}-before-${i}.jpg`, phase: "Before" });
  }
  return images;
}

/* ---------- Shared: builds one job-card element ---------- */
function buildJobCard(job, { autoCycle }) {
  const card = document.createElement("div");
  card.className = "job-card";

  const label = document.createElement("span");
  label.className = "job-card-label";
  label.textContent = "After";
  card.appendChild(label);

  const images = getJobImages(job);
  images.forEach((imgData, idx) => {
    const img = document.createElement("img");
    img.src = imgData.src;
    img.alt = `${imgData.phase} photo of a landscaping job`;
    img.dataset.phase = imgData.phase;
    if (idx === 0) img.classList.add("is-active");
    card.appendChild(img);
  });

  if (images.length > 1) {
    let current = 0;
    const advance = () => {
      const imgs = card.querySelectorAll("img");
      imgs[current].classList.remove("is-active");
      current = (current + 1) % imgs.length;
      imgs[current].classList.add("is-active");
      label.textContent = imgs[current].dataset.phase;
    };

    if (autoCycle) {
      setInterval(advance, 5000);
    } else {
      card.addEventListener("click", advance);
    }
  }

  return card;
}

/* ---------- Featured section: auto-cycling, curated jobs ---------- */
function buildFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const featuredJobs = PREFERRED_JOB_IDS
    .map((id) => JOBS.find((j) => j.id === id))
    .filter(Boolean);

  if (featuredJobs.length === 0) {
    grid.innerHTML = `<p style="color: var(--color-moss); font-family: var(--font-mono); font-size: 0.85rem;">Featured jobs coming soon.</p>`;
    return;
  }

  featuredJobs.forEach((job) => {
    grid.appendChild(buildJobCard(job, { autoCycle: true }));
  });
}

/* ---------- Full gallery: all jobs, click-to-toggle, no auto timers ---------- */
function buildFullGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  if (JOBS.length === 0) {
    grid.innerHTML = `<p style="color: var(--color-moss); font-family: var(--font-mono); font-size: 0.85rem;">Gallery photos coming soon — see GALLERY-GUIDE.md to add them.</p>`;
    return;
  }

  JOBS.forEach((job) => {
    grid.appendChild(buildJobCard(job, { autoCycle: false }));
  });
}
