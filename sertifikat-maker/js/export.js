/* ==========================================================================
   EXPORT — unduh sertifikat sebagai PNG (resolusi tinggi) & PDF (A4, ~300 DPI)
   ========================================================================== */
const EXPORT_SCALE = 3.125; // 1123px panggung ≈ A4 landscape @96dpi → x3.125 = ~300dpi
const A4_LANDSCAPE_MM = { width: 297, height: 210 };

function sanitizeFilename(text){
  return (text || "sertifikat")
    .normalize("NFKD").replace(/[^\w\s-]/g, "")
    .trim().replace(/\s+/g, "-").toLowerCase() || "sertifikat";
}

function showExportOverlay(title, desc){
  document.getElementById("export-title").textContent = title;
  document.getElementById("export-desc").textContent = desc;
  document.getElementById("export-overlay").classList.add("show");
}
function hideExportOverlay(){
  document.getElementById("export-overlay").classList.remove("show");
}

/** Siapkan panggung agar bersih dari indikator UI (seleksi, caret, contenteditable) sebelum ditangkap. */
function prepareStageForCapture(stage){
  document.activeElement && document.activeElement.blur();
  const editableEls = Array.from(stage.querySelectorAll('[contenteditable="true"]'));
  editableEls.forEach((el) => el.setAttribute("contenteditable", "false"));
  stage.querySelectorAll(".cert-el.selected").forEach((el) => el.classList.remove("selected"));
  stage.classList.add("exporting");
  return () => {
    stage.classList.remove("exporting");
    editableEls.forEach((el) => el.setAttribute("contenteditable", "true"));
  };
}

async function renderStageToCanvas(){
  const stage = document.getElementById("certificate-stage");
  const restore = prepareStageForCapture(stage);
  try {
    const canvas = await html2canvas(stage, {
      scale: EXPORT_SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: stage.scrollWidth,
      windowHeight: stage.scrollHeight,
    });
    return canvas;
  } finally {
    restore();
  }
}

async function exportPNG(){
  showExportOverlay("Menyiapkan PNG...", "Merender sertifikat dalam resolusi tinggi.");
  try {
    const canvas = await renderStageToCanvas();
    const filename = `sertifikat-${sanitizeFilename(EditorState.data.content.recipientName)}.png`;
    canvas.toBlob((blob) => {
      if (!blob){ throw new Error("Gagal membuat berkas PNG."); }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      hideExportOverlay();
      showToast("PNG berhasil diunduh.", "success");
    }, "image/png", 1.0);
  } catch (err){
    console.error(err);
    hideExportOverlay();
    showToast("Gagal mengekspor PNG. Coba lagi.", "error");
  }
}

async function exportPDF(){
  showExportOverlay("Menyiapkan PDF...", "Merender sertifikat setara A4 300 DPI.");
  try {
    const canvas = await renderStageToCanvas();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.96);
    pdf.addImage(imgData, "JPEG", 0, 0, A4_LANDSCAPE_MM.width, A4_LANDSCAPE_MM.height, undefined, "FAST");
    const filename = `sertifikat-${sanitizeFilename(EditorState.data.content.recipientName)}.pdf`;
    pdf.save(filename);
    hideExportOverlay();
    showToast("PDF berhasil diunduh.", "success");
  } catch (err){
    console.error(err);
    hideExportOverlay();
    showToast("Gagal mengekspor PDF. Coba lagi.", "error");
  }
}

function initExport(){
  document.getElementById("btn-download-png").addEventListener("click", exportPNG);
  document.getElementById("btn-download-pdf").addEventListener("click", exportPDF);
}
