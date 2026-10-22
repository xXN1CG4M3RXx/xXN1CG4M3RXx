import { Link } from "react-router";
import { ArrowRight, Code2 } from "lucide-react";
import { useSiteData, asList } from "../hooks/useSiteData";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import SkillsGrid from "../components/SkillsGrid";
import ProjectCard from "../components/ProjectCard";

/** /skills — the full tech stack, grouped by category. */
export default function Skills() {
  const { data, loading } = useSiteData();
  const skills = asList(data.skills);
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
            <span className="text-sky-aqua-500/70">[</span>sector 04 — loadout
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Tech <span className="gradient-text">Stack</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            The languages, frameworks and tools I use to build digital experiences.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap gap-3">
            <HudChip>{skills.length} skills logged</HudChip>
            <HudChip tone="green">actively learning</HudChip>
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        {loading && skills.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 py-16 text-center text-slate-500">
            No skills added yet.
          </div>
        ) : (
          <SkillsGrid skills={skills} />
        )}
      </div>

      {projects.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                Built with <span className="gradient-text">these</span>
              </h2>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
              >
                open projects
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Reveal key={project.id ?? index} delay={index * 90} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <div className="mt-20 flex items-center gap-3 border-t border-white/5 pt-8 text-slate-600">
        <Code2 className="h-4 w-4" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
          proficiency: expert → beginner, self-assessed
        </p>
      </div>
    </PageShell>
  );
}
