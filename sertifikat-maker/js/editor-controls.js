/* ==========================================================================
   EDITOR CONTROLS — mengikat sidebar & toolbar ke EditorState
   ========================================================================== */
const COLOR_PRESETS_TEXT = ["#1b2a4a", "#201f1d", "#3d2c1e", "#26331f", "#7a2e3b", "#fdfbf5"];
const COLOR_PRESETS_ACCENT = ["#c9a227", "#d9b74a", "#2c5f8a", "#4c6444", "#7a2e3b", "#101a2e"];
const COLOR_PRESETS_BG = ["#ffffff", "#fffaf0", "#faf6ec", "#f3f5f9", "#101a2e", "#1b2a4a"];

let selectedElementKey = null;

/** Perbarui satu input sidebar tanpa memicu event loop, dipanggil dari editor-render.js. */
function syncSidebarField(key, value){
  const input = document.getElementById(`inp-${key}`);
  if (input && document.activeElement !== input) input.value = value;
}

function bindContentFields(){
  ELEMENT_KEYS.forEach((key) => {
    const input = document.getElementById(`inp-${key}`);
    if (!input) return;
    input.addEventListener("input", () => {
      EditorState.update(`content.${key}`, input.value);
    });
  });
}

function fillContentFieldsFromState(){
  ELEMENT_KEYS.forEach((key) => {
    const input = document.getElementById(`inp-${key}`);
    if (input) input.value = EditorState.data.content[key] || "";
  });
}

function buildColorPresets(containerId, colors, onPick){
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  colors.forEach((c) => {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "color-swatch";
    sw.style.background = c;
    sw.title = c;
    sw.addEventListener("click", () => onPick(c));
    container.appendChild(sw);
  });
}

function bindStyleFields(){
  const fontSel = document.getElementById("sel-font");
  fontSel.addEventListener("change", () => EditorState.update("style.fontFamily", fontSel.value));

  const colText = document.getElementById("col-text");
  colText.addEventListener("input", () => EditorState.update("style.textColor", colText.value));
  buildColorPresets("preset-text", COLOR_PRESETS_TEXT, (c) => { colText.value = c; EditorState.update("style.textColor", c); });

  const colAccent = document.getElementById("col-accent");
  colAccent.addEventListener("input", () => EditorState.update("style.accentColor", colAccent.value));
  buildColorPresets("preset-accent", COLOR_PRESETS_ACCENT, (c) => { colAccent.value = c; EditorState.update("style.accentColor", c); });

  const colBg = document.getElementById("col-bg");
  colBg.addEventListener("input", () => EditorState.update("style.backgroundColor", colBg.value));
  buildColorPresets("preset-bg", COLOR_PRESETS_BG, (c) => { colBg.value = c; EditorState.update("style.backgroundColor", c); });

  const borderSel = document.getElementById("sel-border-style");
  borderSel.addEventListener("change", () => EditorState.update("style.borderStyle", borderSel.value));

  const borderWidth = document.getElementById("rng-borderwidth");
  const borderWidthVal = document.getElementById("rng-borderwidth-val");
  borderWidth.addEventListener("input", () => {
    borderWidthVal.textContent = `${borderWidth.value}px`;
    EditorState.update("style.borderWidth", parseInt(borderWidth.value, 10));
  });

  const fontSizeRange = document.getElementById("rng-fontsize");
  const fontSizeVal = document.getElementById("rng-fontsize-val");
  fontSizeRange.addEventListener("input", () => {
    fontSizeVal.textContent = `${fontSizeRange.value}px`;
    if (!selectedElementKey) return;
    EditorState.data.elementStyles[selectedElementKey].fontSize = parseInt(fontSizeRange.value, 10);
    EditorState._commit();
  });

  document.getElementById("align-group").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-align]");
    if (!btn || !selectedElementKey) return;
    document.querySelectorAll("#align-group button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    EditorState.data.elementStyles[selectedElementKey].align = btn.dataset.align;
    EditorState._commit();
  });
}

