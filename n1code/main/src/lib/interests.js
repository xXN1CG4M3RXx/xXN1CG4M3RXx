/**
 * Pure helpers for the gaming / anime lounges.
 *
 * Everything here is side-effect free so it can be unit tested directly and
 * shared between the overview page (strips) and the dedicated pages (grids).
 */

export const ANIME_SORTS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "myRating", label: "My Rating (High to Low)" },
  { value: "overallRating", label: "Overall Rating (High to Low)" },
];

export const GAME_SORTS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "playtime", label: "Playtime (High to Low)" },
];

export const GAME_FILTERS = [
  { value: "all", label: "All Games" },
  { value: "playing", label: "Currently Playing" },
  { value: "favorites", label: "All-Time Favorites" },
];

export const ANIME_GENRE_ALL = { value: "all", label: "All Genres" };

/** Coerce the admin's free-text "250 hrs" into a number. */
export function parseHours(value) {
  const n = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function animeTitle(entry) {
  return entry?.media?.title?.english || entry?.media?.title?.romaji || "Untitled";
}

export function animeGenres(entry) {
  return entry?.media?.genres || [];
}

export function animeAverageScore(entry) {
  const score = entry?.media?.averageScore;
  return score ? Math.round(score) : null;
}

/** 0-100 watch progress, or 0 when the total is unknown. */
export function animeProgressPercent(entry) {
  const total = entry?.media?.episodes;
  const done = entry?.progress;
  if (!total || done === undefined || done === null) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export function isFavorite(entry) {
  return Boolean(entry?.isFavorite);
}

/**
 * Turn manually curated admin entries into the same shape the AniList
 * entries use, so both render through one component.
 */
export function mapManualAnime(anime = [], type, targetStatus) {
  return (Array.isArray(anime) ? anime : [])
    .filter((a) => (a.type || "Anime") === type && (a.status || "COMPLETED") === targetStatus)
    .map((a) => ({
      id: `manual-${a.id}`,
      progress: "?",
      score: a.score,
      status: a.status || "COMPLETED",
      isFavorite: Boolean(a.isFavorite),
      manualDetails: a,
      media: {
        title: { english: a.title, romaji: a.title },
        coverImage: { large: a.coverUrl || "/placeholder.png" },
        averageScore: parseFloat(a.score) * 10 || null,
        siteUrl: "#",
        genres: a.genre ? a.genre.split(",").map((s) => s.trim()).filter(Boolean) : [],
      },
    }));
}

/**
 * Sort + filter any list of anime/manga entries.
 * `favoriteIds` is an optional Set of AniList media ids the user favourited.
 */
export function sortEntries(entries = [], { sort = "name", genre = "all", favoriteIds = null } = {}) {
  const favSet = favoriteIds instanceof Set ? favoriteIds : null;
  const source = Array.isArray(entries) ? entries : [];

  const processed = source.map((entry) => ({
    ...entry,
    isFavorite: isFavorite(entry) || (favSet ? favSet.has(entry?.media?.id) : false),
  }));

  const filtered = genre && genre !== "all"
    ? processed.filter((entry) => animeGenres(entry).includes(genre))
    : processed;

  const byTitle = (a, b) => animeTitle(a).localeCompare(animeTitle(b));

  return filtered.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    if (sort === "myRating") return (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0);
    if (sort === "overallRating") return (b.media?.averageScore || 0) - (a.media?.averageScore || 0);
    return byTitle(a, b);
  });
}

/** Steam entries + manual admin games, merged, filtered and sorted. */
export function sortGames({ steamGames = [], manualGames = [], filter = "all", sort = "name" } = {}) {
  const manual = (Array.isArray(manualGames) ? manualGames : []).map((g) => ({
    appid: `manual-${g.id}`,
    name: g.title,
    playtime_forever: parseHours(g.hours) * 60,
    img_icon_url: g.bannerUrl,
    isManual: true,
    isFavorite: g.status === "Favorite",
    status: g.status,
    genres: g.genre ? g.genre.split(",").map((s) => s.trim()).filter(Boolean) : [],
  }));

  let combined = [...(Array.isArray(steamGames) ? steamGames : []), ...manual];

  if (filter === "playing") {
    combined = combined.filter(
      (g) => (g.isManual && g.status === "Currently Playing") || (!g.isManual && (g.playtime_2weeks || 0) > 0)
    );
  } else if (filter === "favorites") {
    combined = combined.filter((g) => g.isFavorite);
  }

  return combined.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return (b.playtime_forever || 0) - (a.playtime_forever || 0);
  });
}

/** Artwork URL for a Steam entry, with the icon fallback the old page used. */
export function steamImageUrl(game) {
  if (!game) return "";
  if (game.isManual) return game.img_icon_url || "";
  const base = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}`;
  return `${base}/header.jpg`;
}

export function steamImageFallback(game) {
  if (!game || game.isManual) return game?.img_icon_url || "";
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
}

export function steamHours(game) {
  const mins = game?.playtime_forever !== undefined ? game.playtime_forever : (game?.hours || 0) * 60;
  return ((Number(mins) || 0) / 60).toFixed(1);
}

/** Every genre present across the live AniList lists. */
export function collectAnimeGenres(lists = []) {
  const genres = new Set();
  (Array.isArray(lists) ? lists : []).flat().forEach((entry) => animeGenres(entry).forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
}

/** Every genre present across the manually curated games. */
export function collectGameGenres(games = []) {
  const genres = new Set();
  (Array.isArray(games) ? games : []).forEach((g) => {
    if (!g?.genre) return;
    g.genre.split(",").map((s) => s.trim()).filter(Boolean).forEach((genre) => genres.add(genre));
  });
  return Array.from(genres).sort();
}
