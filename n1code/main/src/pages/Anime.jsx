import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Film, Loader2 } from "lucide-react";
import { useSiteData } from "../hooks/useSiteData";
import { useInterestsLive } from "../hooks/useInterestsLive";
import {
  ANIME_SORTS,
  collectAnimeGenres,
  mapManualAnime,
  sortEntries,
} from "../lib/interests";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import Dropdown from "../components/Dropdown";
import AnimeCard from "../components/AnimeCard";

const PAGE_SIZE = 20;

/** /anime — the anime & manga archive, live-synced from AniList. */
export default function Anime() {
  const { data, loading } = useSiteData();
  const interests = data.interests || {};
  const live = useInterestsLive(interests);

  const [sort, setSort] = useState("name");
  const [genre, setGenre] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // all | anime | manga
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const manual = useMemo(() => interests.anime || [], [interests.anime]);

  const lists = useMemo(() => {
    const animeFavs = live.anilist.favoriteAnimeIds;
    const mangaFavs = live.anilist.favoriteMangaIds;

    // Live AniList entries come pre-bucketed by status; manual entries are
    // mapped onto the same buckets so both render through one component.
    const groups = {
      watching: sortEntries(
        [...live.anilist.watchingAnime, ...mapManualAnime(manual, "Anime", "CURRENT")],
        { sort, genre, favoriteIds: animeFavs }
      ),
      planning: sortEntries(
        [...live.anilist.planningAnime, ...mapManualAnime(manual, "Anime", "PLANNING")],
        { sort, genre, favoriteIds: animeFavs }
      ),
      completed: sortEntries(
        [...live.anilist.completedAnime, ...mapManualAnime(manual, "Anime", "COMPLETED")],
        { sort, genre, favoriteIds: animeFavs }
      ),
      onHold: sortEntries([...live.anilist.onHoldAnime], { sort, genre, favoriteIds: animeFavs }),
      dropped: sortEntries(
        [...live.anilist.droppedAnime, ...mapManualAnime(manual, "Anime", "DROPPED")],
        { sort, genre, favoriteIds: animeFavs }
      ),
      reading: sortEntries(
        [...live.anilist.readingManga, ...mapManualAnime(manual, "Manga", "CURRENT")],
        { sort, genre, favoriteIds: mangaFavs }
      ),
      mangaPlanning: sortEntries(
        [...live.anilist.planningManga, ...mapManualAnime(manual, "Manga", "PLANNING")],
        { sort, genre, favoriteIds: mangaFavs }
      ),
      mangaCompleted: sortEntries(
        [...live.anilist.completedManga, ...mapManualAnime(manual, "Manga", "COMPLETED")],
        { sort, genre, favoriteIds: mangaFavs }
      ),
      mangaOnHold: sortEntries([...live.anilist.onHoldManga], { sort, genre, favoriteIds: mangaFavs }),
      mangaDropped: sortEntries(
        [...live.anilist.droppedManga, ...mapManualAnime(manual, "Manga", "DROPPED")],
        { sort, genre, favoriteIds: mangaFavs }
      ),
    };

    const byType = (list, wanted) => (typeFilter === "all" || typeFilter === wanted ? list : []);

    return { ...groups, byType };
  }, [live.anilist, manual, sort, genre, typeFilter]);

  const allGenres = useMemo(
    () =>
      collectAnimeGenres([
        ...live.anilist.watchingAnime,
        ...live.anilist.planningAnime,
        ...live.anilist.completedAnime,
        ...live.anilist.onHoldAnime,
        ...live.anilist.droppedAnime,
        ...live.anilist.readingManga,
        ...live.anilist.planningManga,
        ...live.anilist.completedManga,
        ...live.anilist.onHoldManga,
        ...live.anilist.droppedManga,
      ]),
    [live.anilist]
  );

  const totalCount =
    lists.byType(lists.watching, "anime").length +
    lists.byType(lists.planning, "anime").length +
    lists.byType(lists.completed, "anime").length +
    lists.byType(lists.onHold, "anime").length +
    lists.byType(lists.dropped, "anime").length +
    lists.byType(lists.reading, "manga").length +
    lists.byType(lists.mangaPlanning, "manga").length +
    lists.byType(lists.mangaCompleted, "manga").length +
    lists.byType(lists.mangaOnHold, "manga").length +
    lists.byType(lists.mangaDropped, "manga").length;

  const renderGroup = (title, entries, { animate = true } = {}) => {
    if (entries.length === 0) return null;

    const shown = entries.slice(0, visibleCount);
    const hasMore = entries.length > shown.length;

    return (
      <section className="scroll-mt-24">
        <Reveal>
          <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <h2 className="font-display text-2xl font-bold tracking-wide text-slate-50">{title}</h2>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {shown.map((entry, index) => (
            <Reveal key={entry.id} delay={(index % 5) * 60} className="h-full">
              <AnimeCard entry={entry} index={index} animate={animate} />
            </Reveal>
          ))}
        </div>

        {hasMore && (
          <Reveal className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-sky-aqua-500/40 hover:text-sky-aqua-300"
            >
              load more ({entries.length - shown.length} left)
            </button>
          </Reveal>
        )}
      </section>
    );
  };

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
            <span className="text-sky-aqua-500/70">[</span>sector 06 — archive
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Anime &amp; <span className="gradient-text">Manga</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            What I am watching, reading and re-watching — synced live from AniList.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap items-center gap-3">
            <HudChip>{totalCount} entries</HudChip>
            {live.anilistEnabled && (
              <HudChip tone="green">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
                anilist sync on
              </HudChip>
            )}
            {live.anilistLoading && (
              <HudChip tone="amber">
                <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin" />
                syncing
              </HudChip>
            )}
            {live.anilistError && (
              <HudChip tone="pink" title={String(live.anilistError.message || live.anilistError)}>
                anilist sync failed
              </HudChip>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/40 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Dropdown
              label="type"
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value);
                setVisibleCount(PAGE_SIZE);
              }}
              options={[
                { value: "all", label: "All Types" },
                { value: "anime", label: "Anime only" },
                { value: "manga", label: "Manga only" },
              ]}
            />
            <Dropdown
              label="genre"
              value={genre}
              onChange={(value) => {
                setGenre(value);
                setVisibleCount(PAGE_SIZE);
              }}
              options={[{ value: "all", label: "All Genres" }, ...allGenres.map((g) => ({ value: g, label: g }))]}
            />
          </div>

          <Dropdown
            label="sort"
            value={sort}
            onChange={(value) => {
              setSort(value);
              setVisibleCount(PAGE_SIZE);
            }}
            options={ANIME_SORTS}
          />
        </div>
      </Reveal>

      <div className="mt-12 space-y-16">
        {loading && totalCount === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          </div>
        ) : totalCount === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/40 py-16 text-center">
            <Film className="h-8 w-8 text-slate-600" />
            <p className="max-w-md text-slate-500">
              {live.anilistError
                ? "The AniList sync failed — check the username, or add items via the admin panel."
                : "No anime or manga found. Configure AniList sync or add items via the admin panel."}
            </p>
          </div>
        ) : (
          <>
            {renderGroup("Currently Watching", lists.byType(lists.watching, "anime"))}
            {renderGroup("Planning to Watch", lists.byType(lists.planning, "anime"))}
            {renderGroup("Completed Anime", lists.byType(lists.completed, "anime"))}
            {renderGroup("On Hold", lists.byType(lists.onHold, "anime"))}
            {renderGroup("Dropped", lists.byType(lists.dropped, "anime"))}
            {renderGroup("Currently Reading", lists.byType(lists.reading, "manga"))}
            {renderGroup("Planning to Read", lists.byType(lists.mangaPlanning, "manga"))}
            {renderGroup("Completed Manga", lists.byType(lists.mangaCompleted, "manga"))}
            {renderGroup("On Hold", lists.byType(lists.mangaOnHold, "manga"))}
            {renderGroup("Dropped", lists.byType(lists.mangaDropped, "manga"))}
          </>
        )}
      </div>

      <div className="mt-20 border-t border-white/5 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          {"// groups follow the AniList status; favourites sort first within each"}
        </p>
      </div>
    </PageShell>
  );
}
