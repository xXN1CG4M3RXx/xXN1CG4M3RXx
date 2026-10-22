import { useEffect, useState } from "react";

/**
 * Slim scroll progress bar plus a dot navigation for the overview page.
 * Dots jump to sections with a smooth scroll; the active one is derived from
 * which section currently occupies the middle of the viewport.
 */
export default function ScrollNav({ sections = [] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      const probe = window.innerHeight * 0.42;
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = section.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/5" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-sky-aqua-500 via-blue-green-600 to-[#8b5cf6] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {sections.length > 0 && (
        <nav
          aria-label="Section navigation"
          className="fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
        >
          {sections.map((section) => {
            const isActive = section.id === active;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => goTo(section.id)}
                aria-label={section.label}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`block rounded-full border transition-all duration-300 ${
                    isActive
                      ? "h-2.5 w-2.5 border-sky-aqua-400 bg-sky-aqua-400 shadow-[0_0_10px_rgba(0,204,255,0.8)]"
                      : "h-2 w-2 border-slate-600 bg-transparent group-hover:border-sky-aqua-400"
                  }`}
                />
                <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md border border-white/10 bg-[#0b0f19]/90 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-300 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
