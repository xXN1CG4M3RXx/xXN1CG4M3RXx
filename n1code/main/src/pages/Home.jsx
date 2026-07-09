import { useEffect, useState } from "react";
import { Link } from "react-router";
import { db } from "../lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { fetchCachedData } from "../lib/cache";
import { getIconComponent } from "../lib/IconRegistry";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch from Firebase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const handleData = (data) => {
          if (data) {
            if (!data.pageBackground) {
              data.pageBackground = { type: "color", color1: "#0b0f19", color2: "#000000", imageUrl: "" };
            }
            setProfile(data);
          } else {
            setProfile(null);
          }
        };
        
        const data = await fetchCachedData("profile", handleData);
        handleData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLinkClick = async (linkId) => {
    try {
      const analyticsRef = doc(db, "settings", "analytics");
      await updateDoc(analyticsRef, {
        [`clicks.${linkId}`]: increment(1)
      });
    } catch (error) {
      console.error("Failed to track click:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0b0f19]">
        <div className="w-16 h-16 border-4 border-sky-aqua-500/20 border-t-sky-aqua-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

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
    const IconComp = getIconComponent(iconName);
    return <IconComp className="w-8 h-8" />;
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
              <Link key={link.id} to={link.url} onClick={() => handleLinkClick(link.id)} className="w-full focus:outline-none rounded-2xl">
                {inner}
              </Link>
            ) : (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(link.id)} className="w-full focus:outline-none rounded-2xl">
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
