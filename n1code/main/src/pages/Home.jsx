import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Github, Twitter, Youtube, Monitor, Code } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState({
    username: "xXN1CG4M3RXx",
    bio: "Software Engineer & Gamer",
    avatarUrl: "",
    accentColor: "#a78bfa", // default purple
    links: [
      { id: "1", title: "GitHub", url: "https://github.com/xXN1CG4M3RXx", icon: "github" },
      { id: "2", title: "Projects Showcase", url: "/projects", internal: true, icon: "code" },
      { id: "3", title: "My Setup", url: "/setup", internal: true, icon: "monitor" }
    ]
  });

  // Mocking Firebase fetch for now
  useEffect(() => {
    // In the future: fetch from Firebase `profileSettings` document
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'github': return <Github className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'monitor': return <Monitor className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 mb-24 w-full max-w-xl mx-auto">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div 
          className="w-24 h-24 rounded-full mb-4 border-2 p-1 relative group hover:scale-105 transition-transform duration-300"
          style={{ borderColor: profile.accentColor }}
        >
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-display font-bold text-slate-400">N</span>
            )}
          </div>
          {/* Subtle glow effect behind avatar */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity"
            style={{ backgroundColor: profile.accentColor }}
          ></div>
        </div>
        
        <h1 className="text-2xl font-bold font-display tracking-wider text-slate-100">
          @{profile.username}
        </h1>
        <p className="text-slate-400 font-mono text-sm mt-2">{profile.bio}</p>
      </div>

      {/* Links List */}
      <div className="flex flex-col gap-4 w-full">
        {profile.links.map((link) => {
          const content = (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {getIcon(link.icon)}
                <span className="font-medium tracking-wide">{link.title}</span>
              </div>
            </div>
          );

          const className = "glassmorphism w-full p-4 rounded-xl flex items-center hover-scale border-l-4 group transition-all relative overflow-hidden";
          const style = { borderLeftColor: profile.accentColor };

          // Subtle gradient hover effect via pseudo-element
          const HoverGlow = () => (
             <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${profile.accentColor}, transparent)` }}
              />
          );

          return link.internal ? (
            <Link key={link.id} to={link.url} className={className} style={style}>
              {content}
              <HoverGlow />
            </Link>
          ) : (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
              {content}
              <HoverGlow />
            </a>
          );
        })}
      </div>

    </div>
  );
}
