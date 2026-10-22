import { Star } from "lucide-react";
import {
  animeAverageScore,
  animeProgressPercent,
  animeTitle,
  isFavorite,
} from "../lib/interests";
import { sanitizeUrl } from "../lib/sanitize";

const RADIUS = 15.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Anime / manga poster tile with an animated watch-progress ring.
 * `animate` controls whether the ring animates (used on scroll-in).
 */
export default function AnimeCard({ entry, index = 0, animate = false }) {
  const title = animeTitle(entry);
  const media = entry?.media || {};
  const percent = animeProgressPercent(entry);
  const average = animeAverageScore(entry);
  const favorite = isFavorite(entry);
  const href = sanitizeUrl(media.siteUrl || "#");
  const external = href && href !== "#";

  const statusLabel =
    entry.status === "COMPLETED" ? "Done" : `Ep ${entry.progress ?? "?"} / ${media.episodes ?? "?"}`;

  const detail = entry.manualDetails?.quote ? (
    <p className="truncate text-[10px] italic text-slate-400">“{entry.manualDetails.quote}”</p>
  ) : entry.manualDetails?.favCharacter ? (
    <p className="truncate text-[10px] text-sky-aqua-400">Best: {entry.manualDetails.favCharacter}</p>
  ) : media.genres?.length ? (
    <p className="truncate text-[10px] text-slate-500">{media.genres.slice(0, 2).join(", ")}</p>
  ) : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-slate-950/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-aqua-500/50 hover:shadow-[0_14px_40px_-18px_rgba(0,204,255,0.6)]"
      style={{ "--reveal-delay": `${(index % 8) * 40}ms` }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        {media.coverImage?.large ? (
          <img
            src={media.coverImage.large}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-700">
            no cover
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {favorite && (
          <span className="absolute right-1.5 top-1.5 z-10 leading-none text-amber-400 drop-shadow-md">
            <Star className="h-4 w-4 fill-amber-400" />
          </span>
        )}

        {/* progress ring */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 34 34" className="-rotate-90">
            <circle className="ring-track" cx="17" cy="17" r={RADIUS} fill="none" strokeWidth="2.5" />
            <circle
              className="ring-fill"
              cx="17"
              cy="17"
              r={RADIUS}
              fill="none"
              strokeWidth="2.5"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={animate ? CIRCUMFERENCE * (1 - percent / 100) : CIRCUMFERENCE}
            />
          </svg>
          <span className="font-mono text-[10px] font-bold text-slate-300">
            {entry.status === "COMPLETED" ? "Done" : `${percent}%`}
          </span>
        </div>

        {average && (
          <span className="hud-chip absolute right-1.5 bottom-2 border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            ★ {average}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate text-xs font-bold text-slate-200" title={title}>
          {title}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{statusLabel}</p>
        {detail}
      </div>

      {external && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} on AniList`}
          className="absolute inset-0 rounded-xl ring-sky-aqua-500/0 transition-shadow focus-visible:ring-2 focus-visible:ring-sky-aqua-500"
        />
      )}
    </article>
  );
}
