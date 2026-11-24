/* ==========================================================================
   LANDING PAGE — interaksi ringan
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Animasi reveal saat elemen fitur/langkah masuk viewport.
  const revealTargets = document.querySelectorAll(".feature-card, .step-card, .template-teaser");
  if ("IntersectionObserver" in window && revealTargets.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          entry.target.style.animationPlayState = "running";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity 500ms ease, transform 500ms ease";
      io.observe(el);
      // Terapkan tampilan akhir setelah observer menandai (fallback aman jika IO tak trigger cepat)
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 60);
    });
  }

  // Klik template pada strip landing → langsung ke halaman template dengan filter.
  document.querySelectorAll(".template-teaser").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => { window.location.href = "templates.html"; });
  });
});
