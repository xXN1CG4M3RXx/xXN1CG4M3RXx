import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SetupList from "../src/components/SetupList";

describe("SetupList", () => {
  it("renders setup items correctly", () => {
    const items = [
      { name: "Keyboard", category: "Input", link: "https://example.com" },
      { name: "Mouse", category: "Input" }
    ];

    render(<SetupList title="My Setup" icon={<span>Icon</span>} items={items} />);
    
    expect(screen.getByText("My Setup")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
