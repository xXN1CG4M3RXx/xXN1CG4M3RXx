import { Link } from "react-router";
import { Home, Compass, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-sky-aqua-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full text-center z-10 animate-fade-in relative mt-16">
        <div className="glassmorphism p-12 md:p-16 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/50 relative overflow-hidden group">
          
          {/* Top highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-aqua-500 to-transparent opacity-50" />
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Ghost className="w-24 h-24 text-sky-aqua-400 animate-bounce" strokeWidth={1} />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-sky-aqua-500/20 blur-sm rounded-full animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black font-display tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-aqua-400 to-emerald-400">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 font-display">
            Lost in the Digital Void
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Looks like you've wandered off the map. This page might be hiding, deleted, or it's just a glitch in the matrix. 
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-sky-aqua-600 to-baltic-blue-600 hover:from-sky-aqua-500 hover:to-baltic-blue-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-sky-aqua-500/25 hover:-translate-y-0.5 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Return Home</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition-all hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
