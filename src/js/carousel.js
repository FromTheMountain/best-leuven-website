// Progressive enhancement for .carousel: the track already scrolls and snaps
// without JS; this adds prev/next buttons, autoplay (paused on hover/focus) and
// endless looping. Looping works by cloning the last slide in front of the first
// and the first slide after the last: when the scroll comes to rest on a clone,
// we jump (instantly, unnoticeably) to the identical real slide.
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const count = track.children.length;
  if (count < 2) return;

  const clone = (slide) => {
    const copy = slide.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    return copy;
  };
  track.prepend(clone(track.children[count - 1]));
  track.append(clone(track.children[1]));

  // Positions 0 and count + 1 are the clones; 1..count are the real slides.
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const scrollToIndex = (i, behavior) => track.scrollTo({ left: i * track.clientWidth, behavior });
  const goTo = (i) => scrollToIndex(Math.max(0, Math.min(count + 1, i)), "smooth");

  const settle = () => {
    const i = current();
    if (i === 0) scrollToIndex(count, "instant");
    else if (i === count + 1) scrollToIndex(1, "instant");
  };
  let settleTimer;
  track.addEventListener("scroll", () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 100);
  });
  addEventListener("resize", () => scrollToIndex(Math.min(Math.max(current(), 1), count), "instant"));
  scrollToIndex(1, "instant");

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
