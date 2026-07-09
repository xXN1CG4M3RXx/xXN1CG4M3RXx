import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Code } from "lucide-react";
import { db } from "../lib/firebase";
import { fetchCachedData } from "../lib/cache";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchCachedData("projects");
        if (data) {
          setProjects(data.list || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400 mb-6">
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
