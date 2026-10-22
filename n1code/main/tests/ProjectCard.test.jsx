import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import ProjectCard from "../src/components/ProjectCard";

function renderCard(project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>
  );
}

describe("ProjectCard", () => {
  it("renders project details correctly", () => {
    const project = {
      title: "Test Project",
      description: "A cool project",
      imageUrl: "test.jpg",
      tags: ["React", "Vitest"],
      githubUrl: "https://github.com/test",
      liveUrl: "https://test.com",
    };

    renderCard(project);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A cool project")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "test.jpg");

    expect(screen.getByRole("link", { name: /source code/i })).toHaveAttribute(
      "href",
      "https://github.com/test"
    );
    expect(screen.getByRole("link", { name: /^live$/i })).toHaveAttribute("href", "https://test.com/");
  });

  it("renders without image and links", () => {
    const project = {
      title: "No Image Project",
      description: "No image or links",
    };

    const { container } = renderCard(project);

    expect(screen.getByText("No Image Project")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("links through to the project detail page", () => {
    renderCard({ title: "Some Build", description: "Desc" });

    expect(screen.getByRole("link", { name: /details →/i })).toHaveAttribute(
      "href",
      "/projects/some-build"
    );
  });

  it("honours a pre-computed slug", () => {
    renderCard({ title: "Some Build", slug: "custom-slug", description: "Desc" });

    expect(screen.getByRole("link", { name: /details →/i })).toHaveAttribute(
      "href",
      "/projects/custom-slug"
    );
  });
});