function fillStyleFieldsFromState(){
  const s = EditorState.data.style;
  document.getElementById("sel-font").value = s.fontFamily;
  document.getElementById("col-text").value = s.textColor;
  document.getElementById("col-accent").value = s.accentColor;
  document.getElementById("col-bg").value = s.backgroundColor;
  document.getElementById("sel-border-style").value = s.borderStyle;
  document.getElementById("rng-borderwidth").value = s.borderWidth;
  document.getElementById("rng-borderwidth-val").textContent = `${s.borderWidth}px`;
}

function updateSelectedElementPanel(key){
  const label = document.getElementById("selected-el-label");
  const fontSizeRange = document.getElementById("rng-fontsize");
  const fontSizeVal = document.getElementById("rng-fontsize-val");

  if (!key){
    selectedElementKey = null;
    label.textContent = "Klik salah satu teks pada sertifikat untuk mengatur gaya spesifiknya, atau atur gaya global di bawah.";
    fontSizeRange.disabled = true;
    fontSizeVal.textContent = "—";
    document.querySelectorAll("#align-group button").forEach((b) => b.classList.remove("active"));
    return;
  }
  selectedElementKey = key;
  const es = EditorState.data.elementStyles[key];
  label.textContent = `Mengatur gaya untuk: ${ELEMENT_LABELS[key]}`;
  fontSizeRange.disabled = false;
  fontSizeRange.value = es.fontSize;
  fontSizeVal.textContent = `${es.fontSize}px`;
  document.querySelectorAll("#align-group button").forEach((b) => b.classList.toggle("active", b.dataset.align === es.align));
}

function bindSelectionEvents(){
  document.addEventListener("certel:selected", (e) => {
    updateSelectedElementPanel(e.detail.key);
    // Pindah otomatis ke tab Gaya agar pengguna langsung melihat kontrolnya.
    document.querySelector('.sidebar-tab[data-tab="gaya"]').click();
  });
  document.addEventListener("certel:deselected", () => updateSelectedElementPanel(null));
}

function bindSidebarTabs(){
  document.querySelectorAll(".sidebar-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".sidebar-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`.sidebar-panel[data-panel="${tab.dataset.tab}"]`).classList.add("active");
    });
  });
}

function buildTemplateMiniGrid(){
  const grid = document.getElementById("tpl-mini-grid");
  grid.innerHTML = "";
  TEMPLATES.forEach((tpl) => {
    const mini = document.createElement("div");
    mini.className = "tpl-mini " + tpl.thumbClass;
    mini.title = tpl.name;
    if (tpl.id === EditorState.data.templateId) mini.classList.add("selected");
    mini.innerHTML = `<span>${tpl.name}</span>`;
    mini.addEventListener("click", () => {
      EditorState.switchTemplate(tpl.id);
      document.querySelectorAll(".tpl-mini").forEach((m) => m.classList.remove("selected"));
      mini.classList.add("selected");
      showToast(`Beralih ke template ${tpl.name}`, "success", 1600);
    });
    grid.appendChild(mini);
  });
}

function bindToolbarActions(){
  document.getElementById("btn-undo").addEventListener("click", () => EditorState.undo());
  document.getElementById("btn-redo").addEventListener("click", () => EditorState.redo());

  const modal = document.getElementById("modal-reset");
  const openResetModal = () => modal.classList.add("show");
  document.getElementById("btn-reset-positions").addEventListener("click", openResetModal);
  document.getElementById("btn-reset-positions-2").addEventListener("click", openResetModal);
  document.getElementById("modal-reset-cancel").addEventListener("click", () => modal.classList.remove("show"));
  document.getElementById("modal-reset-confirm").addEventListener("click", () => {
    EditorState.resetPositions();
    modal.classList.remove("show");
    showToast("Posisi elemen direset ke bawaan template.", "success");
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

  // Pintasan keyboard
  document.addEventListener("keydown", (e) => {
    const inField = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !inField){
      e.preventDefault(); EditorState.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !inField){
      e.preventDefault(); EditorState.redo();
    }
  });
}

function initEditorControls(){
  bindSidebarTabs();
  bindContentFields();
  bindStyleFields();
  bindSelectionEvents();
  buildTemplateMiniGrid();
  bindToolbarActions();

  EditorState.subscribe(() => {
    fillContentFieldsFromState();
    fillStyleFieldsFromState();
  });
  fillContentFieldsFromState();
  fillStyleFieldsFromState();
}
