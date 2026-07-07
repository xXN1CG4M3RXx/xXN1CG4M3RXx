import { Link } from 'react-router';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-slate-100 mb-2">Welcome Back</h1>
        <p className="text-slate-400">Select a module to manage your portfolio data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/linktree" className="glassmorphism rounded-2xl p-6 hover-scale border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/20 transition-colors">
             <span className="text-2xl font-bold font-display">L</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Linktree</h2>
          <p className="text-slate-400 text-sm">Manage profile details, colors, and custom links.</p>
        </Link>

        <Link to="/projects" className="glassmorphism rounded-2xl p-6 hover-scale border border-pink-500/20 hover:border-pink-500/40 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 group-hover:bg-pink-500/20 transition-colors">
             <span className="text-2xl font-bold font-display">P</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Projects</h2>
          <p className="text-slate-400 text-sm">Add, edit, or remove showcase projects.</p>
        </Link>

        <Link to="/setup" className="glassmorphism rounded-2xl p-6 hover-scale border border-amber-500/20 hover:border-amber-500/40 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition-colors">
             <span className="text-2xl font-bold font-display">S</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Setup</h2>
          <p className="text-slate-400 text-sm">Manage hardware items in your setup specs.</p>
        </Link>
      </div>
    </div>
  );
}
