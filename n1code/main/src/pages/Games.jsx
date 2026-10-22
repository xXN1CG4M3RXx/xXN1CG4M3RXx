import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Gamepad2, Loader2 } from "lucide-react";
import { useSiteData } from "../hooks/useSiteData";
import { useInterestsLive } from "../hooks/useInterestsLive";
import {
  GAME_FILTERS,
  GAME_SORTS,
  collectGameGenres,
  sortGames,
  steamHours,
} from "../lib/interests";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import Dropdown from "../components/Dropdown";
import GameCard from "../components/GameCard";

const PAGE_SIZE = 12;

/** /games — the arcade: Steam library plus manually curated favourites. */
export default function Games() {
  const { data, loading } = useSiteData();
  const interests = data.interests || {};
  const live = useInterestsLive(interests);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [genre, setGenre] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const manualGames = useMemo(() => interests.games || [], [interests.games]);

  const games = useMemo(() => {
    const sorted = sortGames({
      steamGames: live.steam,
      manualGames,
      filter,
      sort,
    });

    if (genre === "all") return sorted;
    return sorted.filter((game) => (game.genres || []).includes(genre));
  }, [live.steam, manualGames, filter, sort, genre]);

  const genres = useMemo(() => collectGameGenres(manualGames), [manualGames]);

  const totalHours = useMemo(
    () => games.reduce((sum, game) => sum + (parseFloat(steamHours(game)) || 0), 0),
    [games]
  );

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            overview
          </Link>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <p className="kicker">
            <span className="text-sky-aqua-500/70">[</span>sector 05 — arcade
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Gaming <span className="gradient-text">Hub</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            Exploring virtual worlds and competitive queues — pulled live from Steam where sync is enabled.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap items-center gap-3">
            <HudChip>{games.length} games</HudChip>
            <HudChip tone="green">{totalHours.toFixed(0)} hrs logged</HudChip>
            {live.steamEnabled && (
              <HudChip tone="green">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
                steam sync on
              </HudChip>
            )}
            {live.steamError && (
              <HudChip tone="pink" title={String(live.steamError.message || live.steamError)}>
                steam sync failed
              </HudChip>
            )}
            {live.steamEnabled && !live.steamLoading && !live.steamError && live.steamPrivate && (
              <HudChip tone="amber">profile is private</HudChip>
            )}
            {live.steamLoading && (
              <HudChip tone="amber">
                <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin" />
                syncing
              </HudChip>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/40 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Dropdown
              label="filter"
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setVisibleCount(PAGE_SIZE);
              }}
              options={GAME_FILTERS}
            />
            {genres.length > 0 && (
              <Dropdown
                label="genre"
                value={genre}
                onChange={(value) => {
                  setGenre(value);
                  setVisibleCount(PAGE_SIZE);
                }}
                options={[{ value: "all", label: "All Genres" }, ...genres.map((g) => ({ value: g, label: g }))]}
              />
            )}
          </div>

          <Dropdown
            label="sort"
            value={sort}
            onChange={(value) => {
              setSort(value);
              setVisibleCount(PAGE_SIZE);
            }}
            options={GAME_SORTS}
          />
        </div>
      </Reveal>

      <div className="mt-12">
        {loading && games.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/40 py-16 text-center">
            <Gamepad2 className="h-8 w-8 text-slate-600" />
            <p className="max-w-md text-slate-500">
              {live.steamError
                ? `${live.steamError.message || "The Steam sync failed."} Check the Steam ID and API key, or add manual games via the admin panel.`
                : live.steamPrivate
                  ? "That Steam profile keeps its game details private, so there is nothing to show here. Manual favourites still appear."
                  : "No games added yet. Configure Steam sync or add manual games via the admin panel."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {games.slice(0, visibleCount).map((game, index) => (
                <Reveal key={game.appid} delay={(index % 4) * 60} className="h-full">
                  <GameCard game={game} index={index} />
                </Reveal>
              ))}
            </div>

            {visibleCount < games.length && (
              <Reveal className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-sky-aqua-500/40 hover:text-sky-aqua-300"
                >
                  load more games ({games.length - visibleCount} left)
                </button>
              </Reveal>
            )}
          </>
        )}
      </div>

      <div className="mt-20 border-t border-white/5 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          {"// favourites always sort first, then the selected order"}
        </p>
      </div>
    </PageShell>
  );
}
