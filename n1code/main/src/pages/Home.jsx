import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Cpu, Keyboard, Monitor as MonitorIcon } from "lucide-react";
import { useSiteData, asList } from "../hooks/useSiteData";
import { useInterestsLive } from "../hooks/useInterestsLive";
import { useCountUp, useInView, useTypewriter } from "../lib/animate";
import { mapManualAnime, sortEntries, sortGames } from "../lib/interests";
import { trackView } from "../lib/analytics";
import Reveal from "../components/Reveal";
import ScrollProgress from "../components/ScrollProgress";
import SocialBar from "../components/SocialBar";
import IntroOverlay from "../components/IntroOverlay";
import ContactForm from "../components/ContactForm";
import ProjectCard from "../components/ProjectCard";
import SkillCard from "../components/SkillCard";
import SetupCard from "../components/SetupCard";
import GameCard from "../components/GameCard";
import AnimeCard from "../components/AnimeCard";
import { HudChip } from "../components/HUD";

const FEATURED_PROJECT_COUNT = 3;
const STRIP_SIZE = 8;
const STACK_PREVIEW_CATEGORIES = ["Language", "Frontend", "Backend"];
const STACK_PREVIEW_PER_CATEGORY = 5;

/* ------------------------------------------------------------------ */
/* 01 — Hero                                                          */
/* ------------------------------------------------------------------ */

