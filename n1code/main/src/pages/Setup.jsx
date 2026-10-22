import { Link } from "react-router";
import { useSiteData } from "../hooks/useSiteData";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import SetupGrid from "../components/SetupGrid";

/** /setup — full command-center spec sheet. */
export default function Setup() {
  const { data, loading } = useSiteData();
  const setup = data.setup || {};

  const total =
    (setup.gamingPc || setup.gaming || []).length +
    (setup.gamingPeripherals || []).length +
    (setup.development || []).length;

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sky-aqua-300"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            overview
          </Link>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <p className="kicker">
            <span className="text-sky-aqua-500/70">[</span>sector 07 — command center
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            My <span className="gradient-text">Command Center</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            The hardware I use to game, work, and build things.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap gap-3">
            <HudChip>{total} entries</HudChip>
            <HudChip tone="green">rig: operational</HudChip>
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        {loading && total === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          </div>
        ) : total === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 py-16 text-center text-slate-500">
            No setup details added yet.
          </div>
        ) : (
          <SetupGrid setup={setup} />
        )}
      </div>

      <div className="mt-20 border-t border-white/5 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          {"// entries marked with a link open the manufacturer or store page"}
        </p>
      </div>
    </PageShell>
  );
}
