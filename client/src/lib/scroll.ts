import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}

const luxuryEase = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function scrollToTop(options?: { immediate?: boolean }) {
  const immediate = options?.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.scrollTo(0, {
      immediate,
      duration: immediate ? 0 : 1.6,
      easing: luxuryEase,
    });
    return;
  }

  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToElement(target: string | HTMLElement, offset = -80) {
  const element = typeof target === "string" ? document.getElementById(target) : target;
  if (!element) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, {
      offset,
      duration: 1.5,
      easing: luxuryEase,
    });
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
