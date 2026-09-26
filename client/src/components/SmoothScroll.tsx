import { ReactNode, useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useAnimation } from "@/contexts/AnimationContext";
import { setLenisInstance } from "@/lib/scroll";

const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  lerp: 0.1,
  autoRaf: true,
  anchors: true,
  allowNestedScroll: true,
  /* Native touch scroll on phones — Lenis breaks vertical scroll on mobile */
  syncTouch: false,
  touchMultiplier: 0,
};

function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    setLenisInstance(lenis ?? null);
    return () => setLenisInstance(null);
  }, [lenis]);

  return null;
}

/** Lenis smooth scroll for desktop pointer devices only */
function useNativeScrollPreferred() {
  const { prefersReducedMotion } = useAnimation();
  const [preferNative, setPreferNative] = useState(true);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    const touch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      coarsePointer ||
      noHover ||
      narrow;

    setPreferNative(prefersReducedMotion || touch);
  }, [prefersReducedMotion]);

  return preferNative;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const preferNativeScroll = useNativeScrollPreferred();

  if (preferNativeScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
