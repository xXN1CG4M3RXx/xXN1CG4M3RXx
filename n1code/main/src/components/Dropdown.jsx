import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_OFFSET = 6;
const MENU_MARGIN = 8;
const MENU_MIN_WIDTH = 170;

/**
 * Custom dropdown used by the lounge filter bars.
 *
 * The menu is portalled to <body> and positioned with `position: fixed`.
 * Rendering it inline did not work: the filter bar has `backdrop-blur-sm`, and
 * a `backdrop-filter` creates a stacking context, so the menu's z-index was
 * confined to that bar and later siblings (the cards) painted straight over
 * it. A portal escapes every ancestor stacking context.
 */
export default function Dropdown({
  options = [],
  value,
  onChange,
  label,
  className = "",
  "aria-label": ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [menuWidth, setMenuWidth] = useState(MENU_MIN_WIDTH);

  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const reposition = useCallback(() => {
    const trigger = rootRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.max(MENU_MIN_WIDTH, rect.width);
    const maxLeft = Math.max(MENU_MARGIN, window.innerWidth - width - MENU_MARGIN);

    setMenuWidth(width);
    setPosition({
      top: rect.bottom + MENU_OFFSET,
      left: Math.min(Math.max(rect.left, MENU_MARGIN), maxLeft),
    });
  }, []);

  // Place the menu on open, then keep it anchored while the page moves.
  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    reposition();
    window.addEventListener("resize", reposition);
    // capture: also track scrolling inside any inner container
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [isOpen, reposition]);

  // Close on outside interaction. The menu lives in a portal, so it must be
  // checked explicitly — otherwise this handler fires on mousedown, before an
  // option's own click.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event) => {
      const insideTrigger = rootRef.current?.contains(event.target);
      const insideMenu = menuRef.current?.contains(event.target);
      if (!insideTrigger && !insideMenu) setIsOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const selected = options.find((opt) => opt.value === value) || options[0];

  return (
    <>
      <div className={`relative inline-block ${className || ""}`.trim()} ref={rootRef}>
        {label && (
          <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        )}

        <button
          type="button"
          id={`${menuId}-trigger`}
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          aria-label={ariaLabel || selected?.label}
          className="flex min-w-[140px] items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800 focus:border-sky-aqua-500 focus:outline-none"
        >
          <span className="truncate">{selected?.label}</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180 text-sky-aqua-400" : "text-slate-500"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            id={menuId}
            aria-labelledby={`${menuId}-trigger`}
            className="animate-fade-in fixed z-[9999] origin-top overflow-hidden rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl shadow-black/50 backdrop-blur-xl"
            style={{ top: position?.top ?? -9999, left: position?.left ?? -9999, width: menuWidth }}
          >
            <div className="custom-scrollbar max-h-60 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={value === opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                    value === opt.value
                      ? "bg-sky-aqua-500/20 text-sky-aqua-300"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
