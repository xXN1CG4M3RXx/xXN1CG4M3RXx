import { Code2 } from "lucide-react";
import { CATEGORIES, FALLBACK_CATEGORY } from "../lib/skills";
import SkillCard from "./SkillCard";

/**
 * Skills page body. Groups the skill list into the fixed category order and
 * renders each group as its own grid.
 */
export default function SkillsGrid({ skills = [], className = "" }) {
  const groups = CATEGORIES.map((category) => ({
    category,
    items: skills.filter((skill) => (skill.category || FALLBACK_CATEGORY) === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className={`space-y-14 ${className}`.trim()}>
      {groups.map((group, groupIndex) => (
        <section key={group.category} className="scroll-mt-24" id={`stack-${group.category.toLowerCase()}s`}>
          <header className="mb-6 flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-aqua-500/25 bg-sky-aqua-500/10 text-sky-aqua-400">
              <Code2 className="h-4 w-4" />
            </span>
            <h2
              className="font-display text-2xl font-bold tracking-wide text-slate-50"
              aria-label={`${group.category}s`}
            >
              {group.category}
              <span className="text-sky-aqua-500">s</span>
            </h2>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
              {group.items.length} {group.items.length === 1 ? "skill" : "skills"}
            </span>
          </header>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {group.items.map((skill, index) => (
              <SkillCard key={skill.id ?? index} skill={skill} index={index + groupIndex} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

