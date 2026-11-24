/* ==========================================================================
   UTILITAS BERSAMA — dipakai di semua halaman
   ========================================================================== */

/** Tampilkan notifikasi toast singkat di pojok bawah layar. */
function showToast(message, type = "info", duration = 2600){
  const region = document.getElementById("toast-region");
  if (!region) return;
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " toast-error" : type === "success" ? " toast-success" : "");
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 200ms ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 220);
  }, duration);
}

/** Batasi angka ke rentang [min, max]. */
function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

/** Debounce sederhana — jalankan fn setelah tidak ada panggilan baru selama `wait` ms. */
function debounce(fn, wait = 250){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** Baca file gambar sebagai Data URL (untuk logo/tanda tangan yang diunggah). */
function readImageAsDataURL(file){
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")){
      reject(new Error("Berkas yang dipilih bukan gambar."));
      return;
    }
    const maxSizeMB = 8;
    if (file.size > maxSizeMB * 1024 * 1024){
      reject(new Error(`Ukuran gambar melebihi ${maxSizeMB}MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Gagal membaca berkas gambar."));
    reader.readAsDataURL(file);
  });
}

/** Format tanggal hari ini ke format Indonesia, mis. "03 Agustus 2026". */
function todayIndonesian(){
  const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}
