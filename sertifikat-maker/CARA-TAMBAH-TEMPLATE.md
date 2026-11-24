# Cara Menambahkan Template Sertifikat Baru

Panduan ini menjelaskan **persis di file mana** dan **baris seperti apa** yang perlu ditambahkan
untuk membuat template sertifikat baru — tanpa perlu mengubah HTML atau logika aplikasi sama sekali.

Sebagai contoh nyata, di dalam project ini sudah ditambahkan 1 template baru bernama
**"Vintage"** (cokelat tua & krem). Buka 3 file di bawah untuk melihat langsung
implementasinya sebagai referensi sambil membaca panduan ini.

Total ada **3 tempat** yang perlu disentuh:

```
1. js/templates-data.js         → daftarkan data template (WAJIB)
2. css/certificate-templates.css → gaya visual panggung sertifikat (WAJIB)
3. css/templates-page.css        → gaya thumbnail di halaman galeri (WAJIB)
```

Tidak perlu edit `editor.html`, `templates.html`, atau `templates-page.js` —
semuanya sudah otomatis membaca dari array `TEMPLATES`.

---

## Langkah 1 — Daftarkan data template

Buka **`js/templates-data.js`**, cari array `const TEMPLATES = [ ... ]`,
lalu tambahkan objek baru **sebelum tanda `];` penutup array**:

```js
{
  id: "vintage",                 // ID unik, huruf kecil, tanpa spasi
  name: "Vintage",               // Nama yang tampil ke pengguna
  category: "kreatif",           // Pilih salah satu: "formal" | "kreatif" | "akademik"
  thumbClass: "thumb-vintage",   // Nama class untuk thumbnail galeri (bebas, asal unik)
  stageClass: "stage-vintage",   // Nama class untuk panggung editor (bebas, asal unik)
  tagline: "Cokelat tua & krem, nuansa dokumen tempo dulu.", // Deskripsi singkat di kartu galeri
  defaultStyle: {
    fontFamily: "'Playfair Display', serif", // Font judul & nama penerima
    bodyFontFamily: "'Inter', sans-serif",   // (cadangan, saat ini tidak dipakai terpisah)
    textColor: "#4a2f1c",       // Warna teks default
    accentColor: "#8a5a2b",     // Warna aksen/garis dekorasi
    backgroundColor: "#f2e6cf", // Warna latar sertifikat
    backgroundColor2: "#f2e6cf",
    borderStyle: "solid",       // "none" | "thin" | "solid" | "double"
    borderColor: "#8a5a2b",
    borderWidth: 6,             // dalam pixel
    sizes: SIZES_LARGE_TITLE,   // atau SIZES_DEFAULT — ukuran font bawaan tiap elemen
    align: "center",            // "left" | "center" | "right"
  },
  positions: LAYOUT_CENTERED,   // atau LAYOUT_ASYMMETRIC — tata letak posisi elemen
},
```

**Penjelasan pilihan cepat:**
- Pakai `LAYOUT_CENTERED` kalau ingin tata letak simetris/klasik (judul & nama di tengah).
- Pakai `LAYOUT_ASYMMETRIC` kalau ingin tata letak modern (judul rata kiri/geser, logo di pojok).
- Pakai `SIZES_DEFAULT` untuk ukuran font standar, atau `SIZES_LARGE_TITLE` untuk judul lebih besar.
- Kalau ingin tata letak posisi elemen yang benar-benar unik (bukan dua pola di atas), boleh
  tulis objek posisi sendiri dengan format yang sama (lihat contoh `LAYOUT_CENTERED` di bagian
  atas file `templates-data.js`).

---

## Langkah 2 — Gaya visual panggung sertifikat

Buka **`css/certificate-templates.css`**, tambahkan blok CSS baru menggunakan
`stageClass` yang sama persis dengan yang ditulis di Langkah 1
(cari komentar `/* ---------- Border kustom generik ---------- */` lalu tambahkan tepat sebelumnya):

```css
/* ---------- VINTAGE ---------- */
.stage-vintage{ background:#f2e6cf; }
.stage-vintage .cert-decor::before{
  content:''; position:absolute; inset:14px; border:1px solid #8a5a2b; pointer-events:none;
}
.stage-vintage .cert-decor .vintage-stamp{
  position:absolute; right:9%; bottom:9%; width:80px; height:80px; border-radius:50%;
  border:3px double #8a5a2b; opacity:.7;
}
```

`.stage-<id>` mengatur background panggung. Elemen dekorasi tambahan (garis, sudut, stempel,
dsb.) ditaruh di dalam `.stage-<id> .cert-decor ...` — bebas berkreasi dengan CSS
(border, gradient, ::before/::after, dsb).

Kalau dekorasi kamu butuh elemen HTML nyata (bukan cuma CSS ::before), tambahkan juga
di **`js/editor-render.js`**, cari fungsi `decorHTMLFor(templateId)`, lalu tambahkan satu
`case` baru sebelum `default:`:

```js
case "vintage":
  return `<div class="vintage-stamp"></div>`;
```

*(Kalau template kamu tidak butuh dekorasi tambahan sama sekali, langkah ini boleh dilewati —
cukup biarkan `default: return "";` yang menangani.)*

---

## Langkah 3 — Gaya thumbnail di halaman galeri

Buka **`css/templates-page.css`**, tambahkan blok berikut menggunakan `thumbClass`
yang sama dari Langkah 1 (taruh di bagian bawah, dekat kumpulan `.thumb-*` lainnya):

```css
.thumb-vintage{ background:#f2e6cf; }
.thumb-vintage .tpl-thumb-inner{ color:#4a2f1c; border:2px solid #8a5a2b; height:88%; width:88%; }
.thumb-vintage .tt-eyebrow{ color:#8a5a2b; }
.thumb-vintage .tt-line{ background:#8a5a2b; }
```

Ini yang membuat kartu template di halaman `templates.html` (dan mini-grid di sidebar editor)
punya warna/gaya yang sesuai — bukan kotak kosong.

---

## Selesai — Cara mengecek hasilnya

1. Simpan ketiga file di atas.
2. Buka (atau refresh, tombol **F5**) halaman `templates.html` di browser.
3. Template baru akan otomatis muncul di galeri, lengkap dengan filter kategori.
4. Klik template itu → masuk ke editor → semua fitur (edit teks, drag & drop, ganti warna,
   upload logo, ekspor PNG/PDF) otomatis berfungsi tanpa perlu kode tambahan apa pun,
   karena seluruhnya sudah generik berdasarkan data di `templates-data.js`.

## Tips
- **Nama `id`, `thumbClass`, `stageClass` harus unik** — jangan sama dengan template yang sudah ada.
- Kalau lupa menambahkan CSS di Langkah 2/3, template tetap akan muncul dan tetap bisa dipakai,
  hanya saja tampilannya jadi polos/kosong (tanpa warna & dekorasi).
- Untuk mengubah tata letak posisi elemen dengan sangat presisi, gunakan drag & drop langsung
  di editor setelah template dibuat — nilai `positions` di Langkah 1 hanya posisi **awal/bawaan**.
