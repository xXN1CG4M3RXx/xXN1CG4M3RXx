import { 
  FaSteam, FaGithub, FaDiscord, FaYoutube, FaTwitch, FaTiktok,
  FaTwitter, FaInstagram, FaLinkedin, FaReddit, FaSpotify, FaPatreon,
  FaPlaystation, FaXbox, FaGamepad, FaHeadset, FaReact, FaNpm,
  FaTerminal, FaDatabase, FaNodeJs, FaPython
} from 'react-icons/fa';
import { 
  Monitor, Code, Eye, Link, Mail, Globe, Smartphone, 
  Cpu, Layout, Star, Heart, Camera
} from "lucide-react";

export const ICONS = [
  { id: 'steam', name: 'Steam', component: FaSteam, category: 'Gaming' },
  { id: 'discord', name: 'Discord', component: FaDiscord, category: 'Gaming' },
  { id: 'twitch', name: 'Twitch', component: FaTwitch, category: 'Gaming' },
  { id: 'playstation', name: 'PlayStation', component: FaPlaystation, category: 'Gaming' },
  { id: 'xbox', name: 'Xbox', component: FaXbox, category: 'Gaming' },
  { id: 'gamepad', name: 'Gamepad', component: FaGamepad, category: 'Gaming' },
  { id: 'headset', name: 'Headset', component: FaHeadset, category: 'Gaming' },
  
  { id: 'github', name: 'GitHub', component: FaGithub, category: 'Social' },
  { id: 'youtube', name: 'YouTube', component: FaYoutube, category: 'Social' },
  { id: 'tiktok', name: 'TikTok', component: FaTiktok, category: 'Social' },
  { id: 'twitter', name: 'Twitter/X', component: FaTwitter, category: 'Social' },
  { id: 'instagram', name: 'Instagram', component: FaInstagram, category: 'Social' },
  { id: 'linkedin', name: 'LinkedIn', component: FaLinkedin, category: 'Social' },
  { id: 'reddit', name: 'Reddit', component: FaReddit, category: 'Social' },
  { id: 'spotify', name: 'Spotify', component: FaSpotify, category: 'Social' },
  { id: 'patreon', name: 'Patreon', component: FaPatreon, category: 'Social' },

  { id: 'react', name: 'React', component: FaReact, category: 'Tech' },
  { id: 'nodejs', name: 'Node.js', component: FaNodeJs, category: 'Tech' },
  { id: 'python', name: 'Python', component: FaPython, category: 'Tech' },
  { id: 'terminal', name: 'Terminal', component: FaTerminal, category: 'Tech' },
  { id: 'database', name: 'Database', component: FaDatabase, category: 'Tech' },
  { id: 'code', name: 'Code', component: Code, category: 'Tech' },
  { id: 'cpu', name: 'CPU', component: Cpu, category: 'Tech' },

  { id: 'monitor', name: 'Monitor', component: Monitor, category: 'General' },
  { id: 'smartphone', name: 'Mobile', component: Smartphone, category: 'General' },
  { id: 'globe', name: 'Globe', component: Globe, category: 'General' },
  { id: 'link', name: 'Link', component: Link, category: 'General' },
  { id: 'mail', name: 'Mail', component: Mail, category: 'General' },
  { id: 'eye', name: 'Eye', component: Eye, category: 'General' },
  { id: 'layout', name: 'Layout', component: Layout, category: 'General' },
  { id: 'star', name: 'Star', component: Star, category: 'General' },
  { id: 'heart', name: 'Heart', component: Heart, category: 'General' },
  { id: 'camera', name: 'Camera', component: Camera, category: 'General' },
];

export const getIconComponent = (id) => {
  const icon = ICONS.find(i => i.id === id);
  return icon ? icon.component : Globe; // default icon if not found
};
