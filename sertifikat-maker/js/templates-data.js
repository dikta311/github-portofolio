/* ==========================================================================
   TEMPLATES DATA
   Sumber tunggal kebenaran untuk seluruh template sertifikat.
   Dipakai oleh: templates-page.js (galeri) & editor-render.js (kanvas editor).
   ========================================================================== */

/** Pola posisi elemen yang dipakai ulang oleh beberapa template (persentase dari panggung). */
const LAYOUT_CENTERED = {
  logo:          { x: 50, y: 13, w: 12 },
  title:         { x: 50, y: 27, w: 78 },
  recipientName: { x: 50, y: 43, w: 80 },
  description:   { x: 50, y: 55, w: 62 },
  signature:     { x: 76, y: 71, w: 16 },
  signerName:    { x: 76, y: 80, w: 30 },
  signerTitle:   { x: 76, y: 85, w: 30 },
  organizer:     { x: 24, y: 81, w: 34 },
  date:          { x: 24, y: 87, w: 30 },
  certNumber:    { x: 50, y: 94, w: 60 },
};

const LAYOUT_ASYMMETRIC = {
  logo:          { x: 16, y: 15, w: 11 },
  title:         { x: 54, y: 30, w: 66 },
  recipientName: { x: 54, y: 46, w: 66 },
  description:   { x: 54, y: 58, w: 56 },
  signature:     { x: 85, y: 66, w: 15 },
  signerName:    { x: 85, y: 76, w: 26 },
  signerTitle:   { x: 85, y: 81, w: 26 },
  organizer:     { x: 16, y: 83, w: 30 },
  date:          { x: 16, y: 89, w: 26 },
  certNumber:    { x: 54, y: 92, w: 56 },
};

/** Ukuran huruf dasar (px, pada panggung 1123x794) per elemen. */
const SIZES_DEFAULT = {
  title: 40, recipientName: 30, description: 14.5,
  certNumber: 11.5, organizer: 13, date: 13,
  signerName: 14, signerTitle: 11.5,
};
const SIZES_LARGE_TITLE = { ...SIZES_DEFAULT, title: 46, recipientName: 33 };

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    category: "kreatif",
    thumbClass: "thumb-modern",
    stageClass: "stage-modern",
    tagline: "Navy tegas dengan aksen emas geometris.",
    defaultStyle: {
      fontFamily: "'Playfair Display', serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#fdfbf5",
      accentColor: "#d9b74a",
      backgroundColor: "#101a2e",
      backgroundColor2: "#1b2a4a",
      borderStyle: "none",
      borderColor: "#d9b74a",
      borderWidth: 0,
      sizes: SIZES_DEFAULT,
      align: "left",
    },
    positions: LAYOUT_ASYMMETRIC,
  },
  {
    id: "elegant",
    name: "Elegant",
    category: "formal",
    thumbClass: "thumb-elegant",
    stageClass: "stage-elegant",
    tagline: "Parchment krem, garis emas ganda, sentuhan klasik.",
    defaultStyle: {
      fontFamily: "'Playfair Display', serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#3d2c1e",
      accentColor: "#a9822a",
      backgroundColor: "#fffaf0",
      backgroundColor2: "#fffaf0",
      borderStyle: "double",
      borderColor: "#c9a227",
      borderWidth: 10,
      sizes: SIZES_LARGE_TITLE,
      align: "center",
    },
    positions: LAYOUT_CENTERED,
  },
  {
    id: "corporate",
    name: "Corporate",
    category: "formal",
    thumbClass: "thumb-corporate",
    stageClass: "stage-corporate",
    tagline: "Bilah biru tegas di sisi kiri, tata letak profesional.",
    defaultStyle: {
      fontFamily: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#1b2a4a",
      accentColor: "#2c5f8a",
      backgroundColor: "#ffffff",
      backgroundColor2: "#f3f5f9",
      borderStyle: "solid",
      borderColor: "#2c5f8a",
      borderWidth: 3,
      sizes: SIZES_DEFAULT,
      align: "left",
    },
    positions: LAYOUT_ASYMMETRIC,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: "kreatif",
    thumbClass: "thumb-minimalist",
    stageClass: "stage-minimalist",
    tagline: "Putih bersih, tipografi tipis, garis tunggal.",
    defaultStyle: {
      fontFamily: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#201f1d",
      accentColor: "#201f1d",
      backgroundColor: "#ffffff",
      backgroundColor2: "#ffffff",
      borderStyle: "thin",
      borderColor: "#201f1d",
      borderWidth: 1,
      sizes: { ...SIZES_DEFAULT, title: 34 },
      align: "center",
    },
    positions: LAYOUT_CENTERED,
  },
  {
    id: "academic",
    name: "Academic",
    category: "akademik",
    thumbClass: "thumb-academic",
    stageClass: "stage-academic",
    tagline: "Hijau sage, bingkai ganda, gaya ijazah klasik.",
    defaultStyle: {
      fontFamily: "'Playfair Display', serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#26331f",
      accentColor: "#4c6444",
      backgroundColor: "#faf6ec",
      backgroundColor2: "#faf6ec",
      borderStyle: "double",
      borderColor: "#4c6444",
      borderWidth: 12,
      sizes: SIZES_LARGE_TITLE,
      align: "center",
    },
    positions: LAYOUT_CENTERED,
  },
  // ===== CONTOH TEMPLATE BARU (lihat panduan CARA-TAMBAH-TEMPLATE.md) =====
  {
    id: "vintage",
    name: "Vintage",
    category: "kreatif",
    thumbClass: "thumb-vintage",
    stageClass: "stage-vintage",
    tagline: "Cokelat tua & krem, nuansa dokumen tempo dulu.",
    defaultStyle: {
      fontFamily: "'Playfair Display', serif",
      bodyFontFamily: "'Inter', sans-serif",
      textColor: "#4a2f1c",
      accentColor: "#8a5a2b",
      backgroundColor: "#f2e6cf",
      backgroundColor2: "#f2e6cf",
      borderStyle: "solid",
      borderColor: "#8a5a2b",
      borderWidth: 6,
      sizes: SIZES_LARGE_TITLE,
      align: "center",
    },
    positions: LAYOUT_CENTERED,
  },
];

/** Ambil definisi template berdasarkan id, fallback ke 'modern'. */
function getTemplateById(id){
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}
