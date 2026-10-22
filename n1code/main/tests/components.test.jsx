import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Dropdown from "../src/components/Dropdown";
import ScrollNav from "../src/components/ScrollNav";
import Backdrop from "../src/components/Backdrop";
import Reveal from "../src/components/Reveal";
import { HudCorners, HudChip, SectionHeading } from "../src/components/HUD";

const OPTIONS = [
  { value: "all", label: "All Genres" },
  { value: "action", label: "Action" },
];

describe("Dropdown", () => {
  it("shows the selected option and opens on click", async () => {
    render(<Dropdown options={OPTIONS} value="all" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /all genres/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /all genres/i }));

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /action/i, selected: false })).toBeInTheDocument();
  });

  it("reports the chosen value and closes", async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} value="all" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(await screen.findByRole("option", { name: /action/i }));

    expect(onChange).toHaveBeenCalledWith("action");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("closes on outside click", async () => {
    render(
      <div>
        <Dropdown options={OPTIONS} value="all" onChange={() => {}} />
        <button type="button">outside</button>
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: /all genres/i }));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: /outside/i }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("closes on Escape", async () => {
    render(<Dropdown options={OPTIONS} value="all" onChange={() => {}} />);

    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });
});

describe("ScrollNav", () => {
  const sections = [
    { id: "hero", label: "Entry" },
    { id: "projects", label: "Projects" },
  ];

  it("renders a dot per section with an accessible label", () => {
    render(<ScrollNav sections={sections} />);

    expect(screen.getByRole("navigation", { name: /section navigation/i })).toBeInTheDocument();
    sections.forEach((section) => {
      expect(screen.getByRole("button", { name: section.label })).toBeInTheDocument();
    });
  });

  it("renders no dot navigation when no sections are given", () => {
    render(<ScrollNav sections={[]} />);
    expect(screen.queryByRole("navigation", { name: /section navigation/i })).not.toBeInTheDocument();
  });
});

describe("Backdrop", () => {
  it("mounts the ambient layer without crashing", () => {
    const { container } = render(<Backdrop />);

    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(container.querySelector(".hud-grid")).toBeInTheDocument();
  });
});

describe("Reveal", () => {
  it("renders its children and reveals once in view", async () => {
    const { container } = render(
      <Reveal variant="fade-up">
        <p>revealed content</p>
      </Reveal>
    );

    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("reveal");
    expect(wrapper).toHaveAttribute("data-variant", "fade-up");
    expect(screen.getByText("revealed content")).toBeInTheDocument();

    // the test shim reports intersection immediately
    await waitFor(() => expect(wrapper).toHaveClass("is-visible"));
  });


  it("applies the stagger delay as a custom property", () => {
    const { container } = render(<Reveal delay={150} />);
    expect(container.firstElementChild).toHaveStyle({ "--reveal-delay": "150ms" });
  });
});

describe("HUD primitives", () => {
  it("renders four corner brackets", () => {
    const { container } = render(<HudCorners />);
    expect(container.querySelectorAll(".hud-corner")).toHaveLength(4);
  });

  it("renders status chips", () => {
    render(
      <div>
        <HudChip>plain</HudChip>
        <HudChip tone="pink">alert</HudChip>
        <HudChip tone="green">ok</HudChip>
        <HudChip tone="amber">warn</HudChip>
      </div>
    );

    expect(screen.getByText("plain")).toHaveClass("hud-chip");
    expect(screen.getByText("alert")).toHaveClass("border-[#f43f5e]/35");
    expect(screen.getByText("ok")).toHaveClass("border-emerald-400/35");
    expect(screen.getByText("warn")).toHaveClass("border-amber-400/35");
  });

  it("renders the section heading block", () => {
    render(
      <SectionHeading kicker="sector 01" title="Featured" accent="Builds" subtitle="Some copy" />
    );

    expect(screen.getByRole("heading", { name: /featured/i })).toBeInTheDocument();
    expect(screen.getByText(/builds/i)).toBeInTheDocument();
    expect(screen.getByText("Some copy")).toBeInTheDocument();
  });
});
