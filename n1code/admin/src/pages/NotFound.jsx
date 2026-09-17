import { Link } from "react-router";
import { AlertOctagon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-4 relative overflow-hidden animate-fade-in">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-xl w-full text-center z-10">
        <div className="glassmorphism p-10 md:p-12 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-900/20 relative overflow-hidden">
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertOctagon className="w-20 h-20 text-red-400 animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-5xl font-black font-display tracking-tight mb-4 text-slate-100">
            Sector 404
          </h1>
          
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            Unauthorized access or invalid memory sector. This area of the admin portal does not exist or has been redacted.
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
