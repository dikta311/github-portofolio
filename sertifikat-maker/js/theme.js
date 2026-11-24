/* ==========================================================================
   THEME — mode gelap/terang, tersimpan di localStorage
   ========================================================================== */
(function initTheme(){
  const STORAGE_KEY = "sertifikat-maker:theme";

  function applyTheme(theme){
    if (theme === "dark"){
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) toggleBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function getPreferredTheme(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Terapkan sedini mungkin agar tidak ada "kedipan" tema.
  const current = getPreferredTheme();
  applyTheme(current);

  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    applyTheme(getPreferredTheme());
    if (!toggleBtn) return;
    toggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
})();
