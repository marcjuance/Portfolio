(function () {
  "use strict";

  const SECTION_ORDER = [
    "about",
    "education",
    "skills",
    "projects",
    "trainings",
    "contacts"
  ];

  const state = {
    data: window.PORTFOLIO_DATA || {},
    activeSection: "about",
    viewAll: false,
    projectFilter: "all", // "all" | "project" | "research"
    skillQuery: ""
  };

  /* -------------------- Security & Formatting Helpers -------------------- */

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url, allowRelative) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
    if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(raw)) return raw;
    if (allowRelative && !/^[a-z]+:/i.test(raw) && !raw.startsWith("//")) {
      return raw;
    }
    return "";
  }

  function getInitials(name) {
    const parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "ME";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2400);
  }

  /* -------------------- Navigation Helper -------------------- */

  function navigateToSection(sectionKey) {
    state.activeSection = sectionKey;
    state.viewAll = false;
    renderNavState();
    renderStage();
    const target = document.getElementById(`section-${sectionKey}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  /* -------------------- Portfolio Rendering -------------------- */

  function renderAll() {
    renderProfile();
    renderNavState();
    renderStage();
    renderFooter();
  }

  function renderProfile() {
    const p = state.data.profile || {};
    document.title = p.name ? `${p.name} — Portfolio` : "Personal Portfolio";
    document.getElementById("topbar-name").textContent = p.name || "Portfolio";
    document.getElementById("profile-name").textContent = p.name || "Your Name";
    document.getElementById("profile-status-text").textContent = p.status || "Status";
    document.getElementById("profile-headline").textContent = p.headline || "";
    document.getElementById("profile-location").textContent = p.location ? `📍 ${p.location}` : "";
    document.getElementById("profile-summary").textContent = p.summary || "";

    const availEl = document.getElementById("profile-availability");
    if (p.availability) {
      availEl.textContent = p.availability;
      availEl.classList.remove("hidden");
    } else {
      availEl.classList.add("hidden");
    }

    const coverBanner = document.getElementById("cover-banner");
    const coverImg = document.getElementById("cover-photo-img");
    const coverSrc = safeUrl(p.coverPhoto, true);
    if (coverSrc) {
      coverImg.src = coverSrc;
      coverBanner.classList.remove("hidden");
    } else {
      coverBanner.classList.add("hidden");
      coverImg.removeAttribute("src");
    }

    const avatarDisplay = document.getElementById("avatar-display");
    const avatarSrc = safeUrl(p.avatarPhoto, true);
    if (avatarSrc) {
      avatarDisplay.innerHTML = `<img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(p.name || "Profile")} photo" />`;
    } else {
      avatarDisplay.innerHTML = `<span class="avatar-initials">${escapeHtml(getInitials(p.name))}</span>`;
    }
  }

  function renderNavState() {
    document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
      const sec = btn.getAttribute("data-section");
      const isActive = !state.viewAll && state.activeSection === sec;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    const viewAllBtn = document.getElementById("view-all-btn");
    viewAllBtn.classList.toggle("active", state.viewAll);
    viewAllBtn.setAttribute("aria-pressed", String(state.viewAll));
    viewAllBtn.textContent = state.viewAll ? "Showing All Sections" : "View All Sections";
  }

  function renderStage() {
    const stage = document.getElementById("section-stage");
    const sectionsToRender = state.viewAll ? SECTION_ORDER : [state.activeSection];

    const renderers = {
      about: renderAboutSection,
      education: renderEducationSection,
      skills: renderSkillsSection,
      projects: renderProjectsSection,
      trainings: renderTrainingsSection,
      contacts: renderContactsSection
    };

    stage.innerHTML = sectionsToRender
      .map((key) => (renderers[key] ? renderers[key]() : ""))
      .join("");
  }

  function renderAboutSection() {
    const about = state.data.about || {};
    const profile = state.data.profile || {};
    const paragraphs = Array.isArray(about.bioParagraphs) ? about.bioParagraphs : [];
    const highlights = Array.isArray(about.highlights) ? about.highlights : [];
    const gallery = Array.isArray(profile.galleryPhotos) ? profile.galleryPhotos : [];

    const paragraphsHtml = paragraphs.length
      ? paragraphs.map((txt) => `<p>${escapeHtml(txt)}</p>`).join("")
      : `<div class="empty-state">No bio added yet.</div>`;

    const highlightsHtml = highlights.length
      ? `<div class="highlights-grid">
          ${highlights
            .map(
              (h) => `
              <div class="highlight-item">
                <div class="highlight-label">${escapeHtml(h.label)}</div>
                <div class="highlight-value">${escapeHtml(h.value)}</div>
              </div>`
            )
            .join("")}
        </div>`
      : "";

    const validPhotos = gallery.filter((g) => safeUrl(g.url, true));
    const galleryHtml = validPhotos.length
      ? `<div class="photo-gallery">
          <h3 class="gallery-title">Photos (click to enlarge)</h3>
          <div class="gallery-grid">
            ${validPhotos
              .map((g) => {
                const src = safeUrl(g.url, true);
                const cap = g.caption || "Portfolio photo";
                return `
                  <figure class="gallery-card" data-lightbox-src="${escapeHtml(src)}" data-lightbox-title="${escapeHtml(cap)}" data-lightbox-caption="${escapeHtml(g.caption || "")}">
                    <img src="${escapeHtml(src)}" alt="${escapeHtml(cap)}" />
                    ${g.caption ? `<figcaption class="gallery-caption">${escapeHtml(g.caption)}</figcaption>` : ""}
                  </figure>`;
              })
              .join("")}
          </div>
        </div>`
      : "";

    return `
      <article class="panel-card" id="section-about">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> About Me</h2>
        </div>
        <div class="about-paragraphs">${paragraphsHtml}</div>
        ${highlightsHtml}
        ${galleryHtml}
      </article>
    `;
  }

  function renderEducationSection() {
    const list = state.data.education || [];
    const body = list.length
      ? `<div class="stack-list">
          ${list
            .map(
              (ed) => `
              <div class="entry-card">
                <div class="entry-top">
                  <div>
                    <h3 class="entry-title">${escapeHtml(ed.degree)}</h3>
                    <div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? ` · ${escapeHtml(ed.location)}` : ""}</div>
                  </div>
                  ${ed.period ? `<span class="entry-meta">${escapeHtml(ed.period)}</span>` : ""}
                </div>
                ${ed.details ? `<p class="entry-desc">${escapeHtml(ed.details)}</p>` : ""}
              </div>`
            )
            .join("")}
        </div>`
      : `<div class="empty-state">No education entries added yet.</div>`;

    return `
      <article class="panel-card" id="section-education">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> My Education</h2>
        </div>
        ${body}
      </article>
    `;
  }

  function renderSkillsSection() {
    const groups = state.data.skills || [];
    const query = state.skillQuery.trim().toLowerCase();

    const body = groups.length
      ? `<div class="skills-grid">
          ${groups
            .map(
              (group) => `
              <div class="skill-group">
                <h3 class="skill-group-title">${escapeHtml(group.category)}</h3>
                <div class="tag-list">
                  ${(group.items || [])
                    .map((item) => {
                      const matches = query && item.toLowerCase().includes(query);
                      const dimmed = query && !matches;
                      const cls = matches ? "match" : dimmed ? "dimmed" : "";
                      return `<span class="tag-chip ${cls}">${escapeHtml(item)}</span>`;
                    })
                    .join("")}
                </div>
              </div>`
            )
            .join("")}
        </div>`
      : `<div class="empty-state">No skills added yet.</div>`;

    return `
      <article class="panel-card" id="section-skills">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> Skills &amp; Expertise</h2>
          <input
            id="skill-filter-input"
            class="skill-search-input"
            type="search"
            value="${escapeHtml(state.skillQuery)}"
            placeholder="Filter skills..."
            aria-label="Filter skills"
          />
        </div>
        ${body}
      </article>
    `;
  }

  function renderProjectsSection() {
    const allItems = state.data.projectsAndResearch || [];
    const filter = state.projectFilter;
    const filtered = allItems.filter((item) => {
      if (filter === "all") return true;
      return String(item.type || "Project").toLowerCase() === filter;
    });

    const body = filtered.length
      ? `<div class="projects-grid">
          ${filtered
            .map((item) => {
              const imgSrc = safeUrl(item.photo, true);
              const linkHref = safeUrl(item.link, false);
              const isResearch = String(item.type || "").toLowerCase() === "research";
              return `
                <div class="project-card">
                  ${
                    imgSrc
                      ? `<img class="project-photo" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(item.title)}" data-lightbox-src="${escapeHtml(imgSrc)}" data-lightbox-title="${escapeHtml(item.title)}" data-lightbox-caption="${escapeHtml(item.description || "")}" />`
                      : ""
                  }
                  <div class="project-body">
                    <div class="entry-top">
                      <span class="type-badge ${isResearch ? "research" : ""}">${escapeHtml(item.type || "Project")}</span>
                      ${item.year ? `<span class="entry-meta">${escapeHtml(item.year)}</span>` : ""}
                    </div>
                    <h3 class="entry-title">${escapeHtml(item.title)}</h3>
                    ${item.role ? `<div class="entry-subtitle">${escapeHtml(item.role)}</div>` : ""}
                    ${item.description ? `<p class="entry-desc">${escapeHtml(item.description)}</p>` : ""}
                    ${
                      item.tags && item.tags.length
                        ? `<div class="tag-list">${item.tags
                            .map((t) => `<span class="tag-chip">${escapeHtml(t)}</span>`)
                            .join("")}</div>`
                        : ""
                    }
                    ${
                      linkHref
                        ? `<a class="project-link" href="${escapeHtml(linkHref)}" target="_blank" rel="noopener noreferrer">View Project / Paper ↗</a>`
                        : ""
                    }
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>`
      : `<div class="empty-state">No matching projects or research entries.</div>`;

    return `
      <article class="panel-card" id="section-projects">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> Projects &amp; Research</h2>
          <div class="filter-pills" role="group" aria-label="Filter projects and research">
            <button type="button" class="filter-pill ${filter === "all" ? "active" : ""}" data-proj-filter="all">All</button>
            <button type="button" class="filter-pill ${filter === "project" ? "active" : ""}" data-proj-filter="project">Projects</button>
            <button type="button" class="filter-pill ${filter === "research" ? "active" : ""}" data-proj-filter="research">Research</button>
          </div>
        </div>
        ${body}
      </article>
    `;
  }

  function renderTrainingsSection() {
    const items = state.data.trainingsAndCertificates || [];
    const body = items.length
      ? `<div class="stack-list">
          ${items
            .map((cert) => {
              const linkHref = safeUrl(cert.link, false);
              return `
                <div class="entry-card">
                  <div class="entry-top">
                    <div>
                      <h3 class="entry-title">${escapeHtml(cert.title)}</h3>
                      <div class="entry-subtitle">${escapeHtml(cert.issuer)}${cert.credentialId ? ` · ID: ${escapeHtml(cert.credentialId)}` : ""}</div>
                    </div>
                    ${cert.date ? `<span class="entry-meta">${escapeHtml(cert.date)}</span>` : ""}
                  </div>
                  ${
                    linkHref
                      ? `<a class="project-link" href="${escapeHtml(linkHref)}" target="_blank" rel="noopener noreferrer">Verify Credential ↗</a>`
                      : ""
                  }
                </div>
              `;
            })
            .join("")}
        </div>`
      : `<div class="empty-state">No trainings or certificates added yet.</div>`;

    return `
      <article class="panel-card" id="section-trainings">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> Trainings &amp; Certificates</h2>
        </div>
        ${body}
      </article>
    `;
  }

  function renderContactsSection() {
    const c = state.data.contacts || {};
    const socials = Array.isArray(c.socials) ? c.socials : [];
    const cv = c.cvResume || {};
    const cvSrc = safeUrl(cv.photo, true);

    const emailHtml = c.email
      ? `<div class="contact-card">
          <div>
            <div class="contact-label">Email</div>
            <div class="contact-value"><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></div>
          </div>
          <button class="btn btn-outline btn-sm copy-btn" type="button" data-copy="${escapeHtml(c.email)}">Copy</button>
        </div>`
      : "";

    const phoneHtml = c.phone
      ? `<div class="contact-card">
          <div>
            <div class="contact-label">Phone Number</div>
            <div class="contact-value"><a href="tel:${escapeHtml(c.phone.replace(/\s+/g, ""))}">${escapeHtml(c.phone)}</a></div>
          </div>
          <button class="btn btn-outline btn-sm copy-btn" type="button" data-copy="${escapeHtml(c.phone)}">Copy</button>
        </div>`
      : "";

    const socialsHtml = socials.length
      ? `<div class="socials-grid">
          ${socials
            .map((s) => {
              const href = safeUrl(s.url, false);
              if (href) {
                return `
                  <a class="social-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
                    <span class="social-platform">${escapeHtml(s.platform)} ↗</span>
                    <span class="social-handle">${escapeHtml(s.handle || href)}</span>
                  </a>`;
              }
              return `
                <div class="social-card">
                  <span class="social-platform">${escapeHtml(s.platform)}</span>
                  <span class="social-handle">${escapeHtml(s.handle)}</span>
                </div>`;
            })
            .join("")}
        </div>`
      : `<div class="empty-state">No social links added yet.</div>`;

    const cvTitle = cv.title || "CV / Resume";
    const cvHtml = `
      <h3 class="gallery-title">${escapeHtml(cvTitle)}</h3>
      <div class="cv-card">
        <div class="cv-preview-wrap">
          ${
            cvSrc
              ? `<img class="cv-thumb" src="${escapeHtml(cvSrc)}" alt="${escapeHtml(cvTitle)}" data-lightbox-src="${escapeHtml(cvSrc)}" data-lightbox-title="${escapeHtml(cvTitle)}" data-lightbox-caption="${escapeHtml(cv.caption || "")}" data-lightbox-download="true" />`
              : `<div class="cv-thumb-placeholder">CV / Resume<br/>Photo</div>`
          }
          <div>
            <div class="entry-title">${escapeHtml(cvTitle)}</div>
            <p class="entry-desc">${
              cvSrc
                ? escapeHtml(cv.caption || "Click to inspect full-size CV / Resume photo.")
                : "Insert your CV/Resume photo path in portfolio-data.js (contacts.cvResume.photo)."
            }</p>
          </div>
        </div>
        ${
          cvSrc
            ? `<div class="cv-actions">
                <button type="button" class="btn btn-outline btn-sm" data-lightbox-src="${escapeHtml(cvSrc)}" data-lightbox-title="${escapeHtml(cvTitle)}" data-lightbox-caption="${escapeHtml(cv.caption || "")}" data-lightbox-download="true">🔍 View Full Size</button>
                <a class="btn btn-outline btn-sm" href="${escapeHtml(cvSrc)}" download>⬇ Download</a>
              </div>`
            : ""
        }
      </div>
    `;

    return `
      <article class="panel-card" id="section-contacts">
        <div class="panel-header">
          <h2 class="panel-title"><span aria-hidden="true"></span> Contacts</h2>
        </div>
        ${c.locationNote ? `<p class="entry-desc" style="margin-bottom: 1rem;">${escapeHtml(c.locationNote)}</p>` : ""}
        <div class="contacts-grid">
          ${emailHtml}
          ${phoneHtml}
        </div>
        <h3 class="gallery-title">Socials</h3>
        ${socialsHtml}
        ${cvHtml}
      </article>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const name = (state.data.profile && state.data.profile.name) || "Personal Portfolio";
    document.getElementById("footer-copy").textContent = `© ${year} ${name}`;
  }

  /* -------------------- Lightbox Modal -------------------- */

  function openLightbox(src, title, caption, allowDownload) {
    const backdrop = document.getElementById("lightbox-backdrop");
    const img = document.getElementById("lightbox-img");
    const titleEl = document.getElementById("lightbox-title");
    const capEl = document.getElementById("lightbox-caption");
    const dlBtn = document.getElementById("lightbox-download");

    img.src = src;
    img.alt = title || "Preview";
    titleEl.textContent = title || "Preview";

    if (caption) {
      capEl.textContent = caption;
      capEl.classList.remove("hidden");
    } else {
      capEl.classList.add("hidden");
    }

    if (allowDownload) {
      dlBtn.href = src;
      dlBtn.classList.remove("hidden");
    } else {
      dlBtn.classList.add("hidden");
    }

    backdrop.classList.remove("hidden");
  }

  function closeLightbox() {
    document.getElementById("lightbox-backdrop").classList.add("hidden");
  }

  /* -------------------- Quick Jump Command Palette -------------------- */

  function getPaletteCommands() {
    const c = state.data.contacts || {};
    const cmds = [
      { label: "Go to About Me", hint: "Section", run: () => navigateToSection("about") },
      { label: "Go to My Education", hint: "Section", run: () => navigateToSection("education") },
      { label: "Go to Skills & Expertise", hint: "Section", run: () => navigateToSection("skills") },
      { label: "Go to Projects & Research", hint: "Section", run: () => navigateToSection("projects") },
      { label: "Go to Trainings & Certificates", hint: "Section", run: () => navigateToSection("trainings") },
      { label: "Go to Contacts", hint: "Section", run: () => navigateToSection("contacts") },
      {
        label: state.viewAll ? "Switch to Single Section View" : "View All Sections",
        hint: "Layout",
        run: () => {
          state.viewAll = !state.viewAll;
          renderNavState();
          renderStage();
        }
      }
    ];

    if (c.email) {
      cmds.push({
        label: `Copy Email (${c.email})`,
        hint: "Copy",
        run: () => copyText(c.email)
      });
    }
    if (c.phone) {
      cmds.push({
        label: `Copy Phone (${c.phone})`,
        hint: "Copy",
        run: () => copyText(c.phone)
      });
    }
    if (c.cvResume && safeUrl(c.cvResume.photo, true)) {
      const src = safeUrl(c.cvResume.photo, true);
      cmds.push({
        label: "View CV / Resume Photo",
        hint: "Preview",
        run: () => openLightbox(src, c.cvResume.title || "CV / Resume", c.cvResume.caption || "", true)
      });
    }
    return cmds;
  }

  function openPalette() {
    const backdrop = document.getElementById("palette-backdrop");
    const input = document.getElementById("palette-input");
    backdrop.classList.remove("hidden");
    input.value = "";
    renderPaletteList("");
    input.focus();
  }

  function closePalette() {
    document.getElementById("palette-backdrop").classList.add("hidden");
  }

  function renderPaletteList(query) {
    const list = document.getElementById("palette-list");
    const q = query.trim().toLowerCase();
    const commands = getPaletteCommands().filter((cmd) => cmd.label.toLowerCase().includes(q));

    if (!commands.length) {
      list.innerHTML = `<li class="empty-state" style="padding:0.9rem;">No matching commands</li>`;
      return;
    }

    list.innerHTML = commands
      .map(
        (cmd, idx) => `
        <li>
          <button type="button" class="palette-item ${idx === 0 ? "active" : ""}" data-cmd-idx="${idx}">
            <span>${escapeHtml(cmd.label)}</span>
            <span class="palette-item-hint">${escapeHtml(cmd.hint)}</span>
          </button>
        </li>`
      )
      .join("");

    list.querySelectorAll(".palette-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = commands[Number(btn.getAttribute("data-cmd-idx"))];
        closePalette();
        if (cmd) cmd.run();
      });
    });
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied: ${value}`);
    } catch (_) {
      showToast("Copy failed — please select and copy manually.");
    }
  }

  /* -------------------- Live Telemetry Clock -------------------- */

  function startTelemetryClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    function tick() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      clockEl.textContent = `ONLINE · ${timeStr}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* -------------------- GIF-Like Animated Digital Background -------------------- */

  function initDataStreamBackground() {
    const canvas = document.getElementById("bg-data-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLUMN_TYPES = ["binary", "decimal", "hexpair", "mac", "ip"];
    let columns = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let tickCount = 0;

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function hexByte() {
      return randInt(0, 255).toString(16).toUpperCase().padStart(2, "0");
    }

    function makeToken(type) {
      switch (type) {
        case "binary": {
          let s = "";
          for (let i = 0; i < 10; i++) s += Math.random() > 0.5 ? "1" : "0";
          return s;
        }
        case "decimal":
          return `${randInt(10000, 99999)}.${randInt(10000, 99999)}`;
        case "hexpair":
          return `x${randInt(1000, 9999)}-${randInt(10, 99)}`;
        case "mac":
          return `${hexByte()}:${hexByte()}:${hexByte()}:${hexByte()}`;
        case "ip":
          return `.${randInt(10, 254)}.${randInt(10, 254)}.${randInt(1, 99)}.`;
        default:
          return "01010101";
      }
    }

    function buildColumns() {
      columns = [];
      const colSpacing = 114;
      const count = Math.ceil(width / colSpacing) + 4;

      for (let i = 0; i < count; i++) {
        const type = COLUMN_TYPES[i % COLUMN_TYPES.length];
        const depth = 0.74 + (i % 4) * 0.11;
        const rowHeight = Math.round(19 * depth);
        const rowsCount = Math.ceil(height / rowHeight) + 8;
        const rows = [];
        for (let r = 0; r < rowsCount; r++) {
          rows.push(makeToken(type));
        }

        columns.push({
          baseX: (i - 1) * colSpacing,
          type,
          depth,
          rowHeight,
          fontSize: Math.round(12.5 * depth),
          speed: (0.75 + Math.random() * 0.85) * depth,
          offset: Math.random() * rowHeight,
          pulseRow: Math.random() * rowsCount,
          pulseSpeed: 0.11 + Math.random() * 0.11,
          rows
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns();
    }

    function drawFrame() {
      tickCount += 1;
      ctx.clearRect(0, 0, width, height);

      // Gentle GIF-like camera drift and 3D perspective angle
      const driftX = Math.sin(tickCount * 0.014) * 14;
      const driftY = Math.cos(tickCount * 0.011) * 6;
      const sweepY = ((tickCount * 2.2) % (height + 240)) - 120;

      ctx.save();
      ctx.translate(width * 0.5 + driftX, height * 0.5 + driftY);
      ctx.transform(1, -0.055, 0.075, 1, 0, 0);
      ctx.translate(-width * 0.5, -height * 0.5);

      for (let c = 0; c < columns.length; c++) {
        const col = columns[c];
        ctx.font = `600 ${col.fontSize}px "JetBrains Mono", Consolas, monospace`;
        ctx.textBaseline = "top";

        col.offset += col.speed;
        if (col.offset >= col.rowHeight) {
          col.offset -= col.rowHeight;
          col.rows.pop();
          col.rows.unshift(makeToken(col.type));
        }
        col.pulseRow = (col.pulseRow + col.pulseSpeed) % col.rows.length;

        // Occasional live token mutation for authentic GIF telemetry shimmer
        if (Math.random() < 0.06) {
          const mutIdx = randInt(0, col.rows.length - 1);
          col.rows[mutIdx] = makeToken(col.type);
        }

        for (let r = 0; r < col.rows.length; r++) {
          const y = (r - 3) * col.rowHeight + col.offset;
          if (y < -col.rowHeight || y > height + col.rowHeight) continue;

          const distPulse = Math.abs(r - col.pulseRow);
          const distSweep = Math.abs(y - sweepY);
          const sweepGlow = Math.max(0, 1 - distSweep / 95);
          const pulseGlow = Math.max(0, 1 - distPulse / 4.5);

          if (distPulse < 1.15 || (sweepGlow > 0.72 && (r + c) % 3 === 0)) {
            ctx.shadowColor = "rgba(186, 230, 253, 0.95)";
            ctx.shadowBlur = 13;
            ctx.fillStyle = "rgba(224, 242, 254, 0.96)";
          } else if (pulseGlow > 0.08 || sweepGlow > 0.12) {
            ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
            ctx.shadowBlur = 8;
            const alpha = Math.min(0.92, 0.34 + pulseGlow * 0.52 + sweepGlow * 0.28);
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
          } else {
            ctx.shadowBlur = 0;
            const baseAlpha = 0.2 + ((r + c) % 3) * 0.08;
            ctx.fillStyle = `rgba(37, 99, 235, ${baseAlpha.toFixed(2)})`;
          }

          ctx.fillText(col.rows[r], col.baseX, y);
        }
      }

      ctx.restore();
      ctx.shadowBlur = 0;
      rafId = window.requestAnimationFrame(drawFrame);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = window.requestAnimationFrame(drawFrame);

    window.addEventListener("beforeunload", () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    });
  }

  /* -------------------- Global Wireup -------------------- */

  function init() {
    renderAll();
    startTelemetryClock();
    initDataStreamBackground();

    // Section navigation buttons
    document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateToSection(btn.getAttribute("data-section"));
      });
    });

    // View All toggle
    document.getElementById("view-all-btn").addEventListener("click", () => {
      state.viewAll = !state.viewAll;
      renderNavState();
      renderStage();
    });

    // Delegated interactions inside stage (copy, project filter, skill filter, lightbox triggers)
    const stage = document.getElementById("section-stage");

    stage.addEventListener("click", (e) => {
      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        copyText(copyBtn.getAttribute("data-copy"));
        return;
      }

      const projBtn = e.target.closest("[data-proj-filter]");
      if (projBtn) {
        state.projectFilter = projBtn.getAttribute("data-proj-filter");
        renderStage();
        return;
      }

      const lbTrigger = e.target.closest("[data-lightbox-src]");
      if (lbTrigger) {
        openLightbox(
          lbTrigger.getAttribute("data-lightbox-src"),
          lbTrigger.getAttribute("data-lightbox-title"),
          lbTrigger.getAttribute("data-lightbox-caption"),
          lbTrigger.getAttribute("data-lightbox-download") === "true"
        );
      }
    });

    stage.addEventListener("input", (e) => {
      if (e.target && e.target.id === "skill-filter-input") {
        state.skillQuery = e.target.value;
        const cursorPos = e.target.selectionStart;
        renderStage();
        const freshInput = document.getElementById("skill-filter-input");
        if (freshInput) {
          freshInput.focus();
          freshInput.setSelectionRange(cursorPos, cursorPos);
        }
      }
    });

    // Lightbox close
    document.getElementById("close-lightbox-btn").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "lightbox-backdrop") closeLightbox();
    });

    // Quick Jump Palette
    document.getElementById("open-palette-btn").addEventListener("click", openPalette);
    document.getElementById("close-palette-btn").addEventListener("click", closePalette);
    document.getElementById("palette-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "palette-backdrop") closePalette();
    });
    document.getElementById("palette-input").addEventListener("input", (e) => {
      renderPaletteList(e.target.value);
    });
    document.getElementById("palette-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const firstBtn = document.querySelector("#palette-list .palette-item");
        if (firstBtn) firstBtn.click();
      }
    });

    // Keyboard shortcuts (Ctrl+K / Escape)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        closeLightbox();
        closePalette();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
