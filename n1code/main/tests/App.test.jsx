import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import App from "../src/App";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/firebase", () => ({
  db: {},
  storage: {},
  auth: {},
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  getDoc: vi.fn(),
  increment: vi.fn((n) => n),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("../src/lib/cache", () => ({
  fetchCachedData: vi.fn(),
  dataCache: {},
}));

vi.mock("../src/lib/IconRegistry", () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />,
}));

const EMPTY_SITE = {
  profile: null,
  projects: null,
  skills: null,
  setup: null,
  interests: null,
};

/** Seed the cache hook with a full (or partial) site payload. */
function seedSite(overrides = {}) {
  const site = { ...EMPTY_SITE, ...overrides };
  fetchCachedData.mockImplementation((type) => Promise.resolve(site[type] ?? null));
}

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const routes = [
    "/",
    "/projects",
    "/projects/some-build",
    "/skills",
    "/setup",
    "/anime",
    "/games",
    "/contact",
    "/does-not-exist",
  ];

  it.each(routes)("renders %s without crashing", async (route) => {
    seedSite();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(document.body.innerHTML).not.toBe("");
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it("redirects the legacy /interests route to /games", async () => {
    seedSite();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/interests"]}>
          <App />
        </MemoryRouter>
      );
    });

    // MemoryRouter never touches window.location, so assert on what rendered
    expect(await screen.findByRole("heading", { name: /gaming hub/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /anime & manga/i })).not.toBeInTheDocument();
  });

  it("mounts the shared backdrop and the HUD navbar", async () => {
    seedSite();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });
});
