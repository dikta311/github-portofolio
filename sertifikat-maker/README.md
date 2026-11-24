# Sertifikat Maker

Website pembuat sertifikat 100% berjalan di sisi client (frontend only) — tanpa PHP, database, atau backend.

## Cara Menjalankan
Cukup buka `index.html` langsung di browser (double-click), atau lakukan hosting statis apa pun (GitHub Pages, Netlify, dsb).

> Catatan: Google Fonts, serta library `html2canvas` & `jsPDF` dimuat dari CDN saat halaman pertama kali dibuka (butuh koneksi internet sekali di awal). Setelah itu, **seluruh proses edit & ekspor sertifikat berjalan sepenuhnya di browser** — tidak ada data (teks, logo, tanda tangan) yang pernah dikirim ke server mana pun.

## Struktur Folder
```
sertifikat-maker/
├── index.html          # Landing page
├── templates.html      # Galeri pilihan template
├── editor.html         # Halaman editor sertifikat
├── css/
│   ├── variables.css           # Design tokens (warna, tipografi, spacing)
│   ├── base.css                # Reset & komponen bersama (tombol, toast, dst)
│   ├── landing.css              # Gaya landing page
│   ├── templates-page.css       # Gaya galeri template
│   ├── editor.css               # Gaya halaman editor (toolbar, sidebar, panggung)
│   ├── certificate-templates.css# Desain visual 5 template sertifikat
│   ├── dark-mode.css             # Penyesuaian tambahan mode gelap
│   └── responsive.css            # Breakpoint responsif
├── js/
│   ├── utils.js              # Toast, debounce, baca gambar, dsb
│   ├── theme.js              # Toggle mode gelap/terang
│   ├── templates-data.js     # Data 5 template (posisi, warna, font default)
│   ├── main.js                # Interaksi landing page
│   ├── templates-page.js      # Render & filter galeri template
│   ├── editor-state.js        # State management + undo/redo + autosave
│   ├── editor-render.js       # Render elemen sertifikat dari state
│   ├── editor-dragdrop.js     # Geser posisi elemen (drag & drop)
│   ├── editor-controls.js     # Binding sidebar (konten, gaya, template)
│   ├── editor-upload.js       # Upload logo & tanda tangan
│   ├── export.js              # Ekspor PNG & PDF (html2canvas + jsPDF)
│   └── editor-init.js         # Titik masuk halaman editor
└── assets/              # (cadangan bila ingin menaruh aset statis sendiri)
```

## Fitur Utama
- 5 template: Modern, Elegant, Corporate, Minimalist, Academic
- Edit langsung di kanvas (klik teks → ketik) + panel sidebar
- Kustomisasi font, ukuran font per-elemen, warna teks, warna aksen/bingkai, warna latar, gaya & ketebalan bingkai
- Geser bebas (drag & drop) setiap elemen teks maupun gambar
- Upload logo & tanda tangan (PNG/JPG/SVG/WebP, maks 8MB)
- Undo/Redo (Ctrl+Z / Ctrl+Y) dan reset posisi ke bawaan template
- Autosave ke `localStorage` — aman jika tab tertutup tidak sengaja
- Mode gelap/terang
- Ekspor **PNG** resolusi tinggi & **PDF** setara A4 landscape ~300 DPI
- Responsif untuk desktop, tablet, dan mobile

## Batasan yang Perlu Diketahui
- Karena berjalan murni di browser tanpa server, penyimpanan progres memakai `localStorage` milik browser tersebut (tidak tersinkron antar perangkat/browser).
- Ekspor PDF menempatkan gambar sertifikat penuh satu halaman A4 landscape.
