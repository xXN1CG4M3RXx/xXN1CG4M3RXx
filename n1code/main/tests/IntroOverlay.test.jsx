import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import IntroOverlay from "../src/components/IntroOverlay";

describe("IntroOverlay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("portals to <body> so no ancestor containing block can trap it", () => {
    // Regression: while the route wrapper runs its enter animation it has a
    // `filter`, and a filter other than `none` makes an element the containing
    // block for fixed-position descendants. Rendered inline, the overlay's
    // `position: fixed` resolved against the full page height, so the cutscene
    // content was centred thousands of px below the fold and invisible.
    render(<IntroOverlay onDone={() => {}} />);

    const overlay = screen.getByLabelText("Skip intro");
    expect(overlay).toHaveClass("fixed", "inset-0");
    expect(overlay.parentElement).toBe(document.body);
  });

  it("renders the boot log during the opening stage", () => {
    render(<IntroOverlay onDone={() => {}} />);

    expect(screen.getByText(/N1CODE OS v4\.2\.0/)).toBeInTheDocument();
    expect(screen.getByText(/mounting sectors/)).toBeInTheDocument();
    expect(screen.getByText(/rendering world/)).toBeInTheDocument();
  });

  it("reaches the logo stage after the boot log", () => {
    vi.useFakeTimers();
    render(<IntroOverlay onDone={() => {}} />);

    expect(screen.queryByText("N1CODE")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("N1CODE")).toBeInTheDocument();
  });

  it("calls onDone once the cutscene finishes", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<IntroOverlay onDone={onDone} />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("finishes early on Escape", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<IntroOverlay onDone={onDone} />);

    fireEvent.keyDown(window, { key: "Escape" });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("finishes early on click", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<IntroOverlay onDone={onDone} />);

    fireEvent.click(screen.getByLabelText("Skip intro"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
