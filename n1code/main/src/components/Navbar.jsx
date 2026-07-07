import { NavLink } from "react-router";
import { User, Code, Monitor } from "lucide-react";

export default function Navbar() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="glassmorphism rounded-full px-6 py-3 flex items-center gap-8 border border-purple-500/20 shadow-lg shadow-purple-900/20">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          <User size={20} />
          <span className="text-[10px] uppercase font-mono tracking-widest">Links</span>
        </NavLink>
        
        <NavLink 
          to="/projects" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive ? 'text-pink-400' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          <Code size={20} />
          <span className="text-[10px] uppercase font-mono tracking-widest">Projects</span>
        </NavLink>

        <NavLink 
          to="/setup" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          <Monitor size={20} />
          <span className="text-[10px] uppercase font-mono tracking-widest">Setup</span>
        </NavLink>
      </nav>
    </div>
  );
}
