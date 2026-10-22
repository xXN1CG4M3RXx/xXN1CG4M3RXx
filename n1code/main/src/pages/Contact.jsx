import { Link } from "react-router";
import { PageShell, HudChip } from "../components/HUD";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";
import SocialBar from "../components/SocialBar";
import { useSiteData } from "../hooks/useSiteData";

/** /contact — standalone channel, same form as the overview section. */
export default function Contact() {
  const { data } = useSiteData();
  const profile = data.profile;

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
            <span className="text-sky-aqua-500/70">[</span>sector 08 — uplink
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Let's <span className="gradient-text">Connect</span>
          </h1>
        </Reveal>

        <Reveal variant="fade-up" delay={180}>
          <p className="max-w-2xl text-lg font-light text-slate-400">
            Have a question, project idea, or just want to say hi? Drop a message below and I'll get back to you.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <div className="flex flex-wrap gap-3">
            <HudChip tone="green">inbox: open</HudChip>
            <HudChip tone="amber">replies: ~24h</HudChip>
          </div>
        </Reveal>
      </div>

      <Reveal variant="blur" delay={200} className="mt-12">
        <ContactForm />
      </Reveal>

      {profile?.links?.length > 0 && (
        <Reveal delay={260} className="mt-14">
          <h2 className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
            or find me elsewhere
          </h2>
          <SocialBar links={profile.links} accentColor={profile.accentColor} className="justify-center" />
        </Reveal>
      )}
    </PageShell>
  );
}
