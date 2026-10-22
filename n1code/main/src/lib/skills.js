/** Fixed category order for the skill stack. */
export const CATEGORIES = ["Language", "Frontend", "Backend", "Database", "Tool"];

export const FALLBACK_CATEGORY = "Tool";

/** Colour tokens for each proficiency label. */
export function getProficiencyColor(level) {
  switch (level) {
    case "Expert":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
    case "Advanced":
      return "border-sky-400/40 bg-sky-400/10 text-sky-300";
    case "Intermediate":
      return "border-amber-400/40 bg-amber-400/10 text-amber-300";
    case "Beginner":
      return "border-slate-400/40 bg-slate-400/10 text-slate-300";
    default:
      return "border-sky-aqua-500/40 bg-sky-aqua-500/10 text-sky-aqua-300";
  }
}
