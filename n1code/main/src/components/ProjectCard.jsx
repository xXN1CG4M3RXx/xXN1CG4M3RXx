import { Link } from "react-router";
import { ExternalLink, FolderGit2, Code } from "lucide-react";
import { sanitizeUrl } from "../lib/sanitize";
import { slugify } from "../lib/animate";

export default function ProjectCard({ project, compact = false }) {
  const slug = project.slug || slugify(project.title);
  const tags = Array.isArray(project.tags) ? project.tags.slice(0, compact ? 3 : 5) : [];
  const githubUrl = sanitizeUrl(project.githubUrl);
  const liveUrl = sanitizeUrl(project.liveUrl);
  const hasImage = Boolean(project.imageUrl);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-950/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-aqua-500/35 hover:shadow-[0_18px_50px_-20px_rgba(0,204,255,0.4)]">
      {hasImage && (
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.06] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="hud-corner hud-corner--tl !opacity-0 transition-opacity duration-300 group-hover:!opacity-70" />
          <div className="hud-corner hud-corner--br !opacity-0 transition-opacity duration-300 group-hover:!opacity-70" />
        </div>
      )}

      <div className={`relative flex flex-1 flex-col ${hasImage ? "-mt-10 p-5" : "p-5"}`}>
        {!hasImage && (
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-500 transition-colors duration-300 group-hover:border-sky-aqua-500/40 group-hover:text-sky-aqua-400">
            <Code className="h-5 w-5" />
          </div>
        )}

        <h3 className="font-display text-lg font-bold tracking-wide text-slate-50 transition-colors duration-300 group-hover:text-sky-aqua-300">
          {project.title}
        </h3>

        <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-slate-400 line-clamp-3">
          {project.description || "No description yet."}
        </p>

        {tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-sky-aqua-500/20 bg-sky-aqua-500/10 px-2 py-0.5 font-mono text-[10px] text-sky-aqua-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
          {githubUrl && githubUrl !== "#" && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-sky-aqua-500/40 hover:text-sky-aqua-300"
            >
              <FolderGit2 className="h-4 w-4" />
            </a>
          )}

          {liveUrl && liveUrl !== "#" && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300 transition-colors hover:border-sky-aqua-500/40 hover:text-sky-aqua-300"
            >
              live
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <Link
            to={`/projects/${slug}`}
            className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-sky-aqua-300"
          >
            details →
          </Link>
        </div>
      </div>
    </article>
  );
}
