// RI Landscaping — site behavior
// 1. Mobile nav toggle
// 2. Procedural texture for the hero "deep edge" graphic
// 3. Contact form -> mailto handoff (no backend yet)
// 4. Footer year

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  drawHeroTexture();
  initContactForm();
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

/* ---------- Hero graphic: turf ticks + mulch dots ---------- */
function drawHeroTexture() {
  const svg = document.querySelector(".edge-svg");
  if (!svg) return;

  const turfGroup = svg.querySelector(".turf-texture");
  const mulchGroup = svg.querySelector(".mulch-dots");
  const plantGroup = svg.querySelector(".plant-marks");

  // Turf blade ticks scattered on the green side
  if (turfGroup) {
    let ticks = "";
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * 520;
      const y = Math.random() * 420;
      const len = 6 + Math.random() * 6;
      const angle = -20 + Math.random() * 40;
      ticks += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - len}" transform="rotate(${angle} ${x} ${y})"/>`;
    }
    turfGroup.innerHTML = ticks;
  }

  // Mulch dots on the bed side
  if (mulchGroup) {
    let dots = "";
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * 260;
      const y = Math.random() * 420;
      const r = 1.5 + Math.random() * 2.5;
      dots += `<circle cx="${x}" cy="${y}" r="${r}"/>`;
    }
    mulchGroup.innerHTML = dots;
  }

  // Marigold-style plant marks near the edge on the bed side
  if (plantGroup) {
    const positions = [
      [40, 60], [70, 130], [35, 210], [80, 300], [45, 370]
    ];
    let marks = "";
    positions.forEach(([x, y]) => {
      for (let p = 0; p < 6; p++) {
        const angle = (p / 6) * Math.PI * 2;
        const px = x + Math.cos(angle) * 6;
        const py = y + Math.sin(angle) * 6;
        marks += `<circle cx="${px}" cy="${py}" r="3"/>`;
      }
    });
    plantGroup.innerHTML = marks;
  }
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const area = form.area.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name || !area) {
      note.textContent = "Please add your name and neighbourhood so we know where the job is.";
      return;
    }

    const subject = encodeURIComponent(`Quote request: ${service} — ${area}`);
    const body = encodeURIComponent(
      `Name: ${name}\nArea: ${area}\nService: ${service}\n\n${message}`
    );

    window.location.href = `mailto:caden@rilandscaping.ca?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app to send this — if nothing opens, just call or email us directly.";
  });
}
