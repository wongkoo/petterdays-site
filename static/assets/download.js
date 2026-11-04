(() => {
  const bar = document.querySelector("[data-download-bar]");
  const start = document.querySelector("[data-download-start]");
  const end = document.querySelector("[data-download-end]");
  const header = document.querySelector(".site-header");
  if (!bar || !start || !end) return;
  const mobile = window.matchMedia("(max-width: 820px)");
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const top = header?.getBoundingClientRect().bottom || 0;
    const endRect = end.getBoundingClientRect();
    const endVisible = endRect.top < window.innerHeight && endRect.bottom > top;
    bar.hidden = !mobile.matches || start.getBoundingClientRect().bottom > top || endVisible;
  };
  const schedule = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  document.addEventListener("load", schedule, true);
  if (mobile.addEventListener) mobile.addEventListener("change", schedule);
  update();
})();
