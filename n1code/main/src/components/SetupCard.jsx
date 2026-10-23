import { ExternalLink } from "lucide-react";
import { sanitizeUrl } from "../lib/sanitize";

/** One hardware / software entry in a setup column. */
export function SetupItem({ item }) {
  const href = item.link ? sanitizeUrl(item.link) : null;
  const hasLink = href && href !== "#";

  const row = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium tracking-wide text-slate-200 transition-colors group-hover:text-sky-aqua-300">
          {item.name}
        </span>
        {item.category && (
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            {item.category}
          </span>
        )}
      </span>

      {hasLink && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-sky-aqua-400" />
      )}
    </>
  );

  return (
    <li
      className="group flex items-center gap-3 border-b border-white/[0.05] py-3 transition-colors last:border-0"
    >
      {hasLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.03]"
        >
          {row}
        </a>
      ) : (
        <div className="flex w-full items-center gap-3 px-2 py-1">{row}</div>
      )}
    </li>
  );
}

/** Setup column: title + icon + item list. */
export default function SetupCard({ title, icon, items = [] }) {
  return (
    <section
      className="relative h-full rounded-2xl border border-white/[0.07] bg-slate-950/50 p-6 backdrop-blur-md transition-colors duration-300 hover:border-sky-aqua-500/30"
    >
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--br" />

      <header className="mb-4 flex items-center gap-3 border-b border-white/[0.06] pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-aqua-500/25 bg-sky-aqua-500/10 text-sky-aqua-400">
          {icon}
        </span>
        <div>
          <h3 className="font-display text-lg font-bold tracking-wide text-slate-50">{title}</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-600">Nothing configured yet.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <SetupItem key={item.id ?? index} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}
