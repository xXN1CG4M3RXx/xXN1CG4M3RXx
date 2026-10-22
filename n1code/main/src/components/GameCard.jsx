import { Star } from "lucide-react";
import { steamImageUrl, steamImageFallback, steamHours } from "../lib/interests";

/** Steam library tile, or a manually curated game with a banner. */
export default function GameCard({ game, index = 0 }) {
  const img = steamImageUrl(game);
  const fallback = steamImageFallback(game);
  const hours = steamHours(game);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-slate-950/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-green-600/50 hover:shadow-[0_14px_40px_-18px_rgba(0,150,224,0.6)]"
      style={{ "--reveal-delay": `${(index % 8) * 40}ms` }}
    >
      <div className="relative aspect-[460/215] w-full overflow-hidden bg-slate-900">
        {img ? (
          <img
            src={img}
            alt={game.name}
            loading="lazy"
            onError={(event) => {
              if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-700">
            no artwork
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

        {game.isFavorite && (
          <span className="absolute right-1.5 top-1.5 z-10 leading-none text-amber-400 drop-shadow-md">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
          </span>
        )}
        {game.playtime_2weeks > 0 && (
          <span className="hud-chip absolute left-1.5 top-1.5">playing now</span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 p-3">
        <h3 className="truncate text-sm font-bold text-slate-200" title={game.name}>
          {game.name}
        </h3>
        <span className="shrink-0 font-mono text-[10px] text-blue-green-700">{hours} hrs</span>
      </div>
    </article>
  );
}
