import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navbar from "../src/components/Navbar";
import { MemoryRouter } from "react-router";

describe("Navbar", () => {
  it("renders the logo and every section link", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /n1code — back to overview/i })).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /primary/i });
    ["Overview", "Projects", "Anime", "Games", "Stack", "Setup", "Contact"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
      expect(nav).toBeInTheDocument();
    });
  });

  it("marks the current route as active", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Navbar />
      </MemoryRouter>
    );

    // react-router puts aria-current="page" on the matching NavLink
    const active = screen
      .getByRole("navigation", { name: /primary/i })
      .querySelector('[aria-current="page"]');

    expect(active).not.toBeNull();
    expect(active?.textContent).toContain("Projects");
  });

  it("offers a shortcut back to the overview on detail routes", () => {
    render(
      <MemoryRouter initialEntries={["/skills"]}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link", { name: /overview/i })[0]).toHaveAttribute("href", "/");
  });

  it("toggles the mobile menu", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const toggle = screen.getByRole("button", { name: /open navigation/i });
    expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(await screen.findByRole("navigation", { name: /mobile/i })).toBeInTheDocument();
  });
});
