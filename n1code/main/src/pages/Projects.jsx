import { Link } from "react-router";
import { Code2 } from "lucide-react";
import { useSiteData, asList } from "../hooks/useSiteData";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";

/** /projects — every build, newest first, with links into the detail pages. */
export default function Projects() {
  const { data, loading } = useSiteData();
  const projects = asList(data.projects);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            overview
          </Link>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <p className="kicker">
            <span className="text-sky-aqua-500/70">[</span>sector 03 — built things
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Project <span className="gradient-text">Showcase</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            A collection of things I have built — web applications, gaming tools and the occasional experiment.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap gap-3">
            <HudChip>{projects.length} builds logged</HudChip>
            <HudChip tone="green">click any card for the full write-up</HudChip>
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        {loading && projects.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 py-16 text-center text-slate-500">
            No projects added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id ?? project.slug ?? index} delay={(index % 3) * 90} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="mt-20 flex items-center gap-3 border-t border-white/5 pt-8 text-slate-600">
        <Code2 className="h-4 w-4" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
          {"// each build gets its own page at /projects/<build-title-slug>"}
        </p>
      </div>
    </PageShell>
  );
}
