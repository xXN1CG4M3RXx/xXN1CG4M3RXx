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

    // the section dot navigation mirrors the sections
    expect(screen.getAllByRole("button", { name: "Projects" }).length).toBeGreaterThan(0);
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
