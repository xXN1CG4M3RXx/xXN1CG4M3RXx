import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectCard from "../src/components/ProjectCard";

describe("ProjectCard", () => {
  it("renders project details correctly", () => {
    const project = {
      title: "Test Project",
      description: "A cool project",
      imageUrl: "test.jpg",
      tags: ["React", "Vitest"],
      githubUrl: "https://github.com/test",
      liveUrl: "https://test.com"
    };

    render(<ProjectCard project={project} />);
    
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A cool project")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
    
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "test.jpg");
  });

  it("renders without image and links", () => {
    const project = {
      title: "No Image Project",
      description: "No image or links"
    };

    const { container } = render(<ProjectCard project={project} />);
    
    expect(screen.getByText("No Image Project")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
