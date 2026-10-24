import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Home from "../src/pages/Home";
import { fetchCachedData } from "../src/lib/cache";
import { setDoc } from "firebase/firestore";

vi.mock("../src/lib/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  increment: vi.fn((n) => n),
}));

vi.mock("../src/lib/cache", () => ({ fetchCachedData: vi.fn(), dataCache: {} }));

vi.mock("../src/lib/IconRegistry", () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />,
}));

const EMPTY = {
  profile: null,
  projects: null,
  skills: null,
  setup: null,
  interests: null,
};

function seed(overrides = {}) {
  const site = { ...EMPTY, ...overrides };
  fetchCachedData.mockImplementation((type) => Promise.resolve(site[type] ?? null));
}

describe("Home (single-page overview)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders the hero with username and bio", async () => {
    seed({
      profile: {
        username: "Test User",
        bio: "Test Bio",
        avatarUrl: "test.jpg",
        links: [{ id: "1", title: "Link 1", icon: "github", url: "https://test.com", internal: false }],
      },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test User")).toBeInTheDocument());
    expect(screen.getByText("Test Bio")).toBeInTheDocument();
    expect(screen.getByText("Link 1")).toBeInTheDocument();
  });

  it("renders one section per content area", async () => {
    seed({
      profile: { username: "Test User", bio: "Bio" },
      projects: { list: [{ id: "p1", title: "Proj One", description: "Desc", tags: ["React"] }] },
      skills: { list: [{ id: "s1", name: "React", category: "Frontend", proficiency: "Expert", icon: "react" }] },
      setup: { gamingPc: [{ id: "g1", name: "RTX", category: "GPU" }] },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test User")).toBeInTheDocument());

    expect(document.getElementById("hero")).toBeInTheDocument();
    expect(document.getElementById("stats")).toBeInTheDocument();
    expect(document.getElementById("projects")).toBeInTheDocument();
    expect(document.getElementById("stack")).toBeInTheDocument();
    expect(document.getElementById("setup")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();

    // the scroll progress bar is mounted and purely decorative
    const bar = document.querySelector(".fixed.top-0[aria-hidden='true']");
    expect(bar).toBeInTheDocument();
    expect(bar.querySelectorAll("button, a")).toHaveLength(0);
  });

  it("counts every game in the stats band, not just the marquee slice", async () => {
    // The marquee only shows 8 tiles; the counter used to report that slice
    // length, so a large library rendered as "8+".
    //
    // happy-dom's requestAnimationFrame advances its clock by microseconds per
    // frame, so the count-up never finishes there. Pretending the user asked
    // for reduced motion makes useCountUp settle on its final value at once.
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: /prefers-reduced-motion/.test(query),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    try {
      const games = Array.from({ length: 10 }, (_, i) => ({
        id: `g${i}`,
        title: `Game ${i}`,
        hours: "10",
        status: "Completed",
        genre: "RPG",
      }));

      seed({
        profile: { username: "Test User" },
        interests: { games, steamId: "", steamSyncEnabled: false, anime: [] },
      });

      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      await waitFor(() => expect(screen.getByText("Test User")).toBeInTheDocument());

      // the marquee loops its tiles, so "Game 0" is expected more than once
      expect(screen.getAllByText("Game 0").length).toBeGreaterThan(0);

      // the marquee is capped at 8 tiles, the counter is not. The track
      // renders each tile twice so the loop has no visible seam.
      expect(document.querySelectorAll("#lounge .marquee-track > *")).toHaveLength(16);

      // the first .font-display in #stats is the *projects* counter, so
      // target the games one by its hook
      const stat = document.querySelector('#stats [data-stat="games"] .font-display');
      await waitFor(() => expect(stat).toHaveTextContent("10"));
      expect(stat).not.toHaveTextContent("8");
    } finally {
      matchMedia.mockRestore();
    }
  });

  it("shows the featured projects with a link through to the detail page", async () => {
    seed({
      profile: { username: "Test User" },
      projects: { list: [{ id: "p1", title: "Proj One", description: "Desc", tags: ["React"] }] },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Proj One")).toBeInTheDocument());

    const detail = screen.getByRole("link", { name: /details →/i });
    expect(detail).toHaveAttribute("href", "/projects/proj-one");
  });

  it("tracks one view per session once the intro resolves", async () => {
    vi.useFakeTimers();
    seed({ profile: { username: "Test User" } });

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    // advance past the intro timeline without draining the typewriter's interval
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });

    expect(setDoc).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("shows a loading state while the site data is pending", () => {
    fetchCachedData.mockImplementation(() => new Promise(() => {}));

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });
});
