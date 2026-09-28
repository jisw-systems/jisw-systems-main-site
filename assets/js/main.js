document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

// Keep the compact navigation usable with touch, keyboard, and section links.
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let previousScrollY = window.scrollY;

// Remember travel direction so sections can re-enter naturally on reverse scroll.
if (!prefersReducedMotion) {
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - previousScrollY;

    if (Math.abs(scrollDelta) > 2) {
      document.documentElement.dataset.scrollDirection = scrollDelta > 0 ? "down" : "up";
      previousScrollY = currentScrollY;
    }
  }, { passive: true });
}

// Keep watching each section so it can animate again when the visitor scrolls back.
const revealTargets = document.querySelectorAll(".content-section, .philosophy-section__inner");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "-7% 0px -7% 0px" });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("reveal", "is-visible"));
}
