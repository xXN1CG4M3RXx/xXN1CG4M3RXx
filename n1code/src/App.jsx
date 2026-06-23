export default function App() {
  return (
    <div className="flex flex-col min-h-screen justify-between py-12">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand / Terminal Header */}
        <div className="glassmorphism rounded-2xl p-6 mb-12 relative overflow-hidden border border-purple-500/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500"></div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-500 ml-2">nico@n1code:~</span>
            </div>
            <div className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
              SYSTEM: ACTIVE
            </div>
          </div>

          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p className="text-slate-500">&gt; fetch profile --user nico</p>
            <p><span className="text-pink-400">username:</span> xXN1CG4M3RXx</p>
            <p><span className="text-purple-400">role:</span> Software Engineer</p>
            <p><span className="text-amber-400">hobbies:</span> Gaming (RPG & Competitive) | Anime (Seasonal & Classics)</p>
            <p className="text-slate-500">&gt; load current_project --status</p>
            <div className="flex items-center gap-4">
              <span>status:</span>
              <div className="flex-1 max-w-xs bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse" style={{ width: '85%' }}></div>
              </div>
              <span className="text-pink-400">85% Compiled</span>
            </div>
          </div>
        </div>

        {/* Main Focus: Title & Form */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 font-display">
            Something <span className="gradient-text">Legendary</span> is Loading
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 font-light leading-relaxed mb-10">
            I'm currently crafting a new digital playground. Stay tuned!
          </p>
        </div>

        {/* Profile Specs cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Development Specs */}
          <div className="glassmorphism rounded-2xl p-8 hover-scale">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 font-display">Development Specs</h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {['C#', 'Python', 'React', 'Java', 'Spring Boot', 'MySQL', 'HTML & CSS', 'JavaScript', 'Raspberry Pi'].map((tech) => (
                <span key={tech} className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-1.5 rounded-xl text-sm font-mono tracking-wide transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Gaming & Anime Specs */}
          <div className="glassmorphism rounded-2xl p-8 hover-scale">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 font-display">Gamer & Otaku Mode</h2>
            </div>

            <div className="space-y-3 font-light text-slate-400 text-sm leading-relaxed">
              <p>
                <strong className="text-slate-200">Gaming:</strong> Spending my free time playing narrative-rich storytelling RPGs or jumping into competitive lobbies with friends.
              </p>
              <p>
                <strong className="text-slate-200">Anime & Manga:</strong> Big fan of seasonal drops as well as the timeless classics. Always tracking the latest updates!
              </p>
            </div>
          </div>
        </div>

        {/* Social Flare Section */}
        <div className="text-center pt-8 border-t border-slate-900">
          <h3 className="text-base text-slate-500 uppercase tracking-widest font-mono mb-6">Connect with me</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://guns.lol/NicoJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 font-mono text-sm transition-colors border border-slate-800/80 px-4 py-2 rounded-xl bg-slate-950/20 hover:border-purple-500/30"
            >
              guns.lol/NicoJ
            </a>
            <a
              href="https://github.com/xXN1CG4M3RXx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 font-mono text-sm transition-colors border border-slate-800/80 px-4 py-2 rounded-xl bg-slate-950/20 hover:border-pink-500/30"
            >
              GitHub Profile
            </a>
            <a
              href="https://www.buymeacoffee.com/nicoj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 font-mono text-sm transition-colors border border-slate-800/80 px-4 py-2 rounded-xl bg-slate-950/20 hover:border-amber-500/30"
            >
              Buy Me A Coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
