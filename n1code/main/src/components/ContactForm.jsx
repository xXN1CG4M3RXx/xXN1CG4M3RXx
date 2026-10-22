import { useState } from "react";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Turnstile } from "@marsidev/react-turnstile";
import { db } from "../lib/firebase";

const EMPTY_FORM = { name: "", email: "", message: "" };

/**
 * Contact form. Behaviour is unchanged from the original page: Turnstile first,
 * then the Netlify contact function (which validates the token server side),
 * then the message is stored in Firestore.
 *
 * `compact` trims the outer chrome so the same form can sit in the overview
 * page and on the standalone /contact route.
 */
export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [turnstileToken, setTurnstileToken] = useState("");

  const update = (field) => (event) => setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!turnstileToken) {
      setStatus("error");
      console.error("No turnstile token generated");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to trigger email notification:", errorData);
        throw new Error("Failed validation or email sending");
      }

      await addDoc(collection(db, "messages"), {
        name: String(formData.name),
        email: String(formData.email),
        message: String(formData.message),
        createdAt: serverTimestamp(),
        read: false,
      });

      setStatus("success");
      setFormData(EMPTY_FORM);
      window.setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const buttonLabel =
    status === "submitting" ? (
      <>
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
        Sending…
      </>
    ) : status === "success" ? (
      <>
        <CheckCircle className="h-5 w-5" />
        Sent Successfully!
      </>
    ) : status === "error" ? (
      <>
        <AlertCircle className="h-5 w-5" />
        Error Sending
      </>
    ) : (
      <>
        <Send className="h-5 w-5" />
        Send Message
      </>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-6 rounded-3xl border border-sky-aqua-500/15 bg-slate-950/50 p-6 backdrop-blur-xl sm:p-10"
    >
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="pl-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Name</span>
          <input
            type="text"
            required
            value={formData.name}
            onChange={update("name")}
            placeholder="What should I call you?"
            className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/60 px-5 py-4 text-slate-200 transition-all placeholder:text-slate-600 focus:border-sky-aqua-500/50 focus:outline-none focus:ring-1 focus:ring-sky-aqua-500/50"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="pl-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Email</span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={update("email")}
            placeholder="Where can I reply?"
            className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/60 px-5 py-4 text-slate-200 transition-all placeholder:text-slate-600 focus:border-sky-aqua-500/50 focus:outline-none focus:ring-1 focus:ring-sky-aqua-500/50"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="pl-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Message</span>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={update("message")}
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-2xl border border-slate-700/50 bg-slate-900/60 px-5 py-4 text-slate-200 transition-all placeholder:text-slate-600 focus:border-sky-aqua-500/50 focus:outline-none focus:ring-1 focus:ring-sky-aqua-500/50"
        />
      </label>

      <Turnstile
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAExR9uilSklFgVCg"}
        options={{ size: "invisible" }}
        onSuccess={(token) => setTurnstileToken(token)}
      />

      <button
        type="submit"
        disabled={status === "submitting" || !turnstileToken}
        className="mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-aqua-500 px-8 py-4 font-bold text-slate-900 shadow-lg shadow-sky-aqua-500/25 transition-all duration-300 hover:scale-[1.02] hover:bg-sky-aqua-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:self-end"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
