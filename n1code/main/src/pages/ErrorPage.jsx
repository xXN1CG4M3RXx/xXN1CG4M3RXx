import { Link } from "react-router";
import { Home, Compass, Ghost, ShieldAlert, ServerCrash, AlertTriangle } from "lucide-react";

export default function ErrorPage({ code = 404, message }) {
  const getErrorContent = () => {
    switch (code) {
      case 403:
        return {
          title: "403",
          subtitle: "Access Denied",
          text: message || "You don't have the required clearance to view this sector. The digital guards have blocked your path.",
          icon: <ShieldAlert className="w-24 h-24 text-red-400 animate-pulse" strokeWidth={1} />,
          glow: "bg-red-500/10",
          gradient: "from-red-400 to-orange-400"
        };
      case 500:
      case 502:
      case 503:
        return {
          title: code.toString(),
          subtitle: "System Failure",
          text: message || "Our servers are experiencing severe technical difficulties. The engineering team has been notified.",
          icon: <ServerCrash className="w-24 h-24 text-amber-400 animate-pulse" strokeWidth={1} />,
          glow: "bg-amber-500/10",
          gradient: "from-amber-400 to-red-400"
        };
      case 404:
      default:
        return {
          title: "404",
          subtitle: "Lost in the Digital Void",
          text: message || "Looks like you've wandered off the map. This page might be hiding, deleted, or it's just a glitch in the matrix.",
          icon: <Ghost className="w-24 h-24 text-sky-aqua-400 animate-bounce" strokeWidth={1} />,
          glow: "bg-sky-aqua-500/10",
          gradient: "from-sky-aqua-400 to-emerald-400"
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] blur-[120px] rounded-full pointer-events-none ${content.glow}`} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-slate-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full text-center z-10 animate-fade-in relative mt-16">
        <div className="glassmorphism p-12 md:p-16 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/50 relative overflow-hidden group">
          
          {/* Top highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-50" />
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              {content.icon}
              <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 blur-sm rounded-full animate-pulse ${content.glow}`} />
            </div>
          </div>
          
          <h1 className={`text-7xl md:text-8xl font-black font-display tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r ${content.gradient}`}>
            {content.title}
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 font-display">
            {content.subtitle}
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            {content.text}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 group border border-slate-600"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Return Home</span>
            </Link>
            
            <button 
              onClick={() => window.history.length > 2 ? window.history.back() : window.location.href = '/'}
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
