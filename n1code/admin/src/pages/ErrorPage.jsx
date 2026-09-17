import { Link, useLocation } from "react-router";
import { AlertOctagon, ArrowLeft, ShieldAlert, ServerCrash } from "lucide-react";

export default function ErrorPage({ code = 404, message }) {
  const getErrorContent = () => {
    switch (code) {
      case 403:
        return {
          title: "403",
          subtitle: "Clearance Required",
          text: message || "You do not have the required administrative privileges to access this sector.",
          icon: <ShieldAlert className="w-20 h-20 text-orange-400 animate-pulse" strokeWidth={1.5} />,
          glow: "bg-orange-500/10",
          border: "border-orange-500/20",
          shadow: "shadow-orange-900/20"
        };
      case 500:
      case 502:
      case 503:
        return {
          title: code.toString(),
          subtitle: "Core Panic",
          text: message || "A critical system failure occurred while processing your request in the admin portal.",
          icon: <ServerCrash className="w-20 h-20 text-red-500 animate-pulse" strokeWidth={1.5} />,
          glow: "bg-red-600/10",
          border: "border-red-500/20",
          shadow: "shadow-red-900/20"
        };
      case 404:
      default:
        return {
          title: "Sector 404",
          subtitle: "Invalid Memory Sector",
          text: message || "Unauthorized access or invalid memory sector. This area of the admin portal does not exist.",
          icon: <AlertOctagon className="w-20 h-20 text-red-400 animate-pulse" strokeWidth={1.5} />,
          glow: "bg-red-500/10",
          border: "border-red-500/20",
          shadow: "shadow-red-900/20"
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-4 relative overflow-hidden animate-fade-in">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[100px] rounded-full pointer-events-none ${content.glow}`} />
      
      <div className="max-w-xl w-full text-center z-10">
        <div className={`glassmorphism p-10 md:p-12 rounded-3xl border ${content.border} shadow-2xl ${content.shadow} relative overflow-hidden`}>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              {content.icon}
            </div>
          </div>
          
          <h1 className="text-5xl font-black font-display tracking-tight mb-4 text-slate-100">
            {content.title}
          </h1>
          <h2 className="text-xl font-bold font-display tracking-tight mb-4 text-slate-300">
            {content.subtitle}
          </h2>
          
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            {content.text}
          </p>
          
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition-all hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
