import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Setup from "./pages/Setup";
import Contact from "./pages/Contact";
import { useEffect } from "react";
import { db } from "./lib/firebase";
import { doc, setDoc, increment } from "firebase/firestore";

export default function App() {
  useEffect(() => {
    // Only track one view per session
    if (!sessionStorage.getItem("hasTrackedView")) {
      const trackView = async () => {
        try {
          const analyticsRef = doc(db, "settings", "analytics");
          await setDoc(analyticsRef, { views: increment(1) }, { merge: true });
          sessionStorage.setItem("hasTrackedView", "true");
        } catch (error) {
          console.error("Failed to track view:", error);
        }
      };
      trackView();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Navbar />
    </div>
  );
}
