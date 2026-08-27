import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Setup from "../src/pages/Setup";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/firebase", () => ({
  db: {}
}));

vi.mock("../src/lib/cache", () => ({
  fetchCachedData: vi.fn()
}));

describe("Setup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders setup lists correctly", async () => {
    const mockData = {
      gamingPc: [{ name: "CPU", category: "Hardware" }],
      gamingPeripherals: [{ name: "Mouse", category: "Peripheral" }],
      development: [{ name: "MacBook", category: "Laptop" }]
    };

    fetchCachedData.mockImplementation((key, callback) => {
      callback(mockData);
      return Promise.resolve(mockData);
    });

    render(<Setup />);
    
    expect(screen.getByText("PC Specs")).toBeInTheDocument();
    expect(screen.getByText("Peripherals")).toBeInTheDocument();
    expect(screen.getByText("Development Setup")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("CPU")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("MacBook")).toBeInTheDocument();
  });
});
