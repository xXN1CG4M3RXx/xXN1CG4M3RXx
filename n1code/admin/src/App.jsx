import { Routes, Route, Link, NavLink } from 'react-router'
import Dashboard from './pages/Dashboard'
import FirebasePlayground from './pages/FirebasePlayground'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="font-bold text-white text-lg">A</span>
            </Link>
            <Link to="/" className="font-semibold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Admin Portal
            </Link>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `transition-colors hover:text-slate-200 ${isActive ? 'text-purple-400 font-semibold' : 'text-slate-400'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/firebase" 
              className={({ isActive }) => 
                `transition-colors hover:text-slate-200 ${isActive ? 'text-purple-400 font-semibold' : 'text-slate-400'}`
              }
            >
              Firebase
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `transition-colors hover:text-slate-200 ${isActive ? 'text-purple-400 font-semibold' : 'text-slate-400'}`
              }
            >
              Settings
            </NavLink>
          </nav>

          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ready to deploy
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/firebase" element={<FirebasePlayground />} />
          <Route path="/settings" element={<Settings />} />
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-900 py-8 bg-slate-950/40 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 Admin Portal. Built with Vite, React, Firebase, Netlify, Tailwind CSS, and React Router.</p>
      </footer>
    </div>
  )
}

export default App
