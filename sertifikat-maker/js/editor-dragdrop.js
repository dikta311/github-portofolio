/* ==========================================================================
   DRAG & DROP — geser elemen teks/gambar bebas di atas panggung sertifikat.
   Klik singkat (tanpa geser) pada teks akan tetap membuka mode edit langsung
   (karena elemen berbasis contenteditable). Klik + tahan + geser memindahkan posisi.
   ========================================================================== */
const DragDrop = {
  _dragThreshold: 4,
  _state: null, // { el, key, startX, startY, startLeftPct, startTopPct, dragging }

  refresh(){
    const stage = document.getElementById("certificate-stage");
    stage.querySelectorAll(".cert-el").forEach((el) => {
      el.addEventListener("mousedown", (e) => this._onMouseDown(e, el), { passive: true });
      el.addEventListener("touchstart", (e) => this._onTouchStart(e, el), { passive: true });
    });
    // Klik area kosong panggung membatalkan seleksi.
    stage.onclick = (e) => {
      if (e.target === stage) this._deselectAll();
    };
  },

  _select(el){
    this._deselectAll();
    el.classList.add("selected");
    document.dispatchEvent(new CustomEvent("certel:selected", { detail: { key: el.dataset.key } }));
  },

  _deselectAll(){
    document.querySelectorAll(".cert-el.selected").forEach((n) => n.classList.remove("selected"));
    document.dispatchEvent(new CustomEvent("certel:deselected"));
  },

  _onMouseDown(e, el){
    if (e.button !== 0) return;
    const stage = document.getElementById("certificate-stage");
    const rect = stage.getBoundingClientRect();
    this._state = {
      el, key: el.dataset.key,
      startX: e.clientX, startY: e.clientY,
      startLeftPct: parseFloat(el.style.left), startTopPct: parseFloat(el.style.top),
      rect, dragging: false, isImage: el.classList.contains("el-image"),
    };
    const move = (ev) => this._onMouseMove(ev);
    const up = (ev) => { this._onMouseUp(ev); document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  },

  _onMouseMove(e){
    const s = this._state;
    if (!s) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.dragging){
      if (Math.abs(dx) < this._dragThreshold && Math.abs(dy) < this._dragThreshold) return;
      s.dragging = true;
      s.el.classList.add("dragging");
      s.el.blur();
      // Cegah caret/seleksi teks saat menggeser elemen teks.
      window.getSelection && window.getSelection().removeAllRanges();
    }
    const pctX = clamp(s.startLeftPct + (dx / s.rect.width) * 100, 2, 98);
    const pctY = clamp(s.startTopPct + (dy / s.rect.height) * 100, 2, 98);
    s.el.style.left = `${pctX}%`;
    s.el.style.top = `${pctY}%`;
  },

  _onMouseUp(){
    const s = this._state;
    if (!s) return;
    if (s.dragging){
      s.el.classList.remove("dragging");
      const x = parseFloat(s.el.style.left);
      const y = parseFloat(s.el.style.top);
      EditorState.updatePosition(s.key, x, y);
      EditorState._pushHistory(); // satu entri histori untuk keseluruhan aksi geser
    } else {
      this._select(s.el);
      if (!s.isImage){
        s.el.focus();
        this._placeCaretAtEnd(s.el);
      }
    }
    this._state = null;
  },

  _placeCaretAtEnd(el){
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) { /* abaikan di browser lawas */ }
  },

  // --- Dukungan sentuh dasar (mobile/tablet) ---
  _onTouchStart(e, el){
    const touch = e.touches[0];
    const fakeMouseDown = { button: 0, clientX: touch.clientX, clientY: touch.clientY };
    this._onMouseDown(fakeMouseDown, el);
    const move = (ev) => {
      const t = ev.touches[0];
      this._onMouseMove({ clientX: t.clientX, clientY: t.clientY });
    };
    const end = () => {
      this._onMouseUp();
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
    document.addEventListener("touchmove", move, { passive: true });
    document.addEventListener("touchend", end);
  },
};
