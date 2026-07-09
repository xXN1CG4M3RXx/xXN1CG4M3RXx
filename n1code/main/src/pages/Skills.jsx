import { useEffect, useState } from "react";
import { fetchCachedData } from "../lib/cache";
import { Code2 } from "lucide-react";
import { getIconComponent } from "../lib/IconRegistry";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await fetchCachedData("skills");
        if (data) {
          setSkills(data.list || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const getProficiencyColor = (level) => {
    switch (level) {
      case "Expert": return "bg-emerald-500 text-emerald-100";
      case "Advanced": return "bg-sky-500 text-sky-100";
      case "Intermediate": return "bg-amber-500 text-amber-100";
      case "Beginner": return "bg-slate-500 text-slate-100";
      default: return "bg-sky-aqua-500 text-sky-aqua-100";
    }
  };

  const categories = ["Language", "Frontend", "Backend", "Database", "Tool"];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400 mb-6">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          Tech <span className="gradient-text">Stack</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-lg font-light">
          The languages, frameworks, and tools I use to build digital experiences.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <div className="w-10 h-10 border-4 border-sky-aqua-500/20 border-t-sky-aqua-500 rounded-full animate-spin"></div>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No skills added yet.</div>
      ) : (
        <div className="space-y-16">
          {categories.map((category) => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold font-display border-b border-white/5 pb-2 inline-block">
                  {category}s
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categorySkills.map((skill) => {
                    const IconComp = getIconComponent(skill.icon);
                    return (
                      <div 
                        key={skill.id}
                        className="glassmorphism rounded-2xl p-6 border border-white/5 hover:border-sky-aqua-500/50 hover:bg-white/[0.03] transition-all hover-scale group flex flex-col items-center justify-center text-center relative overflow-hidden"
                      >
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 bg-sky-aqua-500/0 group-hover:bg-sky-aqua-500/5 transition-colors duration-500" />
                        
                        <div className="text-slate-300 group-hover:text-sky-aqua-400 transition-colors mb-3 group-hover:scale-110 duration-300 transform">
                          <IconComp className="w-10 h-10" />
                        </div>
                        <h3 className="font-bold text-slate-200 text-sm mb-2">{skill.name}</h3>
                        
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
