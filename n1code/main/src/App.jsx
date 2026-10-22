import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Backdrop from "./components/Backdrop";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Only the overview is needed for first paint; the detail routes load on demand.
const Projects = lazy(() => import("./pages/Projects").then((m) => ({ default: m.default })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then((m) => ({ default: m.default })));
const Skills = lazy(() => import("./pages/Skills").then((m) => ({ default: m.default })));
const Setup = lazy(() => import("./pages/Setup").then((m) => ({ default: m.default })));
const Anime = lazy(() => import("./pages/Anime").then((m) => ({ default: m.default })));
const Games = lazy(() => import("./pages/Games").then((m) => ({ default: m.default })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.default })));

/** Stand-in shown while a lazily-loaded route chunk is in flight. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">loading module</p>
      </div>
    </div>
  );
}

/** Reset the scroll position on every navigation. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Backdrop />
      <ScrollToTop />

      <ErrorBoundary>
        <Navbar />

        {/*
          `key` remounts the page on navigation so the enter animation replays.
          Detail routes are keyed on the full pathname, so /projects/a →
          /projects/b animates too.
        */}
        <div key={location.pathname} className="animate-view-enter flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/games" element={<Games />} />
              <Route path="/contact" element={<Contact />} />

              {/* The old combined interests route is now split into two pages. */}
              <Route path="/interests" element={<Navigate to="/games" replace />} />

              <Route path="/403" element={<ErrorPage code={403} />} />
              <Route path="/500" element={<ErrorPage code={500} />} />
              <Route path="*" element={<ErrorPage code={404} />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}
