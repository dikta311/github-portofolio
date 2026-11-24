/* ==========================================================================
   UPLOAD — logo & tanda tangan (unggah, pratinjau, hapus)
   ========================================================================== */
function setupImageUpload(kind){
  const zone = document.getElementById(`zone-${kind}`);
  const input = document.getElementById(`inp-${kind}`);
  const preview = document.getElementById(`preview-${kind}`);
  const previewImg = document.getElementById(`preview-${kind}-img`);
  const removeBtn = document.getElementById(`btn-remove-${kind}`);

  async function handleFile(file){
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataURL(file);
      EditorState.update(`images.${kind}`, dataUrl);
      previewImg.src = dataUrl;
      preview.hidden = false;
      showToast(`${kind === "logo" ? "Logo" : "Tanda tangan"} berhasil diunggah.`, "success");
    } catch (err){
      showToast(err.message || "Gagal mengunggah gambar.", "error");
    }
  }

  input.addEventListener("change", (e) => handleFile(e.target.files[0]));

  ["dragenter", "dragover"].forEach((evt) => {
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach((evt) => {
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove("dragover"); });
  });
  zone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  });

  removeBtn.addEventListener("click", () => {
    EditorState.update(`images.${kind}`, null);
    preview.hidden = true;
    input.value = "";
    showToast(`${kind === "logo" ? "Logo" : "Tanda tangan"} dihapus.`, "info");
  });
}

function fillUploadPreviewsFromState(){
  ["logo", "signature"].forEach((kind) => {
    const value = EditorState.data.images[kind];
    const preview = document.getElementById(`preview-${kind}`);
    const previewImg = document.getElementById(`preview-${kind}-img`);
    if (value){
      previewImg.src = value;
      preview.hidden = false;
    } else {
      preview.hidden = true;
    }
  });
}

function initEditorUpload(){
  setupImageUpload("logo");
  setupImageUpload("signature");
  fillUploadPreviewsFromState();
  EditorState.subscribe(fillUploadPreviewsFromState);
}
