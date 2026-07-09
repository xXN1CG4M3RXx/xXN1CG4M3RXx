import { Routes, Route, Link, NavLink, Navigate } from 'react-router'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './lib/firebase'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import LinktreeManager from './components/LinktreeManager'
import ProjectManager from './components/ProjectManager'
import SetupManager from './components/SetupManager'
import InboxManager from './components/InboxManager'
import SeoManager from './components/SeoManager'

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-aqua-500 selection:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-aqua-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-baltic-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {user && (
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Link to="/" className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-aqua-500 to-baltic-blue-600 flex items-center justify-center shadow-lg shadow-sky-aqua-500/30">
                  <span className="font-bold text-white text-lg">A</span>
                </Link>
                <Link to="/" className="font-semibold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Admin Portal
                </Link>
              </div>
              <button onClick={() => signOut(auth)} className="sm:hidden text-slate-400 hover:text-red-400 transition-colors text-sm">Sign Out</button>
            </div>
            
            <nav className="flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
              <NavLink to="/" end className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>Dashboard</NavLink>
              <NavLink to="/linktree" className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>Linktree</NavLink>
              <NavLink to="/projects" className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>Projects</NavLink>
              <NavLink to="/setup" className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>Setup</NavLink>
              <NavLink to="/seo" className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>SEO</NavLink>
              <NavLink to="/inbox" className={({ isActive }) => `transition-colors hover:text-slate-200 whitespace-nowrap ${isActive ? 'text-sky-aqua-400 font-semibold' : 'text-slate-400'}`}>Inbox</NavLink>
            </nav>

            <div className="hidden sm:flex items-center gap-4 text-sm">
               <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-400 transition-colors">Sign Out</button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full z-10">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/linktree" element={<ProtectedRoute user={user}><LinktreeManager /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute user={user}><ProjectManager /></ProtectedRoute>} />
          <Route path="/setup" element={<ProtectedRoute user={user}><SetupManager /></ProtectedRoute>} />
          <Route path="/seo" element={<ProtectedRoute user={user}><SeoManager /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute user={user}><InboxManager /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
