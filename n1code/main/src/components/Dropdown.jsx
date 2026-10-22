import { useEffect, useRef, useState } from "react";

/**
 * Custom dropdown used by the lounge filter bars.
 * Mirrors the select it replaces: label + value, click-outside to close.
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
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
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
    <div className={`relative ${className || ""}`.trim()} ref={ref}>
      {label && (
        <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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

      {isOpen && (
        <div
          role="listbox"
          className="animate-fade-in absolute z-[100] mt-1.5 w-full min-w-[170px] origin-top overflow-hidden rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl shadow-black/50 backdrop-blur-xl"
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
        </div>
      )}
    </div>
  );
}
