import { createElement } from "react";
import { getIconComponent } from "../lib/IconRegistry";

const PROFICIENCY_STYLES = {
  Expert: { chip: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300", bar: "bg-emerald-400" },
  Advanced: { chip: "border-sky-400/40 bg-sky-400/10 text-sky-300", bar: "bg-sky-400" },
  Intermediate: { chip: "border-amber-400/40 bg-amber-400/10 text-amber-300", bar: "bg-amber-400" },
  Beginner: { chip: "border-slate-400/40 bg-slate-400/10 text-slate-300", bar: "bg-slate-400" },
};

const FALLBACK = { chip: "border-sky-aqua-500/40 bg-sky-aqua-500/10 text-sky-aqua-300", bar: "bg-sky-aqua-500" };

/** Rough 0-100 bar length per proficiency label. */
const LEVEL_WEIGHT = { Expert: 95, Advanced: 78, Intermediate: 55, Beginner: 30 };

export default function SkillCard({ skill, index = 0 }) {
  const style = PROFICIENCY_STYLES[skill.proficiency] || FALLBACK;
  const weight = LEVEL_WEIGHT[skill.proficiency] ?? 60;

  return (
    <div
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-slate-950/40 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-aqua-500/35"
      style={{ "--reveal-delay": `${(index % 12) * 45}ms` }}
    >
      <div className="absolute inset-0 bg-sky-aqua-500/0 transition-colors duration-500 group-hover:bg-sky-aqua-500/[0.06]" />
      <div className="hud-corner hud-corner--tl !opacity-0 transition-opacity duration-300 group-hover:!opacity-60" />
      <div className="hud-corner hud-corner--br !opacity-0 transition-opacity duration-300 group-hover:!opacity-60" />

      <span className="relative text-slate-300 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-aqua-400">
        {createElement(getIconComponent(skill.icon), { className: "h-8 w-8" })}
      </span>

      <h3 className="relative text-sm font-bold text-slate-200">{skill.name}</h3>

      <span
        className={`relative rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${style.chip}`}
      >
        {skill.proficiency}
      </span>

      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`reveal is-visible h-full rounded-full ${style.bar} transition-[width] duration-1000 ease-out`}
          style={{ width: `${weight}%`, transitionDelay: "250ms" }}
        />
      </div>
    </div>
  );
}
