/* ==========================================================================
   EDITOR STATE — sumber kebenaran tunggal untuk isi & gaya sertifikat.
   Pola: state tunggal + subscriber render + tumpukan undo/redo + autosave.
   ========================================================================== */
const STORAGE_KEY_STATE = "sertifikat-maker:editor-state";
const ELEMENT_KEYS = [
  "title", "recipientName", "description", "certNumber",
  "organizer", "date", "signerName", "signerTitle",
];

const EditorState = {
  data: null,
  _listeners: [],
  _undoStack: [],
  _redoStack: [],
  _suspendHistory: false,

  /** Bangun state bawaan dari sebuah template. */
  createDefault(templateId){
    const tpl = getTemplateById(templateId);
    return {
      templateId: tpl.id,
      content: {
        title: "SERTIFIKAT PENGHARGAAN",
        recipientName: "Ayu Kartika Sari",
        description: "diberikan kepada nama di atas atas dedikasi, kinerja, dan kontribusi luar biasa yang telah diberikan.",
        certNumber: "No: 001/CERT/VIII/2026",
        organizer: "Nama Organisasi / Lembaga",
        date: todayIndonesian(),
        signerName: "Nama Penandatangan",
        signerTitle: "Jabatan / Posisi",
      },
      images: { logo: null, signature: null },
      style: {
        fontFamily: tpl.defaultStyle.fontFamily,
        textColor: tpl.defaultStyle.textColor,
        accentColor: tpl.defaultStyle.accentColor,
        backgroundColor: tpl.defaultStyle.backgroundColor,
        borderStyle: tpl.defaultStyle.borderStyle,
        borderWidth: tpl.defaultStyle.borderWidth,
        borderColor: tpl.defaultStyle.borderColor,
      },
      elementStyles: ELEMENT_KEYS.reduce((acc, key) => {
        acc[key] = { fontSize: tpl.defaultStyle.sizes[key] || 16, align: tpl.defaultStyle.align };
        return acc;
      }, {}),
      positions: JSON.parse(JSON.stringify(tpl.positions)),
    };
  },

  /** Inisialisasi: coba muat dari localStorage, jika tak ada gunakan template terpilih / default. */
  init(){
    const requestedTemplate = localStorage.getItem("sertifikat-maker:selected-template");
    const saved = localStorage.getItem(STORAGE_KEY_STATE);

    if (saved){
      try {
        const parsed = JSON.parse(saved);
        // Jika pengguna baru saja memilih template berbeda dari galeri, mulai ulang dari template itu.
        if (requestedTemplate && requestedTemplate !== parsed.templateId){
          this.data = this.createDefault(requestedTemplate);
        } else {
          this.data = parsed;
        }
      } catch (e){
        this.data = this.createDefault(requestedTemplate || "modern");
      }
    } else {
      this.data = this.createDefault(requestedTemplate || "modern");
    }
    localStorage.removeItem("sertifikat-maker:selected-template");
    this._pushHistory(true);
    this._persist();
  },

  /** Ganti ke template lain, isi teks tetap dipertahankan. */
  switchTemplate(templateId){
    const tpl = getTemplateById(templateId);
    const fresh = this.createDefault(templateId);
    fresh.content = { ...this.data.content }; // pertahankan isi teks pengguna
    fresh.images = { ...this.data.images };   // pertahankan logo & tanda tangan
    this.data = fresh;
    this._commit();
  },

  /** Perbarui satu path bertingkat pada state, mis. update("content.title", "Judul Baru"). */
  update(path, value){
    const keys = path.split(".");
    let obj = this.data;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    this._commit();
  },

  updatePosition(key, x, y){
    this.data.positions[key] = { ...this.data.positions[key], x, y };
    this._commit(true); // posisi berubah cepat saat drag — hemat entry histori
  },

  resetPositions(){
    const tpl = getTemplateById(this.data.templateId);
    this.data.positions = JSON.parse(JSON.stringify(tpl.positions));
    this._commit();
  },

  /** Daftarkan fungsi yang dipanggil setiap kali state berubah. */
  subscribe(fn){ this._listeners.push(fn); },

  _notify(){ this._listeners.forEach((fn) => fn(this.data)); },

  _commit(isDragLike = false){
    this._notify();
    this._persist();
    if (!isDragLike) this._pushHistory();
  },

  _persist(){
    debounce(() => localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(this.data)), 300)();
    const indicator = document.getElementById("autosave-text");
    if (indicator) indicator.textContent = "Tersimpan";
  },

  _pushHistory(isInitial = false){
    if (this._suspendHistory) return;
    this._undoStack.push(JSON.stringify(this.data));
    if (this._undoStack.length > 60) this._undoStack.shift();
    if (!isInitial) this._redoStack = [];
  },

  undo(){
    if (this._undoStack.length < 2) return;
    this._redoStack.push(this._undoStack.pop());
    const prev = this._undoStack[this._undoStack.length - 1];
    this.data = JSON.parse(prev);
    this._notify();
    this._persist();
  },

  redo(){
    if (!this._redoStack.length) return;
    const next = this._redoStack.pop();
    this._undoStack.push(next);
    this.data = JSON.parse(next);
    this._notify();
    this._persist();
  },
};
