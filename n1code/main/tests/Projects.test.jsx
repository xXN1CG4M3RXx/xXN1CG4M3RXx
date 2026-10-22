import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import Projects from "../src/pages/Projects";
import ProjectDetail from "../src/pages/ProjectDetail";
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

const PROJECTS = {
  list: [
    { id: "1", title: "Awesome Project", description: "A great project", tags: ["React"] },
    { id: "2", title: "Second Build", description: "Another one", tags: ["Node"] },
  ],
};

describe("Projects page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header and every project", async () => {
    seed({ projects: PROJECTS });

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Awesome Project")).toBeInTheDocument());
    expect(screen.getByText("Second Build")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /project showcase/i })).toBeInTheDocument();
  });

  it("shows the empty state when nothing is configured", async () => {
    seed({ projects: { list: [] } });

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/no projects added yet/i)).toBeInTheDocument());
  });
});

describe("ProjectDetail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the write-up for a matching slug", async () => {
    seed({ projects: PROJECTS });

    render(
      <MemoryRouter initialEntries={["/projects/awesome-project"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getAllByText("Awesome Project").length).toBeGreaterThan(0));
    expect(screen.getByText("A great project")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /more builds/i })).toBeInTheDocument();
  });

  it("links out to the live deployment and the repository", async () => {
    seed({
      projects: {
        list: [
          {
            id: "1",
            title: "Linked Build",
            description: "Has links",
            liveUrl: "https://example.com",
            githubUrl: "https://github.com/x/y",
          },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={["/projects/linked-build"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getAllByText("Linked Build").length).toBeGreaterThan(0));

    expect(screen.getByRole("link", { name: /view live/i })).toHaveAttribute("href", "https://example.com/");
    expect(screen.getByRole("link", { name: /source/i })).toHaveAttribute(
      "href",
      "https://github.com/x/y"
    );
  });

  it("renders the 404 state for an unknown slug", async () => {
    seed({ projects: PROJECTS });

    render(
      <MemoryRouter initialEntries={["/projects/nope"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /back to projects/i })).toHaveAttribute("href", "/projects");
  });

  it("falls back to a slug derived from the title", async () => {
    seed({ projects: PROJECTS });

    render(
      <MemoryRouter initialEntries={["/projects/second-build"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getAllByText("Second Build").length).toBeGreaterThan(0));
  });
});
