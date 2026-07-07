import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LinktreeManager() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // This state mirrors the expected structure in main's Home.jsx
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
    accentColor: "var(--color-sky-aqua-500)",
    textColor: "var(--color-sky-aqua-500)",
    glowEnabled: true,
    activity: {
      status: "",
      details: "",
      icon: "", 
      badge: ""
    },
    background: {
      type: "gradient",
      color1: "var(--color-deep-navy-900)",
      color2: "var(--color-deep-navy-200)",
      imageUrl: ""
    },
    links: [],
    views: 0
  });

  const availableColors = [
    { name: "Deep Navy", value: "var(--color-deep-navy-500)" },
    { name: "Regal Navy", value: "var(--color-regal-navy-500)" },
    { name: "Baltic Blue", value: "var(--color-baltic-blue-500)" },
    { name: "Blue Green", value: "var(--color-blue-green-500)" },
    { name: "Sky Aqua", value: "var(--color-sky-aqua-500)" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
  ];

  const iconOptions = ["steam", "github", "discord", "youtube", "twitch", "tiktok", "monitor", "code"];

  const handleSave = async () => {
    setLoading(true);
    // Simulate save for now
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const addLink = () => {
    setProfile(p => ({
      ...p,
      links: [...p.links, { id: Date.now().toString(), title: "New Link", url: "", icon: "github" }]
    }));
  };

  const removeLink = (id) => {
    setProfile(p => ({
      ...p,
      links: p.links.filter(l => l.id !== id)
    }));
  };

  const updateLink = (id, field, value) => {
    setProfile(p => ({
      ...p,
      links: p.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100 mb-2">Linktree Settings</h1>
          <p className="text-slate-400">Customize your public linktree page appearance and data.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl">
          Profile settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Basic Profile */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Basic Info</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
              <input 
                type="text" 
                value={profile.username}
                onChange={e => setProfile({...profile, username: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
              <input 
                type="text" 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Avatar Image URL</label>
              <input 
                type="text" 
                value={profile.avatarUrl}
                onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Theming & Appearance */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Appearance & Glow</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Accent/Glow Color</label>
              <select 
                value={profile.accentColor}
                onChange={e => setProfile({...profile, accentColor: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {availableColors.map(c => <option key={c.name} value={c.value}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Text Color</label>
              <select 
                value={profile.textColor}
                onChange={e => setProfile({...profile, textColor: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {availableColors.map(c => <option key={c.name} value={c.value}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="glowToggle"
                checked={profile.glowEnabled}
                onChange={e => setProfile({...profile, glowEnabled: e.target.checked})}
                className="w-5 h-5 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900/50"
              />
              <label htmlFor="glowToggle" className="text-sm font-medium text-slate-200">Enable Neon Glow Effects (Text, Avatar, Icons)</label>
            </div>
          </div>
        </div>

        {/* Background Settings */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Background</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Background Type</label>
              <select 
                value={profile.background.type}
                onChange={e => setProfile({...profile, background: {...profile.background, type: e.target.value}})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image URL</option>
              </select>
            </div>

            {profile.background.type === 'image' ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Background Image URL</label>
                <input 
                  type="text" 
                  value={profile.background.imageUrl}
                  onChange={e => setProfile({...profile, background: {...profile.background, imageUrl: e.target.value}})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color 1 (or Solid Color)</label>
                  <select 
                    value={profile.background.color1}
                    onChange={e => setProfile({...profile, background: {...profile.background, color1: e.target.value}})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="var(--color-deep-navy-900)">Deep Navy 900</option>
                    <option value="var(--color-deep-navy-500)">Deep Navy 500</option>
                    <option value="var(--color-deep-navy-100)">Deep Navy 100</option>
                    <option value="var(--color-regal-navy-900)">Regal Navy 900</option>
                    <option value="#000000">Black</option>
                  </select>
                </div>
                {profile.background.type === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Color 2 (Gradient End)</label>
                    <select 
                      value={profile.background.color2}
                      onChange={e => setProfile({...profile, background: {...profile.background, color2: e.target.value}})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="var(--color-deep-navy-900)">Deep Navy 900</option>
                      <option value="var(--color-deep-navy-500)">Deep Navy 500</option>
                      <option value="var(--color-deep-navy-100)">Deep Navy 100</option>
                      <option value="var(--color-regal-navy-900)">Regal Navy 900</option>
                      <option value="#000000">Black</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Discord Activity */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Activity Card</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Status (e.g. Playing Code)</label>
                <input 
                  type="text" 
                  value={profile.activity.status}
                  onChange={e => setProfile({...profile, activity: {...profile.activity, status: e.target.value}})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Details (e.g. Idling)</label>
                <input 
                  type="text" 
                  value={profile.activity.details}
                  onChange={e => setProfile({...profile, activity: {...profile.activity, details: e.target.value}})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Icon URL</label>
                <input 
                  type="text" 
                  value={profile.activity.icon}
                  onChange={e => setProfile({...profile, activity: {...profile.activity, icon: e.target.value}})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Badge Text (e.g. PHAS)</label>
                <input 
                  type="text" 
                  value={profile.activity.badge}
                  onChange={e => setProfile({...profile, activity: {...profile.activity, badge: e.target.value}})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Manager */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xl font-bold text-slate-100">Social Links Row</h2>
            <button 
              onClick={addLink}
              className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg transition-colors"
            >
              + Add Icon
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.links.map((link) => (
              <div key={link.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 relative">
                <button 
                  onClick={() => removeLink(link.id)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                >
                  ✕
                </button>
                <div className="space-y-3 pr-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Icon Type</label>
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">URL / Link</label>
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {profile.links.length === 0 && (
            <p className="text-slate-500 text-sm italic text-center py-4">No social icons added yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}
