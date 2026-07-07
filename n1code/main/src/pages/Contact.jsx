import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24 min-h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400 mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          Let's <span className="gradient-text">Connect</span>
        </h1>
        <p className="max-w-xl text-slate-400 text-lg font-light">
          Have a question, project idea, or just want to say hi? Drop a message below and I'll get back to you!
        </p>
      </div>

      <div className="glassmorphism rounded-[2.5rem] p-8 md:p-12 w-full mx-auto relative overflow-hidden bg-slate-900/40 border border-sky-aqua-500/10 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider pl-2">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-aqua-500/50 focus:ring-1 focus:ring-sky-aqua-500/50 transition-all placeholder:text-slate-600"
                placeholder="What should I call you?"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider pl-2">Email</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-aqua-500/50 focus:ring-1 focus:ring-sky-aqua-500/50 transition-all placeholder:text-slate-600"
                placeholder="Where can I reply?"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider pl-2">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-aqua-500/50 focus:ring-1 focus:ring-sky-aqua-500/50 transition-all resize-none placeholder:text-slate-600"
              placeholder="What's on your mind?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-4 w-full md:w-auto md:self-end bg-sky-aqua-500 hover:bg-sky-aqua-400 text-slate-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sky-aqua-500/25"
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : status === "success" ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Sent Successfully!
              </span>
            ) : status === "error" ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Error Sending
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
