import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Contact from "../src/pages/Contact";
import { addDoc } from "firebase/firestore";

vi.mock("../src/lib/firebase", () => ({
  db: {}
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn()
}));

global.fetch = vi.fn();

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form correctly", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText("What should I call you?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Where can I reply?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    addDoc.mockResolvedValueOnce({});

    render(<Contact />);
    
    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Where can I reply?"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), { target: { value: "Hello" } });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    expect(screen.getByText(/Sending.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Sent Successfully!/i)).toBeInTheDocument();
    });

    expect(addDoc).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("handles submission error", async () => {
    addDoc.mockRejectedValueOnce(new Error("Firebase Error"));

    render(<Contact />);
    
    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Where can I reply?"), { target: { value: "j@j.com" } });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), { target: { value: "Hi" } });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error Sending/i)).toBeInTheDocument();
    });
  });
});
