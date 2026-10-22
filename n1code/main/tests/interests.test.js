import { describe, it, expect } from "vitest";
import {
  animeProgressPercent,
  animeTitle,
  collectAnimeGenres,
  collectGameGenres,
  mapManualAnime,
  parseHours,
  sortEntries,
  sortGames,
  steamHours,
  steamImageUrl,
} from "../src/lib/interests";
import { slugify } from "../src/lib/animate";

describe("parseHours", () => {
  it("coerces free-text playtime into a number", () => {
    expect(parseHours("250 hrs")).toBe(250);
    expect(parseHours("2.5")).toBe(2.5);
    expect(parseHours("")).toBe(0);
    expect(parseHours(undefined)).toBe(0);
    expect(parseHours("not a number")).toBe(0);
  });
});

describe("anime helpers", () => {
  it("prefers the english title and falls back to romaji", () => {
    expect(animeTitle({ media: { title: { english: "English", romaji: "Romaji" } } })).toBe("English");
    expect(animeTitle({ media: { title: { romaji: "Romaji" } } })).toBe("Romaji");
    expect(animeTitle({})).toBe("Untitled");
  });

  it("computes watch progress as a percentage", () => {
    expect(animeProgressPercent({ progress: 6, media: { episodes: 12 } })).toBe(50);
    expect(animeProgressPercent({ progress: 12, media: { episodes: 12 } })).toBe(100);
    expect(animeProgressPercent({ progress: 99, media: { episodes: 12 } })).toBe(100);
    expect(animeProgressPercent({ progress: 3, media: {} })).toBe(0);
  });
});

describe("mapManualAnime", () => {
  const manual = [
    { id: "1", title: "Watching Now", type: "Anime", status: "CURRENT", score: "9", coverUrl: "a.jpg" },
    { id: "2", title: "Finished", type: "Anime", status: "COMPLETED", score: "8" },
    { id: "3", title: "A Manga", type: "Manga", status: "COMPLETED", score: "10" },
  ];

  it("filters by type and status and reshapes the payload", () => {
    const mapped = mapManualAnime(manual, "Anime", "CURRENT");

    expect(mapped).toHaveLength(1);
    expect(mapped[0]).toMatchObject({
      id: "manual-1",
      isFavorite: false,
      manualDetails: manual[0],
    });
    expect(mapped[0].media.title.english).toBe("Watching Now");
    expect(mapped[0].media.coverImage.large).toBe("a.jpg");
    expect(mapped[0].media.averageScore).toBe(90);
    expect(mapped[0].media.genres).toEqual([]);
  });

  it("defaults the type to Anime and the status to COMPLETED", () => {
    const mapped = mapManualAnime([{ id: "9", title: "Bare" }], "Anime", "COMPLETED");
    expect(mapped).toHaveLength(1);
    expect(mapped[0].media.coverImage.large).toBe("/placeholder.png");
  });
});

