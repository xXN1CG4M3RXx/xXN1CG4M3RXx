import "@testing-library/jest-dom/vitest";

/**
 * Vitest environment shim.
 *
 * happy-dom ships a stub `IntersectionObserver` that never invokes its
 * callback, which would leave every scroll-reveal permanently hidden. This
 * shim fires immediately so the reveal hooks take their "in view" path.
 */

class ImmediateIntersectionObserver {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.targets = new Set();
  }

  observe(target) {
    this.targets.add(target);
    this.callback(
      [{ target, isIntersecting: true, intersectionRatio: 1, boundingClientRect: target.getBoundingClientRect?.() ?? {} }],
      this
    );
  }

  unobserve(target) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords() {
    return [];
  }

  get root() {
    return this.options.root ?? null;
  }

  get rootMargin() {
    return this.options.rootMargin ?? "0px";
  }

  get thresholds() {
    return Array.isArray(this.options.threshold) ? this.options.threshold : [this.options.threshold ?? 0];
  }
}

Object.defineProperty(ImmediateIntersectionObserver, "__testShim", {
  value: true,
  configurable: true,
});

// happy-dom ships a never-firing stub, so always replace it.
globalThis.IntersectionObserver = ImmediateIntersectionObserver;