function Hero({ profile }) {
  const tagline = useTypewriter("// full-stack developer · game dev · builder", {
    speed: 34,
    start: true,
  });

  const glow = profile?.glowEnabled
    ? { filter: `drop-shadow(0 0 12px ${profile.accentColor})` }
    : undefined;
  const textGlow = profile?.glowEnabled
    ? { textShadow: `0 0 8px ${profile.accentColor}99` }
    : undefined;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center scroll-mt-24 px-4 pb-24 pt-28 text-center sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="animate-pulse-soft absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-aqua-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <Reveal variant="zoom" delay={60}>
          <div className="relative mb-8 h-32 w-32">
            <div className="animate-pulse absolute inset-0 scale-150 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-aqua-500 to-[#f43f5e] opacity-50 blur-2xl" />
            <div
              className="animate-spin-slow absolute -inset-3 rounded-full border border-dashed border-sky-aqua-500/30"
              aria-hidden="true"
            />
            <div
              className="animate-ring-pulse absolute -inset-3 rounded-full border border-sky-aqua-500/30"
              aria-hidden="true"
            />
            <div
              className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/20 bg-slate-900"
              style={glow}
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-4xl text-sky-aqua-400">
                  {String(profile?.username || "N").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={140}>
          <p className="kicker mb-3">player one // n1code</p>
        </Reveal>

        <Reveal variant="fade-up" delay={220}>
          <h1
            className="glitch font-display text-5xl font-bold leading-none tracking-tight text-slate-50 sm:text-7xl md:text-8xl"
            data-text={profile?.username || "N1CODE"}
            style={{ color: profile?.textColor || undefined, ...textGlow }}
          >
            {profile?.username || "N1CODE"}
          </h1>
        </Reveal>

        {profile?.bio && (
          <Reveal variant="fade-up" delay={300}>
            <p className="mt-5 max-w-xl text-lg font-light leading-relaxed text-slate-300 sm:text-xl">
              {profile.bio}
            </p>
          </Reveal>
        )}

        <Reveal variant="fade-up" delay={360}>
          <p className="mt-6 h-5 font-mono text-xs text-sky-aqua-400/80 sm:text-sm" aria-live="polite">
            {tagline.text}
            <span className="animate-blink">{tagline.cursor}</span>
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={430}>
          <SocialBar links={profile?.links} accentColor={profile?.accentColor} className="mt-8 justify-center" />
        </Reveal>

        <Reveal variant="fade-up" delay={500}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <HudChip tone="green">status: online</HudChip>
            <HudChip>level: developer</HudChip>
            <HudChip tone="pink">quest: open to work</HudChip>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Stats                                                         */
/* ------------------------------------------------------------------ */

function Stat({ value, suffix, label, start, delay }) {
  const count = useCountUp(value, { duration: 1500, start });

  return (
    <Reveal variant="zoom" delay={delay} className="h-full">
      <div className="relative flex h-full flex-col items-center gap-1 rounded-2xl border border-white/[0.07] bg-slate-950/40 px-4 py-6 backdrop-blur-sm transition-colors duration-300 hover:border-sky-aqua-500/35">
        <div className="hud-corner hud-corner--tl" />
        <div className="hud-corner hud-corner--br" />
        <span className="font-display text-4xl font-bold text-slate-50 sm:text-5xl">
          {count}
          {suffix && <span className="gradient-text">{suffix}</span>}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
    </Reveal>
  );
}

function Stats({ counts }) {
  const items = [
    { value: counts.projects, label: "projects shipped", suffix: "" },
    { value: counts.skills, label: "tools in the stack", suffix: "" },
    { value: counts.anime, label: "titles tracked", suffix: "" },
    { value: counts.games, label: "games in the library", suffix: "+" },
  ];

  // Same hook every other reveal uses, so the counters start exactly when the
  // band scrolls into view instead of relying on a bespoke observer.
  const [statsRef, started] = useInView({ threshold: 0.1 });

  return (
    <section
      id="stats"
      ref={statsRef}
      className="relative scroll-mt-24 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <Stat key={item.label} {...item} start={started} delay={index * 90} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Projects                                                      */
/* ------------------------------------------------------------------ */

function SectionHeader({ kicker, title, accent, accentPink = false, subtitle, align = "center" }) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      <Reveal>
        <p className="kicker">
          <span className="text-sky-aqua-500/70">[</span>
          {kicker}
          <span className="text-sky-aqua-500/70">]</span>
        </p>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl md:text-6xl">
          {title} <span className={accentPink ? "gradient-text--pink" : "gradient-text"}>{accent}</span>
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={120}>
          <p className="max-w-xl font-light text-slate-400">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

function LinkButton({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-xl border border-sky-aqua-500/30 bg-sky-aqua-500/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-sky-aqua-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-aqua-500/20"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function ProjectsSection({ projects }) {
  const featured = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <section id="projects" className="relative scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="sector 03 — built things"
          title="Featured"
          accent="Builds"
          subtitle="A few things I have actually shipped. The full list, with write-ups, lives on the projects page."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.id ?? index} delay={index * 110} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <LinkButton to="/projects">view all projects</LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Stack                                                         */
/* ------------------------------------------------------------------ */

function StackSection({ skills }) {
  const preview = STACK_PREVIEW_CATEGORIES.flatMap((category) =>
    skills.filter((skill) => skill.category === category).slice(0, STACK_PREVIEW_PER_CATEGORY)
  );

  if (preview.length === 0) return null;

  return (
    <section id="stack" className="relative scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="sector 04 — loadout"
          title="The"
          accent="Loadout"
          subtitle="Languages, frameworks and tools I reach for when something needs building."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {preview.map((skill, index) => (
            <Reveal key={skill.id ?? index} delay={(index % 5) * 70} className="h-full">
              <SkillCard skill={skill} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={180} className="mt-10 text-center">
          <LinkButton to="/skills">full stack breakdown</LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05/06 — Lounge strips                                              */
/* ------------------------------------------------------------------ */

function MarqueeRow({ items, render, reverse = false }) {
  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee-track" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {loop.map((item, index) => render(item, index))}
      </div>
    </div>
  );
}

function GamesStrip({ games }) {
  if (games.length === 0) return null;

  return (
    <section id="lounge" className="relative scroll-mt-24 py-20">
      <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="kicker mb-3">
            <span className="text-sky-aqua-500/70">[</span>sector 05 — arcade
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={60}>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              Currently in <span className="gradient-text">Rotation</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <LinkButton to="/games">open the arcade</LinkButton>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade-left" threshold={0.05}>
        <MarqueeRow
          items={games}
          render={(game, index) => (
            <div key={`${game.appid}-${index}`} className="w-64 shrink-0">
              <GameCard game={game} index={index} />
            </div>
          )}
        />
      </Reveal>
    </section>
  );
}

function AnimeStrip({ entries }) {
  if (entries.length === 0) return null;

  return (
    <section id="anime" className="relative scroll-mt-24 py-20">
      <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="kicker mb-3 text-right">
            <span className="text-sky-aqua-500/70">[</span>sector 06 — archive
            <span className="text-sky-aqua-500/70">]</span>
          </p>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={120}>
            <LinkButton to="/anime">browse the archive</LinkButton>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-right font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              On the <span className="gradient-text">Shelf</span>
            </h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade-right" threshold={0.05}>
        <MarqueeRow
          reverse
          items={entries}
          render={(entry, index) => (
            <div key={`${entry.id}-${index}`} className="w-36 shrink-0">
              <AnimeCard entry={entry} index={index} animate />
            </div>
          )}
        />
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 — Setup                                                         */
/* ------------------------------------------------------------------ */

function SetupSection({ setup }) {
  const gamingPc = setup.gamingPc || setup.gaming || [];
  const peripherals = setup.gamingPeripherals || [];
  const development = setup.development || [];

  if (!gamingPc.length && !peripherals.length && !development.length) return null;

  return (
    <section id="setup" className="relative scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="sector 07 — command center"
          title="The"
          accent="Rig"
          subtitle="The hardware I game on, work on and build things with."
        />

        <Reveal delay={140} className="mt-12">
          <SetupCard title="PC Specs" icon={<Cpu className="h-5 w-5" />} items={gamingPc} />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={90} className="h-full">
            <SetupCard title="Peripherals" icon={<MonitorIcon className="h-5 w-5" />} items={peripherals} />
          </Reveal>
          <Reveal delay={180} className="h-full">
            <SetupCard title="Development Setup" icon={<Keyboard className="h-5 w-5" />} items={development} />
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <LinkButton to="/setup">full spec sheet</LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 — Contact                                                       */
/* ------------------------------------------------------------------ */

function ContactSection({ profile }) {
  return (
    <section id="contact" className="relative scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          kicker="sector 08 — uplink"
          title="Open a"
          accent="Channel"
          accentPink
          subtitle="Project idea, question, or just want to say hi? Drop a message — it lands straight in my inbox."
        />

        <Reveal variant="blur" delay={180} className="mt-12">
          <ContactForm />
        </Reveal>

        {profile?.links?.length > 0 && (
          <Reveal delay={240} className="mt-12 text-center">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
              or find me elsewhere
            </p>
            <SocialBar
              links={profile.links}
              accentColor={profile.accentColor}
              compact
              className="justify-center"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { data, loading } = useSiteData();
  const live = useInterestsLive(data.interests);

  const [introDone, setIntroDone] = useState(false);

  const profile = data.profile;
  const projects = asList(data.projects);
  const skills = asList(data.skills);
  const setup = data.setup || {};

  const animeManual = data.interests?.anime || [];
  const gameManual = data.interests?.games || [];

  // Sorted in full so the counters report the real totals; the marquees only
  // take a slice of these.
  const mergedGames = sortGames({
    steamGames: live.steam,
    manualGames: gameManual,
    filter: "all",
    sort: "playtime",
  });

  const mergedAnime = sortEntries(
    [
      ...live.anilist.watchingAnime,
      ...live.anilist.watchedAnime,
      ...live.anilist.readingManga,
      ...live.anilist.readManga,
      ...mapManualAnime(animeManual, "Anime", "CURRENT"),
      ...mapManualAnime(animeManual, "Anime", "COMPLETED"),
      ...mapManualAnime(animeManual, "Manga", "CURRENT"),
      ...mapManualAnime(animeManual, "Manga", "COMPLETED"),
    ],
    { sort: "name" }
  );

  const counts = {
    projects: projects.length,
    skills: skills.length,
    anime: mergedAnime.length,
    games: mergedGames.length,
  };

  const stripGames = mergedGames.slice(0, STRIP_SIZE);
  const stripAnime = mergedAnime.slice(0, STRIP_SIZE);

  // One view per session, tracked once the intro has resolved.
  useEffect(() => {
    if (!introDone || sessionStorage.getItem("hasTrackedView")) return;
    sessionStorage.setItem("hasTrackedView", "true");
    trackView();
  }, [introDone]);

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-aqua-500/20 border-t-sky-aqua-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">loading profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!introDone && <IntroOverlay onDone={() => setIntroDone(true)} />}

      <ScrollProgress />

      <main>
        <Hero profile={profile} />
        <Stats counts={counts} />
        {projects.length > 0 && <ProjectsSection projects={projects} />}
        {skills.length > 0 && <StackSection skills={skills} />}
        {stripGames.length > 0 && <GamesStrip games={stripGames} />}
        {stripAnime.length > 0 && <AnimeStrip entries={stripAnime} />}
        <SetupSection setup={setup} />
        <ContactSection profile={profile} />

        <footer className="border-t border-white/5 px-4 py-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
            © {new Date().getFullYear()} n1code — built with react, firebase and too much coffee
          </p>
        </footer>
      </main>
    </div>
  );
}
