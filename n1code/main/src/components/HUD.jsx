/** Corner brackets that frame a panel like a targeting reticle. */
export function HudCorners({ className = "" }) {
  return (
    <span aria-hidden="true" className={`absolute inset-0 pointer-events-none ${className}`.trim()}>
      <span className="hud-corner hud-corner--tl" />
      <span className="hud-corner hud-corner--tr" />
      <span className="hud-corner hud-corner--bl" />
      <span className="hud-corner hud-corner--br" />
    </span>
  );
}

/** Tiny status chip, e.g. `ONLINE`, `v4.2`, `SECTOR 03`. */
export function HudChip({ children, tone = "default", className = "" }) {
  const tones = {
    default: "",
    pink: "border-[#f43f5e]/35 bg-[#f43f5e]/10 text-[#fda4af]",
    green: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/35 bg-amber-400/10 text-amber-300",
  };

  return (
    <span className={`hud-chip ${tones[tone] || tones.default} ${className}`.trim()}>{children}</span>
  );
}

/** Section heading block: kicker, gradient title, optional subtitle. */
export function SectionHeading({ kicker, title, accent, subtitle, align = "center" }) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {kicker && (
        <p className="kicker">
          <span className="text-sky-aqua-500/70">[</span>
          {kicker}
          <span className="text-sky-aqua-500/70">]</span>
        </p>
      )}
      <h2 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl md:text-6xl">
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {subtitle && <p className="max-w-2xl text-base font-light text-slate-400 sm:text-lg">{subtitle}</p>}
    </div>
  );
}

/**
 * Standard page shell for the detail routes: HUD framing, top progress bar and
 * a back link. Keeps every sub-page visually in the same world.
 */
export function PageShell({ children, className = "" }) {
  return (
    <div className={`relative mx-auto w-full max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 ${className}`.trim()}>
      <HudCorners />
      {children}
    </div>
  );
}
