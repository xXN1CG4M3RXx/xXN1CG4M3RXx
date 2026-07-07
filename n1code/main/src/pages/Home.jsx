import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Monitor, Code, Eye } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState({
    username: "xX_N1C_G4M3R_Xx",
    bio: "Gamer 🎮 | Software Engineer 💻 | Anime Fan 🌸",
    avatarUrl: "https://i.imgur.com/Y171yL1.png", // Using a placeholder that looks somewhat like the image
    accentColor: "#00ccff",
    textColor: "#00ccff",
    glowEnabled: true,
    activity: {
      status: "Playing Code",
      details: "Idling",
      icon: "https://i.imgur.com/Y171yL1.png"
    },
    background: {
      type: "gradient", // solid, gradient, image
      color1: "#000036",
      color2: "#000016",
      imageUrl: ""
    },
    links: [
      { id: "1", title: "Steam", url: "https://steamcommunity.com", icon: "steam", description: "Add me on Steam to play games together!" },
      { id: "2", title: "GitHub", url: "https://github.com", icon: "github", description: "Check out my latest open source projects" },
      { id: "3", title: "Discord", url: "https://discord.com", icon: "discord", description: "Join my community Discord server" },
      { id: "4", title: "YouTube", url: "https://youtube.com", icon: "youtube", description: "Watch my newest videos and streams" }
    ],
    views: 44
  });

  // Mocking Firebase fetch for now
  useEffect(() => {
    // In the future: fetch from Firebase `profileSettings` document
  }, []);

  const getBackgroundStyle = () => {
    if (profile.background.type === 'image') {
      return { backgroundImage: `url(${profile.background.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else if (profile.background.type === 'gradient') {
      return { background: `linear-gradient(135deg, ${profile.background.color1}, ${profile.background.color2})` };
    }
    return { backgroundColor: profile.background.color1 };
  };

  const glowStyle = profile.glowEnabled ? { filter: `drop-shadow(0 0 10px ${profile.accentColor})` } : {};
  const textGlowStyle = profile.glowEnabled ? { textShadow: `0 0 10px ${profile.accentColor}, 0 0 20px ${profile.accentColor}` } : {};

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'github': return <GithubIcon />;
      case 'youtube': return <YoutubeIcon />;
      case 'discord': return <DiscordIcon />;
      case 'twitch': return <TwitchIcon />;
      case 'steam': return <SteamIcon />;
      case 'tiktok': return <TiktokIcon />;
      case 'monitor': return <Monitor className="w-8 h-8" />;
      case 'code': return <Code className="w-8 h-8" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 w-full min-h-screen relative" style={getBackgroundStyle()}>
      
      {/* Main Glassmorphism Card */}
      <div className="glassmorphism rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl mx-auto flex flex-col items-center relative overflow-hidden bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-2xl">
        
        {/* Profile Image with splash effect behind it */}
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-tr from-green-400 via-blue-500 to-pink-500 scale-150 animate-pulse"></div>
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 relative z-10" style={glowStyle}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">N</div>
            )}
          </div>
        </div>
        
        {/* Username */}
        <h1 
          className="text-4xl md:text-5xl font-bold font-display tracking-wider mb-3 transition-all"
          style={{ color: profile.textColor, ...textGlowStyle }}
        >
          {profile.username}
        </h1>
        
        {/* Bio */}
        <p className="text-lg font-medium tracking-wide mb-8" style={{ color: profile.textColor }}>
          {profile.bio}
        </p>

        {/* Discord Activity Card */}
        <div className="w-full max-w-md bg-slate-900/60 rounded-3xl p-4 flex items-center gap-4 border border-white/5 shadow-inner mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
             {profile.activity.icon ? (
               <img src={profile.activity.icon} alt="Activity" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-slate-800"></div>
             )}
             <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-200 font-bold truncate text-lg" style={{ color: profile.textColor }}>{profile.username.toLowerCase()}</h3>
            </div>
            <p className="text-sm font-bold truncate" style={{ color: profile.textColor }}>{profile.activity.status}</p>
            <p className="text-sm opacity-70 truncate" style={{ color: profile.textColor }}>{profile.activity.details}</p>
          </div>

          <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center border border-slate-700/50 flex-shrink-0">
            <Code className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* Social Links Stack */}
        <div className="flex flex-col gap-4 w-full px-4 mt-2">
          {profile.links.map((link) => {
            const inner = (
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-all w-full group shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center" style={{ color: profile.accentColor, ...glowStyle }}>
                  {getIcon(link.icon)}
                </div>
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <span className="font-bold text-lg truncate" style={{ color: profile.textColor, ...textGlowStyle }}>{link.title}</span>
                  {link.description && <span className="text-sm opacity-70 truncate mt-0.5" style={{ color: profile.textColor }}>{link.description}</span>}
                </div>
              </div>
            );
            return link.internal ? (
              <Link key={link.id} to={link.url} className="w-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-2xl">
                {inner}
              </Link>
            ) : (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-2xl">
                {inner}
              </a>
            );
          })}
        </div>

        {/* View Counter */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2" style={{ color: profile.accentColor }}>
          <Eye className="w-5 h-5" />
          <span className="font-bold">{profile.views}</span>
        </div>
      </div>
    </div>
  );
}

// Simple SVGs for Social Icons
function GithubIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
  );
}

function DiscordIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
  );
}

function TwitchIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
  );
}

function SteamIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11.954 0A12.008 12.008 0 000 12.007c0 3.238 1.282 6.183 3.367 8.356l3.524-5.068a3.255 3.255 0 01-.157-1.004c0-1.802 1.464-3.265 3.265-3.265 1.8 0 3.265 1.463 3.265 3.265 0 1.802-1.464 3.265-3.265 3.265-.183 0-.361-.016-.534-.045L7.75 21.036c1.233.626 2.628.971 4.103.971 4.887 0 8.868-3.98 8.868-8.868C20.72 8.252 16.74 4.27 11.954 0zm-1.854 11.455v-.004a.972.972 0 01-.973-.973c0-.537.436-.973.973-.973s.973.436.973.973a.972.972 0 01-.973.973zm2.595 1.306l-1.921 2.766a3.264 3.264 0 00-2.484-.442l1.91-2.75a3.267 3.267 0 002.495.426z"/></svg>
  );
}

function TiktokIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95v7.4c-.01 2.58-1.55 5-3.9 6.07-2.35 1.07-5.2.82-7.27-.66-2.07-1.48-3.14-4.04-2.65-6.5.49-2.46 2.45-4.43 4.93-4.9 2.48-.47 5.1.28 6.9 2v-4.14c-1.58-.33-3.23-.33-4.81.01-3.66.79-6.66 3.79-7.46 7.45-.8 3.66.52 7.55 3.37 10.05 2.85 2.5 6.94 3.22 10.42 1.83 3.48-1.39 5.86-4.7 5.92-8.43v-18.23h-9.53z"/></svg>
  );
}