describe("sortEntries", () => {
  const base = [
    { id: 1, score: "5", media: { id: 11, title: { romaji: "Beta" }, genres: ["Action"], averageScore: 70 } },
    { id: 2, score: "9", isFavorite: true, media: { id: 12, title: { romaji: "Alpha" }, genres: ["Drama"], averageScore: 90 } },
    { id: 3, score: "7", media: { id: 13, title: { romaji: "Gamma" }, genres: ["Action"], averageScore: 80 } },
  ];

  it("always puts favourites first", () => {
    const sorted = sortEntries(base, { sort: "name" });
    expect(sorted[0].id).toBe(2);
  });

  it("sorts alphabetically by default", () => {
    const sorted = sortEntries(base, { sort: "name" });
    expect(sorted.map((e) => e.media.title.romaji)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("sorts by the user's own score", () => {
    const sorted = sortEntries(base, { sort: "myRating" });
    expect(sorted.map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("sorts by the overall community score", () => {
    const sorted = sortEntries(base, { sort: "overallRating" });
    expect(sorted.map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("filters by genre", () => {
    const sorted = sortEntries(base, { sort: "name", genre: "Action" });
    expect(sorted.map((e) => e.id)).toEqual([1, 3]);
  });

  it("marks entries as favourites when their media id is in the favourite set", () => {
    const sorted = sortEntries(base, { favoriteIds: new Set([13]) });

    // id 2 is already a favourite, id 3 becomes one via the AniList favourite set;
    // both must outrank the non-favourite id 1.
    expect(sorted.map((e) => e.id)).toEqual([2, 3, 1]);
    expect(sorted[0].isFavorite).toBe(true);
    expect(sorted[1].isFavorite).toBe(true);
    expect(sorted[2].isFavorite).toBe(false);
  });
});

describe("sortGames", () => {
  const steam = [
    { appid: 1, name: "Steam A", playtime_forever: 600, isFavorite: false, status: undefined, genres: [] },
    { appid: 2, name: "Steam B", playtime_forever: 120, isFavorite: false, status: undefined, genres: [] },
  ];
  const manual = [
    { id: "m1", title: "Manual A", hours: "10", status: "Favorite", genre: "RPG" },
    { id: "m2", title: "Manual B", hours: "1", status: "Currently Playing", genre: "FPS" },
  ];

  it("merges Steam and manual games, favourites first", () => {
    const sorted = sortGames({ steamGames: steam, manualGames: manual, sort: "name" });

    expect(sorted[0].name).toBe("Manual A");
    expect(sorted.map((g) => g.name)).toEqual(["Manual A", "Manual B", "Steam A", "Steam B"]);
  });

  it("sorts by playtime when asked", () => {
    const sorted = sortGames({ steamGames: steam, manualGames: manual, sort: "playtime" });

    expect(sorted[0].name).toBe("Manual A"); // favourite always wins
    expect(sorted[1].name).toBe("Steam A"); // 600 mins
  });

  it("filters to favourites", () => {
    const sorted = sortGames({ steamGames: steam, manualGames: manual, filter: "favorites" });
    expect(sorted).toHaveLength(1);
    expect(sorted[0].name).toBe("Manual A");
  });

  it("filters to currently playing", () => {
    const sorted = sortGames({
      steamGames: [...steam, { appid: 3, name: "Recent", playtime_2weeks: 45 }],
      manualGames: manual,
      filter: "playing",
    });

    expect(sorted.map((g) => g.name)).toEqual(["Manual B", "Recent"]);
  });

  it("returns nothing when there is no data", () => {
    expect(sortGames({})).toEqual([]);
  });
});

describe("steam artwork", () => {
  it("builds the header URL for live games", () => {
    expect(steamImageUrl({ appid: 730 })).toBe("https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg");
  });

  it("uses the stored banner for manual games", () => {
    expect(steamImageUrl({ isManual: true, img_icon_url: "banner.jpg" })).toBe("banner.jpg");
  });

  it("converts minutes to hours", () => {
    expect(steamHours({ playtime_forever: 600 })).toBe("10.0");
    expect(steamHours({ hours: 10 })).toBe("10.0");
  });
});

describe("genre collectors", () => {
  it("collects anime genres across lists, de-duplicated and sorted", () => {
    const genres = collectAnimeGenres([
      [{ media: { genres: ["Action", "Drama"] } }, { media: { genres: ["Action"] } }],
    ]);

    expect(genres).toEqual(["Action", "Drama"]);
  });

  it("collects manual game genres from comma separated strings", () => {
    const genres = collectGameGenres([
      { genre: "Action RPG, FPS" },
      { genre: "FPS, Co-op" },
      { genre: "" },
    ]);

    expect(genres).toEqual(["Action RPG", "Co-op", "FPS"]);
  });
});

describe("slugify", () => {
  it("turns titles into URL-safe slugs", () => {
    expect(slugify("Awesome Project")).toBe("awesome-project");
    expect(slugify("  N1Code 2.0!! ")).toBe("n1code-2-0");
    expect(slugify("Café Déjà Vu")).toBe("cafe-deja-vu");
    expect(slugify("")).toBe("");
  });
});
