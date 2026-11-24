/* ==========================================================================
   EDITOR RENDER — mengubah EditorState menjadi elemen DOM di #certificate-stage
   ========================================================================== */
const BORDER_CLASS_MAP = {
  none: "cert-border-none",
  thin: "cert-border-thin",
  solid: "cert-border-solid",
  double: "cert-border-double",
};

const ELEMENT_LABELS = {
  title: "Judul Sertifikat", recipientName: "Nama Penerima", description: "Deskripsi",
  certNumber: "Nomor Sertifikat", organizer: "Nama Penyelenggara", date: "Tanggal",
  signerName: "Nama Penandatangan", signerTitle: "Jabatan Penandatangan",
  logo: "Logo", signature: "Tanda Tangan",
};

/** Markup dekorasi unik tiap template (elemen DOM nyata agar ikut terekspor). */
function decorHTMLFor(templateId){
  switch (templateId){
    case "modern":
      return `<div class="modern-line"></div>`;
    case "elegant":
      return `<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>`;
    case "corporate":
      return `<div class="corp-tag">RESMI &middot; TERVERIFIKASI</div>`;
    case "minimalist":
      return `<div class="min-topline"></div>`;
    case "academic":
      return `<div class="academic-topband"></div>
        <svg class="laurel" viewBox="0 0 64 64" fill="none" stroke="#4c6444" stroke-width="2">
          <path d="M32 6c-9 9-9 28 0 38M32 6c9 9 9 28 0 38M21 20c-4 5-4 13 2 19M43 20c4 5 4 13-2 19"/>
        </svg>`;
    case "vintage":
      return `<div class="vintage-stamp"></div>`;
    default:
      return "";
  }
}

function renderCertificate(state){
  const stage = document.getElementById("certificate-stage");
  if (!stage) return;
  const tpl = getTemplateById(state.templateId);

  // --- Kelas & warna dasar panggung ---
  stage.className = tpl.stageClass;
  stage.classList.add(BORDER_CLASS_MAP[state.style.borderStyle] || "cert-border-none");
  stage.style.setProperty("--bw", `${state.style.borderWidth}px`);
  stage.style.setProperty("--bc", state.style.borderColor);
  stage.style.backgroundColor = state.style.backgroundColor;

  // --- Dekorasi unik template ---
  const decor = document.getElementById("cert-decor");
  decor.innerHTML = decorHTMLFor(tpl.id);
  decor.style.setProperty("--accent", state.style.accentColor);
  decor.querySelectorAll(".modern-line, .min-topline").forEach((n) => (n.style.background = state.style.accentColor));
  decor.querySelectorAll(".corner").forEach((n) => (n.style.borderColor = state.style.accentColor));

  // --- Label nama template pada toolbar ---
  const nameTag = document.getElementById("tpl-name-tag");
  if (nameTag) nameTag.textContent = `Template: ${tpl.name}`;

  // --- Bersihkan elemen konten lama (sisakan inset-border & decor) ---
  stage.querySelectorAll(".cert-el").forEach((n) => n.remove());

  // --- Elemen teks ---
  ELEMENT_KEYS.forEach((key) => {
    const pos = state.positions[key] || { x: 50, y: 50 };
    const es = state.elementStyles[key] || { fontSize: 16, align: "center" };
    const el = document.createElement("div");
    el.className = "cert-el el-text";
    el.dataset.key = key;
    el.contentEditable = "true";
    el.spellcheck = false;
    el.setAttribute("aria-label", ELEMENT_LABELS[key]);
    el.style.left = `${pos.x}%`;
    el.style.top = `${pos.y}%`;
    el.style.width = `${tpl.positions[key] ? tpl.positions[key].w : 40}%`;
    el.style.fontSize = `${es.fontSize}px`;
    el.style.textAlign = es.align;
    el.style.color = state.style.textColor;
    el.style.fontFamily = state.style.fontFamily;
    el.style.fontWeight = (key === "title") ? "700" : (key === "recipientName" ? "600" : "400");
    el.style.fontStyle = (key === "recipientName" && tpl.defaultStyle.align === "center") ? "italic" : "normal";
    el.textContent = state.content[key] || "";

    // Sinkronkan pengetikan langsung di kanvas TANPA memicu render ulang penuh
    // (render ulang akan menghapus fokus/kursor saat sedang mengetik).
    el.addEventListener("input", () => {
      EditorState.data.content[key] = el.textContent;
      EditorState._persist();
      if (typeof syncSidebarField === "function") syncSidebarField(key, el.textContent);
    });
    el.addEventListener("blur", () => { EditorState._pushHistory(); });

    stage.appendChild(el);
  });

  // --- Logo & tanda tangan (hanya jika sudah diunggah) ---
  ["logo", "signature"].forEach((key) => {
    if (!state.images[key]) return;
    const pos = state.positions[key] || { x: 50, y: 15 };
    const el = document.createElement("div");
    el.className = "cert-el el-image";
    el.dataset.key = key;
    el.setAttribute("aria-label", ELEMENT_LABELS[key]);
    el.style.left = `${pos.x}%`;
    el.style.top = `${pos.y}%`;
    el.style.width = `${pos.w || (tpl.positions[key] ? tpl.positions[key].w : 14)}%`;
    const img = document.createElement("img");
    img.src = state.images[key];
    img.alt = ELEMENT_LABELS[key];
    img.draggable = false;
    el.appendChild(img);
    stage.appendChild(el);
  });

  DragDrop.refresh();
}

EditorState.subscribe(renderCertificate);
