import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Skills from "../src/pages/Skills";
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

const SKILLS = {
  list: [
    { id: "1", name: "JavaScript", category: "Language", proficiency: "Expert", icon: "js" },
    { id: "2", name: "React", category: "Frontend", proficiency: "Advanced", icon: "react" },
    { id: "3", name: "Node", category: "Backend", proficiency: "Intermediate", icon: "node" },
    { id: "4", name: "SQL", category: "Database", proficiency: "Beginner", icon: "sql" },
    { id: "5", name: "Git", category: "Tool", proficiency: "Other", icon: "git" },
  ],
};

describe("Skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a loading state", () => {
    fetchCachedData.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<MemoryRouter><Skills /></MemoryRouter>);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    seed({ skills: { list: [] } });

    render(<MemoryRouter><Skills /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText(/no skills added yet/i)).toBeInTheDocument());
  });

  it("renders skills grouped by category", async () => {
    seed({ skills: SKILLS });

    render(<MemoryRouter><Skills /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText("JavaScript")).toBeInTheDocument());

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node")).toBeInTheDocument();
    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();

    // one section heading per populated category
    ["Languages", "Frontends", "Backends", "Databases", "Tools"].forEach((heading) => {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    });
  });
});
