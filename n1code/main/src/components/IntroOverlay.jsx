import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "../lib/animate";

const BOOT_LINES = [
  "N1CODE OS v4.2.0 — boot sequence initiated",
  "mounting sectors .............. OK",
  "loading modules ............... OK",
  "establishing uplink ........... OK",
  "rendering world ............... OK",
];

// Total ~5s: the boot log has time to be read, the panels part, then the logo
// and the "scroll to begin" prompt hold before the cutscene hands over.
const BOOT_STAGGER_MS = 200;
const REVEAL_AT = 1800;
const PROMPT_AT = 3000;
const FINISH_AT = 4400;
const EXIT_MS = 600;

/**
 * One-time entry cutscene. Boot log → two panels part → logo burst → prompt.
 *
 * Skippable by click, Escape/Enter/Space or any scroll gesture. Under
 * `prefers-reduced-motion` it resolves immediately and the page is simply shown.
 */
export default function IntroOverlay({ onDone }) {
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finishedRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      setGone(true);
      onDoneRef.current?.();
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      finish();
      return undefined;
    }

    const startedAt = performance.now();
    const timers = [
      window.setTimeout(() => setStage(1), REVEAL_AT),
      window.setTimeout(() => setStage(2), PROMPT_AT),
      window.setTimeout(finish, FINISH_AT),
    ];
    const ticker = window.setInterval(() => {
      setElapsed(Math.min(FINISH_AT, performance.now() - startedAt));
    }, 100);

    const onKey = (event) => {
      if (["Escape", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        finish();
      }
    };
    const onWheel = () => finish();
    const onPointerDown = () => finish();
    const onTouchMove = () => finish();

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    // Mobile scroll: touch devices never fire `wheel`, so without a touchmove
    // listener an opaque overlay would freeze the page beneath it.
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(ticker);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [finish]);

  if (gone) return null;

  // Portalled to <body>: the route wrapper runs a `filter` while its enter
  // animation plays, and a `filter` other than `none` makes an element the
  // containing block for fixed-position descendants. Without the portal the
  // overlay's `position: fixed` resolved against the full page height, so the
  // cutscene's content rendered thousands of px below the fold and all the
  // visitor saw was a blank screen.
  return createPortal(
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#04070d] ${
        leaving ? "animate-cutscene-out" : "animate-cutscene-in"
      }`}
      role="button"
      tabIndex={-1}
      aria-label="Skip intro"
      onClick={finish}
    >
      {/* scanline texture */}
      <div className="scanlines absolute inset-0 opacity-[0.06]" />

      {/* parting panels */}
      <div className={`cutscene-panel cutscene-panel--left ${stage >= 1 ? "" : "[animation-play-state:paused]"}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-sky-aqua-500/25" />
      </div>
      <div className={`cutscene-panel cutscene-panel--right ${stage >= 1 ? "" : "[animation-play-state:paused]"}`}>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-sky-aqua-500/25" />
      </div>

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {stage === 0 ? (
          <div className="w-full max-w-md font-mono text-xs text-sky-aqua-400/80 sm:text-sm">
            {BOOT_LINES.map((line, index) => (
              <p
                key={line}
                className="animate-boot mb-2 whitespace-nowrap"
                style={{ animationDelay: `${index * BOOT_STAGGER_MS}ms`, opacity: 0 }}
              >
                <span className="mr-2 text-slate-600">{">"}</span>
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="animate-logo-burst relative">
              <h1 className="glitch font-display text-5xl font-bold tracking-[0.18em] text-slate-50 sm:text-7xl" data-text="N1CODE">
                N1CODE
              </h1>
              <span className="animate-ring-pulse absolute inset-0 -z-10 rounded-full border border-sky-aqua-500/40" />
            </div>

            <p className="kicker animate-fade-in" style={{ animationDelay: "350ms", opacity: 0 }}>
              portfolio // game edition
            </p>

            {stage >= 2 && (
              <div className="animate-fade-in flex flex-col items-center gap-3" style={{ opacity: 0 }}>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  scroll to begin
                </p>
                <div className="scroll-cue" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* HUD frame */}
      <div className="pointer-events-none absolute inset-6 hidden sm:block" aria-hidden="true">
        <span className="hud-corner hud-corner--tl" />
        <span className="hud-corner hud-corner--tr" />
        <span className="hud-corner hud-corner--bl" />
        <span className="hud-corner hud-corner--br" />
      </div>

      <div className="pointer-events-none absolute left-8 top-8 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-sky-aqua-500/70 sm:block">
        sector 01 // entry point
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:block">
        {String(Math.round((elapsed / FINISH_AT) * 100)).padStart(3, "0")}%
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
        className="hud-chip absolute bottom-8 left-1/2 -translate-x-1/2 transition-colors hover:border-sky-aqua-400/60 hover:text-sky-aqua-200"
      >
        skip intro
      </button>
    </div>,
    document.body
  );
}
