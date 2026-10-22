import { useEffect, useState } from "react";

const ANILIST_QUERY = `
  query ($userName: String) {
    anime: MediaListCollection(userName: $userName, type: ANIME) {
      lists {
        entries {
          id progress score status updatedAt
          media {
            id title { romaji english }
            coverImage { large }
            episodes genres averageScore siteUrl
          }
        }
      }
    }
    manga: MediaListCollection(userName: $userName, type: MANGA) {
      lists {
        entries {
          id progress score status updatedAt
          media {
            id title { romaji english }
            coverImage { large }
            episodes: chapters genres averageScore siteUrl
          }
        }
      }
    }
    User(name: $userName) {
      favourites {
        anime(page: 1, perPage: 50) { nodes { id } }
        manga(page: 1, perPage: 50) { nodes { id } }
      }
    }
  }
`;

// Module-level constants: a fresh Set per render would make the memoised
// selectors below re-run (and would be a new identity every time).
const EMPTY_ANILIST = {
  watchingAnime: [],
  watchedAnime: [],
  readingManga: [],
  readManga: [],
  favoriteAnimeIds: new Set(),
  favoriteMangaIds: new Set(),
};

const EMPTY_STEAM = [];

/**
 * Live AniList + Steam data for the lounges.
 *
 * Returns `null` for `steam` / `anilist` while sync is disabled so callers can
 * render an empty state instead of an error.
 */
export function useInterestsLive(interests = {}) {
  const { anilistUsername = "", anilistSyncEnabled = true, steamId = "", steamSyncEnabled = true } = interests || {};

  const [animeLists, setAnimeLists] = useState(EMPTY_ANILIST);
  const [animeLoading, setAnimeLoading] = useState(
    () => anilistSyncEnabled && Boolean(String(anilistUsername || "").trim())
  );
  const [animeError, setAnimeError] = useState(null);

  const [steamGames, setSteamGames] = useState([]);
  const [steamPrivate, setSteamPrivate] = useState(false);
  const [steamLoading, setSteamLoading] = useState(
    () => steamSyncEnabled && Boolean(String(steamId || "").trim())
  );
  const [steamError, setSteamError] = useState(null);

  // ---- AniList ------------------------------------------------------
  useEffect(() => {
    const username = String(anilistUsername || "").trim();
    // When sync is off the derived empty state below is used, so there is
    // nothing to reset here.
    if (!username || !anilistSyncEnabled) return undefined;

    let alive = true;

    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: ANILIST_QUERY, variables: { userName: username } }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!alive) return;
        const lists = resData?.data;

        const flatAnime = (lists?.anime?.lists || []).flatMap((list) => list.entries || []);
        const flatManga = (lists?.manga?.lists || []).flatMap((list) => list.entries || []);

        setAnimeLists({
          watchingAnime: flatAnime.filter((e) => e.status === "CURRENT"),
          watchedAnime: flatAnime.filter((e) => e.status !== "CURRENT"),
          readingManga: flatManga.filter((e) => e.status === "CURRENT"),
          readManga: flatManga.filter((e) => e.status !== "CURRENT"),
          favoriteAnimeIds: new Set(lists?.User?.favourites?.anime?.nodes?.map((n) => n.id) || []),
          favoriteMangaIds: new Set(lists?.User?.favourites?.manga?.nodes?.map((n) => n.id) || []),
        });
      })
      .catch((err) => {
        if (alive) setAnimeError(err);
      })
      .finally(() => {
        if (alive) setAnimeLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [anilistUsername, anilistSyncEnabled]);

  // ---- Steam --------------------------------------------------------
  useEffect(() => {
    const id = String(steamId || "").trim();
    if (!id || !steamSyncEnabled) return undefined;

    let alive = true;

    fetch(`/api/steam?steamId=${encodeURIComponent(id)}`)
      .then(async (res) => {
        // A missing function (or an SPA fallback) can answer 200 with HTML,
        // so never assume the payload is the shape we asked for.
        const raw = await res.text().catch(() => null);
        let body = null;
        try {
          body = raw ? JSON.parse(raw) : null;
        } catch {
          // not JSON — `body` stays null and is handled below
        }
        if (!res.ok) {
          throw new Error(body?.error || body?.detail || `Steam API returned ${res.status}`);
        }
        if (!body || !Array.isArray(body.games)) throw new Error("The Steam sync returned an unexpected response.");
        if (!alive) return;
        setSteamGames(body.games);
        setSteamPrivate(Boolean(body.privateProfile));
      })
      .catch((err) => {
        if (alive) setSteamError(err);
      })
      .finally(() => {
        if (alive) setSteamLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [steamId, steamSyncEnabled]);

  const anilistEnabled = Boolean(String(anilistUsername || "").trim()) && anilistSyncEnabled;
  const steamEnabled = Boolean(String(steamId || "").trim()) && steamSyncEnabled;

  return {
    anilist: anilistEnabled ? animeLists : EMPTY_ANILIST,
    anilistLoading: anilistEnabled && animeLoading,
    anilistError: anilistEnabled ? animeError : null,
    anilistEnabled,
    steam: steamEnabled ? steamGames : EMPTY_STEAM,
    steamLoading: steamEnabled && steamLoading,
    steamError: steamEnabled ? steamError : null,
    steamEnabled,
    steamPrivate: steamEnabled && steamPrivate,
  };
}
