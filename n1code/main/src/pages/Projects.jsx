import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Code } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "n1code Platform",
      description: "My personal digital playground and portfolio built with React, TailwindCSS, and Firebase.",
      tags: ["React", "Firebase", "TailwindCSS v4"],
      githubUrl: "https://github.com/xXN1CG4M3RXx/n1code",
      liveUrl: "https://n1code.dev"
    },
    {
      id: "2",
      title: "RPG Inventory Manager",
      description: "A comprehensive tool to manage stats, items, and quests for tabletop RPGs.",
      tags: ["C#", "Unity", "SQLite"],
      githubUrl: "https://github.com/xXN1CG4M3RXx/rpg-manager"
    }
  ]);

  // Mocking Firebase fetch
  useEffect(() => {
    // In the future: fetch from Firebase `projects` collection
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 mb-6">
          <Code className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          Project <span className="gradient-text">Showcase</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-lg font-light">
          A collection of things I've built, ranging from web applications to gaming tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
