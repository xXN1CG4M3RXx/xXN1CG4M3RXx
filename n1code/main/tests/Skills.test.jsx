import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Skills from "../src/pages/Skills";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/cache", () => ({
  fetchCachedData: vi.fn()
}));

vi.mock("../src/lib/IconRegistry", () => ({
  getIconComponent: () => () => <svg data-testid="mock-icon" />
}));

describe("Skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    fetchCachedData.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<Skills />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders empty state", async () => {
    fetchCachedData.mockImplementation((key, callback) => {
      callback({ list: [] });
      return Promise.resolve({ list: [] });
    });
    
    render(<Skills />);
    
    await waitFor(() => {
      expect(screen.getByText(/No skills added yet/i)).toBeInTheDocument();
    });
  });

  it("renders skills correctly by category", async () => {
    const mockSkills = {
      list: [
        { id: "1", name: "JavaScript", category: "Language", proficiency: "Expert", icon: "js" },
        { id: "2", name: "React", category: "Frontend", proficiency: "Advanced", icon: "react" },
        { id: "3", name: "Node", category: "Backend", proficiency: "Intermediate", icon: "node" },
        { id: "4", name: "SQL", category: "Database", proficiency: "Beginner", icon: "sql" },
        { id: "5", name: "Git", category: "Tool", proficiency: "Other", icon: "git" }
      ]
    };

    fetchCachedData.mockImplementation((key, callback) => {
      callback(mockSkills);
      return Promise.resolve(mockSkills);
    });

    render(<Skills />);
    
    await waitFor(() => {
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });
    
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
