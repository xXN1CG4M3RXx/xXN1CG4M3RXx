import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'

function Dashboard() {
  const [count, setCount] = useState(0)
  const [firebaseStatus, setFirebaseStatus] = useState('checking')
  
  // Check if Firebase is configured
  const hasFirebaseConfig = !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  )

  useEffect(() => {
    if (hasFirebaseConfig) {
      setFirebaseStatus('configured')
    } else {
      setFirebaseStatus('missing-config')
    }
  }, [hasFirebaseConfig])

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Project Initialized Successfully
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Your repository is fully configured with Netlify, Firebase, and Tailwind CSS v4.
        </p>
      </div>

      {/* Tech Stack Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Tailwind CSS Card */}
        <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Active (v4)
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-sky-400 transition-colors">
            Tailwind CSS v4
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            A utility-first CSS framework built with a new, lightning-fast Rust engine and modern Vite integration.
          </p>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-mono">index.css → @import "tailwindcss"</span>
          </div>
        </div>

        {/* Firebase Card */}
        <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              firebaseStatus === 'configured' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {firebaseStatus === 'configured' ? 'Configured' : 'Missing Env'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-amber-400 transition-colors">
            Firebase SDK
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Modular JavaScript SDK initialized for authentication, cloud databases, and hosting integrations.
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">src/firebase.js</span>
            {firebaseStatus === 'missing-config' && (
              <span className="text-[10px] text-amber-400 animate-pulse">Fill out .env</span>
            )}
          </div>
        </div>

        {/* Netlify Card */}
        <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Ready
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-teal-400 transition-colors">
            Netlify
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Configuration ready for continuous deployment, build settings, routing, and serverless functions redirects.
          </p>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-mono">netlify.toml</span>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">Interactive Tailwind State Sandbox</h3>
          <p className="text-sm text-slate-400">Verify Tailwind hover states, focus outlines, and responsive designs below.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Clicks: {count}
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2.5 rounded-xl font-medium border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Framework & Tool Logos */}
      <div className="flex justify-center items-center gap-8 opacity-40 hover:opacity-60 transition-opacity">
        <img src={viteLogo} className="h-8 animate-pulse" alt="Vite Logo" />
        <span className="text-slate-600">|</span>
        <img src={reactLogo} className="h-8 animate-spin" style={{ animationDuration: '8s' }} alt="React Logo" />
      </div>
    </div>
  )
}

export default Dashboard
