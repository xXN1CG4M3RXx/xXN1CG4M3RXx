
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useInView, useCountUp, prefersReducedMotion } from "../src/lib/animate";

function Probe() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const n = useCountUp(10, { duration: 100, start: inView });
  return (
    <div ref={ref}>
      <span data-testid="inview">{String(inView)}</span>
      <span data-testid="count">{String(n)}</span>
    </div>
  );
}

describe("probe2", () => {
  it("checks useInView + useCountUp directly", () => {
    const spy = vi.spyOn(window, "matchMedia").mockImplementation((q) => ({
      matches: /prefers-reduced-motion/.test(q),
      media: q, onchange: null,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
    }));

    render(<Probe />);
    console.log("reducedMotion:", prefersReducedMotion());
    console.log("inView:", screen.getByTestId("inview").textContent);
    console.log("count:", screen.getByTestId("count").textContent);
    spy.mockRestore();
    expect(true).toBe(true);
  });
});
