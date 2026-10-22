import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Contact from "../src/pages/Contact";
import ContactForm from "../src/components/ContactForm";
import { addDoc } from "firebase/firestore";
import { fetchCachedData } from "../src/lib/cache";

vi.mock("../src/lib/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("../src/lib/cache", () => ({ fetchCachedData: vi.fn(), dataCache: {} }));

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }) => {
    // Automatically trigger onSuccess with a mock token to simulate successful captcha
    setTimeout(() => onSuccess("mock-turnstile-token"), 0);
    return <div data-testid="turnstile-mock" />;
  },
}));

global.fetch = vi.fn();

const EMPTY = { profile: null, projects: null, skills: null, setup: null, interests: null };

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCachedData.mockImplementation((type) => Promise.resolve(EMPTY[type] ?? null));
  });

  it("renders the standalone page and the form", () => {
    render(<MemoryRouter><Contact /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /let's connect/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What should I call you?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Where can I reply?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
  });
});

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields", () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText("What should I call you?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Where can I reply?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
  });

  it("submits successfully", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    addDoc.mockResolvedValueOnce({});

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Where can I reply?"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: "Hello" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Send Message/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sent Successfully!/i)).toBeInTheDocument();
    });

    expect(addDoc).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("handles a submission error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Failed" }),
    });
    addDoc.mockRejectedValueOnce(new Error("Firebase Error"));

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Where can I reply?"), {
      target: { value: "j@j.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: "Hi" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Send Message/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error Sending/i)).toBeInTheDocument();
    });
  });
});
