// Progressive enhancement for .carousel: the track already scrolls and snaps
// without JS; this adds prev/next buttons and autoplay (paused on hover/focus).
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...track.children];
  if (slides.length < 2) return;

  const goTo = (i) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: "smooth" });
  };
  const current = () => Math.round(track.scrollLeft / track.clientWidth);

  for (const [dir, label, symbol] of [[-1, "Previous photo", "‹"], [1, "Next photo", "›"]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `carousel-button ${dir < 0 ? "carousel-prev" : "carousel-next"}`;
    button.setAttribute("aria-label", label);
    button.textContent = symbol;
    button.addEventListener("click", () => goTo(current() + dir));
    carousel.append(button);
  }

  let timer;
  const start = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    timer = setInterval(() => goTo(current() + 1), 5000);
  };
  const stop = () => clearInterval(timer);
  for (const [on, off] of [["mouseenter", "mouseleave"], ["focusin", "focusout"]]) {
    carousel.addEventListener(on, stop);
    carousel.addEventListener(off, start);
  }
  start();
});
