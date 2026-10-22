import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, RotateCcw, Radio } from "lucide-react";
import { HudChip } from "./HUD";

const LINKS = [
  { to: "/", label: "Overview", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/anime", label: "Anime" },
  { to: "/games", label: "Games" },
  { to: "/skills", label: "Stack" },
  { to: "/setup", label: "Setup" },
  { to: "/contact", label: "Contact" },
];

function NavPills({ onNavigate }) {
  return (
    <>
      {LINKS.map((link, index) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          style={{ "--reveal-delay": `${index * 35}ms` }}
          className={({ isActive }) =>
            `group relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ${
              isActive ? "text-sky-aqua-400" : "text-slate-400 hover:text-slate-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={isActive ? "text-sky-aqua-500/70" : "text-slate-600 group-hover:text-sky-aqua-500/70"}>
                /
              </span>
              {link.label}
              <span
                className={`absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-sky-aqua-500 to-transparent transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
              />
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

/**
 * Fixed HUD top bar. Overview is the only route with the pill nav; the detail
 * routes get the same bar plus a back-to-overview shortcut, so the chrome is
 * identical everywhere.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24
  );
  const location = useLocation();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    frame = window.requestAnimationFrame(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const isOverview = location.pathname === "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
        scrolled || open ? "glassmorphism-strong" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2.5"
          aria-label="N1Code — back to overview"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-sky-aqua-500/40 bg-sky-aqua-500/10">
            <span className="font-display text-sm font-bold text-sky-aqua-400">N1</span>
            <span className="animate-ring-pulse absolute inset-0 -z-10 rounded-md border border-sky-aqua-500/30" />
          </span>
          <span className="glitch font-display text-lg font-bold tracking-[0.18em] text-slate-50" data-text="N1CODE">
            N1CODE
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <NavPills />
        </nav>

        <div className="flex items-center gap-3">
          <HudChip tone="green" className="hidden sm:inline-flex">
            <Radio className="mr-1.5 inline h-3 w-3 align-[-1px]" />
            online
          </HudChip>

          {!isOverview && (
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300 transition-colors hover:border-sky-aqua-500/40 hover:text-sky-aqua-300 sm:flex"
            >
              <RotateCcw className="h-3 w-3" />
              overview
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-sky-aqua-500/40 hover:text-sky-aqua-300 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-fade-in border-t border-white/5 px-4 pb-5 pt-3 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                style={{ "--reveal-delay": `${index * 40}ms` }}
                className={({ isActive }) =>
                  `reveal is-visible rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? "border border-sky-aqua-500/30 bg-sky-aqua-500/10 text-sky-aqua-300"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
