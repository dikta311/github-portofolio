/* ==========================================================================
   EDITOR INIT — titik masuk halaman editor
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  EditorState.init();
  initEditorControls();
  initEditorUpload();
  initExport();
  renderCertificate(EditorState.data); // render pertama; perubahan berikutnya ditangani oleh subscriber
});
