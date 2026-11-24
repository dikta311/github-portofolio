/* ==========================================================================
   HALAMAN PILIH TEMPLATE — render galeri, filter kategori, pilih & lanjut
   ========================================================================== */
const CATEGORY_LABEL = { formal: "Formal", kreatif: "Kreatif", akademik: "Akademik" };

function buildTemplateCard(tpl, index){
  const card = document.createElement("article");
  card.className = "tpl-card";
  card.style.animationDelay = `${index * 60}ms`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Gunakan template ${tpl.name}`);
  card.dataset.category = tpl.category;

  card.innerHTML = `
    <div class="tpl-thumb ${tpl.thumbClass}">
      <div class="tpl-thumb-inner">
        <span class="tt-eyebrow">Sertifikat</span>
        <h3>${tpl.name === "Corporate" ? "Penghargaan Kinerja" : "Judul Sertifikat"}</h3>
        <div class="tt-line"></div>
        <span class="tt-name">Nama Penerima</span>
      </div>
    </div>
    <div class="tpl-meta">
      <div class="tpl-meta-top">
        <h4>${tpl.name}</h4>
        <span class="badge">${CATEGORY_LABEL[tpl.category]}</span>
      </div>
      <p>${tpl.tagline}</p>
      <button class="btn btn-primary tpl-use-btn" type="button">Gunakan Template Ini</button>
    </div>
  `;

  const selectTemplate = () => {
    localStorage.setItem("sertifikat-maker:selected-template", tpl.id);
    showToast(`Template ${tpl.name} dipilih. Membuka editor…`, "success", 1200);
    setTimeout(() => { window.location.href = "editor.html"; }, 350);
  };

  card.addEventListener("click", selectTemplate);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){ e.preventDefault(); selectTemplate(); }
  });

  return card;
}

function renderTemplateGrid(filter = "all"){
  const grid = document.getElementById("tpl-grid");
  grid.innerHTML = "";
  const filtered = filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  if (!filtered.length){
    grid.innerHTML = `<div class="empty-state">Tidak ada template pada kategori ini.</div>`;
    return;
  }
  filtered.forEach((tpl, i) => grid.appendChild(buildTemplateCard(tpl, i)));
}

document.addEventListener("DOMContentLoaded", () => {
  renderTemplateGrid("all");

  document.getElementById("tpl-filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".tpl-filter");
    if (!btn) return;
    document.querySelectorAll(".tpl-filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTemplateGrid(btn.dataset.filter);
  });
});
