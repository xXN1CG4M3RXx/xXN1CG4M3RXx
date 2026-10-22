import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, ExternalLink, FolderGit2, Tag } from "lucide-react";
import { useSiteData, asList } from "../hooks/useSiteData";
import { slugify } from "../lib/animate";
import { sanitizeUrl } from "../lib/sanitize";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";

/**
 * /projects/:slug — a single project's write-up.
 *
 * Only the fields the admin panel already writes are used (title, description,
 * tags, githubUrl, liveUrl, imageUrl), laid out as a proper detail page.
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, loading } = useSiteData();

  const projects = asList(data.projects);
  const project = projects.find(
    (candidate) => (candidate.slug || slugify(candidate.title)) === slug
  );
  const others = projects
    .filter((candidate) => candidate !== project)
    .slice(0, 3);

  if (loading && !project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">loading project</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <PageShell className="min-h-screen">
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <HudChip tone="pink">error 404</HudChip>
          <h1 className="font-display text-4xl font-bold text-slate-50 sm:text-5xl">
            This build <span className="gradient-text">doesn't exist</span>
          </h1>
          <p className="max-w-md font-light text-slate-400">
            Nothing is published under <code className="font-mono text-sky-aqua-300">/projects/{slug}</code> yet.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-aqua-500/30 bg-sky-aqua-500/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-sky-aqua-300 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            back to projects
          </Link>
        </div>
      </PageShell>
    );
  }

  const githubUrl = sanitizeUrl(project.githubUrl);
  const liveUrl = sanitizeUrl(project.liveUrl);
  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <PageShell>
      <Reveal variant="fade-up" delay={0}>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          all projects
        </Link>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* hero artwork */}
        <Reveal variant="blur" delay={80}>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/60">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-[#000016]">
                <span className="font-display text-7xl font-bold text-white/5">
                  {String(project.title).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.05]" />
            <div className="hud-corner hud-corner--tl" />
            <div className="hud-corner hud-corner--br" />
          </div>
        </Reveal>

        {/* meta panel */}
        <div className="flex flex-col gap-6">
          <Reveal variant="fade-left" delay={140}>
            <p className="kicker">
              <span className="text-sky-aqua-500/70">[</span>build file
              <span className="text-sky-aqua-500/70">]</span>
            </p>
          </Reveal>

          <Reveal variant="fade-left" delay={190}>
            <h1 className="glitch font-display text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl">
              {project.title}
            </h1>
          </Reveal>

          <Reveal variant="fade-left" delay={240}>
            <p className="text-base font-light leading-relaxed text-slate-300 sm:text-lg">
              {project.description || "No description has been written for this build yet."}
            </p>
          </Reveal>

          {tags.length > 0 && (
            <Reveal variant="fade-left" delay={290}>
              <h2 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                <Tag className="h-3.5 w-3.5" />
                stack
              </h2>
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-lg border border-sky-aqua-500/25 bg-sky-aqua-500/10 px-3 py-1.5 font-mono text-[11px] text-sky-aqua-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal variant="fade-left" delay={340}>
            <div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-6">
              {liveUrl && liveUrl !== "#" && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-aqua-500 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-sky-aqua-400"
                >
                  view live
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {githubUrl && githubUrl !== "#" && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-200 transition-all hover:-translate-y-0.5 hover:border-sky-aqua-500/40 hover:text-sky-aqua-300"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  source
                </a>
              )}
            </div>
          </Reveal>

          <Reveal variant="fade-left" delay={380}>
            <dl className="grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-6">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">slug</dt>
                <dd className="mt-1 truncate font-mono text-xs text-slate-300">
                  /projects/{project.slug || slugify(project.title)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">links</dt>
                <dd className="mt-1 font-mono text-xs text-slate-300">
                  {[liveUrl && liveUrl !== "#" ? "live" : null, githubUrl && githubUrl !== "#" ? "repo" : null]
                    .filter(Boolean)
                    .join(" + ") || "—"}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                More <span className="gradient-text">Builds</span>
              </h2>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
              >
                view all
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((other, index) => (
              <Reveal key={other.id ?? index} delay={index * 90} className="h-full">
                <ProjectCard project={other} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
