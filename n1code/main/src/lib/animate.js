import { useEffect, useRef, useState } from "react";

/** True when the user has asked the OS for reduced motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Observe an element and report when it enters the viewport.
 * Returns `[ref, inView]`. Animations are disabled entirely under
 * `prefers-reduced-motion` — the element is marked visible immediately.
 */
export function useInView({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  // Reduced motion and missing IntersectionObserver both mean "always visible",
  // decided up front so the effect has nothing to synchronously set.
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    if (inView) return undefined;

    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin, once]);

  return [ref, inView];
}

/** Current window scroll position in px (rAF throttled). */
export function useScrollY() {
  const [y, setY] = useState(() => (typeof window === "undefined" ? 0 : window.scrollY));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      setY(window.scrollY);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // read once after mount, then only on scroll/resize
    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}

/**
 * 0 → 1 progress of an element travelling through the viewport.
 * 0 = element's top hits the viewport bottom, 1 = element's bottom leaves the top.
 */
export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const travelled = vh - rect.top;
      const next = Math.min(1, Math.max(0, travelled / total));
      setProgress((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // measure on the next frame rather than synchronously in the effect
    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}

/** Animated integer counter that starts when `start` becomes true. */
export function useCountUp(target, { duration = 1400, start = false, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!start) return undefined;

    const from = fromRef.current;
    const to = Number(target) || 0;
    if (prefersReducedMotion() || to === from) {
      fromRef.current = to;
      setValue(to);
      return undefined;
    }

    let frame = 0;
    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = from + (to - from) * eased;
      setValue(current);
      if (t < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return Number(value.toFixed(decimals));
}

/** Typewriter effect for decorative strings. */
export function useTypewriter(text = "", { speed = 34, start = false, showCursor = true } = {}) {
  const safeText = typeof text === "string" ? text : "";
  // Under reduced motion the full string is the initial state, so the effect
  // never has to set anything synchronously.
  const [count, setCount] = useState(() => (prefersReducedMotion() ? safeText.length : 0));
  const tickRef = useRef(0);

  useEffect(() => {
    if (!start) return undefined;
    if (prefersReducedMotion()) return undefined;

    // the cursor index lives in a ref so the effect body never sets state
    tickRef.current = 0;
    const id = window.setInterval(() => {
      tickRef.current += 1;
      setCount(tickRef.current);
      if (tickRef.current >= safeText.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [safeText, speed, start]);

  const done = count >= safeText.length;
  return {
    text: safeText.slice(0, count),
    done,
    cursor: showCursor && !done ? "▍" : "",
  };
}

/** URL-safe slug for a project title. */
export function slugify(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}
