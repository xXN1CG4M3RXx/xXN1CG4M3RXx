import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Monitor, Code, Eye } from "lucide-react";
import { FaSteam, FaGithub, FaDiscord, FaYoutube, FaTwitch, FaTiktok } from 'react-icons/fa';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
  const [profile, setProfile] = useState({
    username: "xX_N1C_G4M3R_Xx",
    bio: "Gamer 🎮 | Software Engineer 💻 | Anime Fan 🌸",
    avatarUrl: "https://i.imgur.com/Y171yL1.png", // Using a placeholder that looks somewhat like the image
    accentColor: "#00ccff",
    textColor: "#00ccff",
    glowEnabled: true,
    background: {
      type: "gradient", // solid, gradient, image
      color1: "#000036",
      color2: "#000016",
      imageUrl: ""
    },
    pageBackground: {
      type: "color",
      color1: "#0b0f19",
      color2: "#000000",
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

  // Fetch from Firebase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "settings", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.pageBackground) {
            data.pageBackground = { type: "color", color1: "#0b0f19", color2: "#000000", imageUrl: "" };
          }
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const getCardBackgroundStyle = () => {
    if (profile.background.type === 'image') {
      return { backgroundImage: `url(${profile.background.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else if (profile.background.type === 'gradient') {
      return { background: `linear-gradient(135deg, ${profile.background.color1}, ${profile.background.color2})` };
    }
    return { backgroundColor: profile.background.color1 };
  };

  const getPageBackgroundStyle = () => {
    // Check if pageBackground exists (to prevent errors if migrating old data)
    if (!profile.pageBackground) return {}; 
    
    if (profile.pageBackground.type === 'image') {
      return { backgroundImage: `url(${profile.pageBackground.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else if (profile.pageBackground.type === 'gradient') {
      return { background: `linear-gradient(135deg, ${profile.pageBackground.color1}, ${profile.pageBackground.color2})` };
    }
    return { backgroundColor: profile.pageBackground.color1, background: 'none' };
  };

  const glowStyle = profile.glowEnabled ? { filter: `drop-shadow(0 0 10px ${profile.accentColor})` } : {};
  const textGlowStyle = profile.glowEnabled ? { textShadow: `0 0 6px ${profile.accentColor}99` } : {};

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'github': return <FaGithub className="w-8 h-8" />;
      case 'youtube': return <FaYoutube className="w-8 h-8" />;
      case 'discord': return <FaDiscord className="w-8 h-8" />;
      case 'twitch': return <FaTwitch className="w-8 h-8" />;
      case 'steam': return <FaSteam className="w-8 h-8" />;
      case 'tiktok': return <FaTiktok className="w-8 h-8" />;
      case 'monitor': return <Monitor className="w-8 h-8" />;
      case 'code': return <Code className="w-8 h-8" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 w-full min-h-screen relative" style={getPageBackgroundStyle()}>
      
      {/* Main Glassmorphism Card */}
      <div 
        className="glassmorphism rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl mx-auto flex flex-col items-center relative overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Independent Background Layer for Opacity */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            ...getCardBackgroundStyle(),
            opacity: (profile.background.opacity ?? 100) / 100
          }}
        />
        
        {/* Content Layer */}
        <div className="relative z-10 w-full flex flex-col items-center">
        
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

        </div>
      </div>
    </div>
  );
}
