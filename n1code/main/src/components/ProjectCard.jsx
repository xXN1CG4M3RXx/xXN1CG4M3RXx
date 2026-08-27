import { ExternalLink as ExternalLinkIcon } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <div className="glassmorphism rounded-2xl overflow-hidden hover-scale group border border-sky-aqua-500/10 hover:border-sky-aqua-500/30 transition-all flex flex-col">
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
             <CodeIcon className="w-12 h-12 text-slate-700" />
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900/90 to-transparent"></div>
      </div>
      
      <div className="p-6 flex flex-col flex-1 relative z-10 -mt-10">
        <h3 className="text-xl font-bold font-display text-slate-100 mb-2">{project.title}</h3>
        <p className="text-slate-400 text-sm font-light leading-relaxed flex-1 mb-4">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags?.map(tag => (
            <span key={tag} className="text-xs font-mono bg-sky-aqua-500/10 text-sky-aqua-300 px-2.5 py-1 rounded-md border border-sky-aqua-500/20">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-auto">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-aqua-400 transition-colors ml-auto flex items-center gap-1 text-sm font-mono uppercase tracking-wider">
              <span>View Live</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  );
}
