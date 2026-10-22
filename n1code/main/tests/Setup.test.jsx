import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Setup from "../src/pages/Setup";
import SetupCard from "../src/components/SetupCard";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/firebase", () => ({ db: {} }));

vi.mock("../src/lib/cache", () => ({ fetchCachedData: vi.fn(), dataCache: {} }));

const EMPTY = { profile: null, projects: null, skills: null, setup: null, interests: null };

function seed(overrides = {}) {
  const site = { ...EMPTY, ...overrides };
  fetchCachedData.mockImplementation((type) => Promise.resolve(site[type] ?? null));
}

describe("Setup page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all three spec columns", async () => {
    seed({
      setup: {
        gamingPc: [{ id: "a", name: "CPU", category: "Hardware" }],
        gamingPeripherals: [{ id: "b", name: "Mouse", category: "Peripheral" }],
        development: [{ id: "c", name: "MacBook", category: "Laptop" }],
      },
    });

    render(<MemoryRouter><Setup /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText("PC Specs")).toBeInTheDocument());

    expect(screen.getByText("Peripherals")).toBeInTheDocument();
    expect(screen.getByText("Development Setup")).toBeInTheDocument();
    expect(screen.getByText("CPU")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("MacBook")).toBeInTheDocument();
  });

  it("accepts the legacy `gaming` key as an alias for `gamingPc`", async () => {
    seed({ setup: { gaming: [{ id: "a", name: "Legacy Part", category: "Hardware" }] } });

    render(<MemoryRouter><Setup /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText("Legacy Part")).toBeInTheDocument());
  });

  it("shows the empty state", async () => {
    seed({ setup: {} });

    render(<MemoryRouter><Setup /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText(/no setup details added yet/i)).toBeInTheDocument());
  });
});

describe("SetupCard", () => {
  it("renders the item list and links out", () => {
    const items = [
      { id: "1", name: "Keyboard", category: "Input", link: "https://example.com" },
      { id: "2", name: "Mouse", category: "Input" },
    ];

    render(
      <MemoryRouter>
        <SetupCard title="My Setup" icon={<span>Icon</span>} items={items} />
      </MemoryRouter>
    );

    expect(screen.getByText("My Setup")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("2 entries")).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com/");
  });

  it("reports when nothing is configured", () => {
    render(
      <MemoryRouter>
        <SetupCard title="Empty" icon={<span>Icon</span>} items={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/nothing configured yet/i)).toBeInTheDocument();
  });
});
