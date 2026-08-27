import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../src/pages/Home";
import { fetchCachedData } from "../src/lib/cache";
import { setDoc } from "firebase/firestore";
import { MemoryRouter } from "react-router";

vi.mock("../src/lib/firebase", () => ({
  db: {}
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  increment: vi.fn(),
}));

vi.mock("../src/lib/cache", () => ({
  fetchCachedData: vi.fn()
}));

vi.mock("../src/lib/IconRegistry", () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading initially", () => {
    fetchCachedData.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders profile when data is loaded", async () => {
    const mockProfile = {
      username: "Test User",
      bio: "Test Bio",
      background: { type: "color", color1: "#000" },
      pageBackground: { type: "color", color1: "#000" },
      avatarUrl: "test.jpg",
      links: [
        { id: "1", title: "Link 1", icon: "link1", url: "https://test.com", internal: false },
        { id: "2", title: "Link 2", icon: "link2", url: "/test", internal: true }
      ]
    };

    fetchCachedData.mockImplementation((key, callback) => {
      callback(mockProfile);
      return Promise.resolve(mockProfile);
    });

    render(<MemoryRouter><Home /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Test Bio")).toBeInTheDocument();
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
  });

  it("calls setDoc when a link is clicked", async () => {
    const mockProfile = {
      username: "Test User",
      background: { type: "image", imageUrl: "test.jpg" },
      pageBackground: { type: "gradient", color1: "#000", color2: "#111" },
      links: [
        { id: "1", title: "Link 1", icon: "link1", url: "https://test.com", internal: false }
      ]
    };

    fetchCachedData.mockImplementation((key, callback) => {
      callback(mockProfile);
      return Promise.resolve(mockProfile);
    });

    render(<MemoryRouter><Home /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const link = screen.getByText("Link 1");
    fireEvent.click(link);

    expect(setDoc).toHaveBeenCalled();
  });

  it("renders null if profile is not found", async () => {
    fetchCachedData.mockImplementation((key, callback) => {
      callback(null);
      return Promise.resolve(null);
    });
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
    await waitFor(() => {
        expect(container).toBeEmptyDOMElement();
    });
  });
});
