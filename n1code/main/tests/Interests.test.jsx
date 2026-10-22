import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Anime from "../src/pages/Anime";
import Games from "../src/pages/Games";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/firebase", () => ({ db: {} }));

vi.mock("../src/lib/cache", () => ({ fetchCachedData: vi.fn(), dataCache: {} }));

vi.mock("../src/lib/IconRegistry", () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />,
}));

const EMPTY = { profile: null, projects: null, skills: null, setup: null, interests: null };

function seed(overrides = {}) {
  const site = { ...EMPTY, ...overrides };
  fetchCachedData.mockImplementation((type) => Promise.resolve(site[type] ?? null));
}

/** AniList shape, matching the live GraphQL response. */
function anilistResponse(entries = []) {
  return {
    data: {
      anime: { lists: [{ entries }] },
      manga: { lists: [] },
      User: { favourites: { anime: { nodes: [] }, manga: { nodes: [] } } },
    },
  };
}

const ANIME_ENTRY = {
  id: 1,
  status: "CURRENT",
  progress: 5,
  score: "9",
  media: {
    id: 10,
    title: { english: "Test Anime", romaji: "Test Romaji" },
    episodes: 12,
    coverImage: { large: "cover.jpg" },
    genres: ["Action"],
    averageScore: 88,
    siteUrl: "https://anilist.co/anime/10",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("Anime page", () => {
  it("renders the header", async () => {
    seed({ interests: { anime: [], anilistUsername: "", anilistSyncEnabled: false } });

    render(
      <MemoryRouter>
        <Anime />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /anime & manga/i })).toBeInTheDocument());
  });

  it("renders manually curated entries without any live sync", async () => {
    seed({
      interests: {
        anime: [
          { id: "m1", title: "Manual Anime", type: "Anime", status: "COMPLETED", score: "10", coverUrl: "x.jpg" },
        ],
        anilistUsername: "",
        anilistSyncEnabled: false,
      },
    });

    render(
      <MemoryRouter>
        <Anime />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getAllByText("Manual Anime").length).toBeGreaterThan(0));
    expect(screen.getByText(/completed anime/i)).toBeInTheDocument();
  });

  it("merges live AniList entries into the right groups", async () => {
    seed({
      interests: {
        anime: [],
        anilistUsername: "testuser",
        anilistSyncEnabled: true,
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(anilistResponse([ANIME_ENTRY])),
    });

    render(
      <MemoryRouter>
        <Anime />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getAllByText("Test Anime").length).toBeGreaterThan(0));
    expect(screen.getByText(/currently watching/i)).toBeInTheDocument();
  });

  it("shows the empty state when nothing is configured", async () => {
    seed({ interests: { anime: [], anilistUsername: "", anilistSyncEnabled: false } });

    global.fetch = vi.fn();

    render(
      <MemoryRouter>
        <Anime />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/no anime or manga found\. configure anilist sync/i)
      ).toBeInTheDocument()
    );
  });
});

describe("Games page", () => {
  it("renders the header", async () => {
    seed({ interests: { games: [], steamId: "", steamSyncEnabled: false } });

    render(
      <MemoryRouter>
        <Games />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /gaming hub/i })).toBeInTheDocument());
  });

  it("renders manually curated games with their playtime", async () => {
    seed({
      interests: {
        games: [
          { id: "g1", title: "Manual Game", hours: "10", status: "Favorite", genre: "RPG" },
          { id: "g2", title: "Other Game", hours: "2.5", status: "Currently Playing", genre: "FPS" },
        ],
        steamId: "",
        steamSyncEnabled: false,
      },
    });

    render(
      <MemoryRouter>
        <Games />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Manual Game")).toBeInTheDocument());
    expect(screen.getByText("Other Game")).toBeInTheDocument();
    expect(screen.getByText("10.0 hrs")).toBeInTheDocument();
  });

  it("merges live Steam games into the grid", async () => {
    seed({
      interests: { games: [], steamId: "76561198000000000", steamSyncEnabled: true },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () =>
        Promise.resolve(
          JSON.stringify({
            games: [
              { appid: 730, name: "Steam Game", playtime_forever: 600, img_icon_url: "abc", playtime_2weeks: 30 },
            ],
            privateProfile: false,
          })
        ),
    });

    render(
      <MemoryRouter>
        <Games />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Steam Game")).toBeInTheDocument());
    expect(screen.getByText("playing now")).toBeInTheDocument();
  });

  it("shows the empty state when nothing is configured", async () => {
    seed({ interests: { games: [], steamId: "", steamSyncEnabled: false } });

    global.fetch = vi.fn();

    render(
      <MemoryRouter>
        <Games />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/no games added yet\. configure steam sync/i)).toBeInTheDocument()
    );
  });
});
