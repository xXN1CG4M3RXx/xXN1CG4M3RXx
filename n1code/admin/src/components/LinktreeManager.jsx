import { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function LinktreeManager() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // This state mirrors the expected structure in main's Home.jsx
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
    accentColor: "#00ccff",
    textColor: "#00ccff",
    glowEnabled: true,
    background: {
      type: "gradient",
      color1: "#000036",
      color2: "#000016",
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

  const handleImageUpload = async (e, fieldPath) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (fieldPath === 'avatarUrl') {
        setProfile(p => ({ ...p, avatarUrl: url }));
      } else if (fieldPath === 'background.imageUrl') {
        setProfile(p => ({ ...p, background: { ...p.background, imageUrl: url } }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addLink = () => {
    setProfile(p => ({
      ...p,
      links: [...p.links, { id: Date.now().toString(), title: "New Link", description: "", url: "", icon: "github" }]
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
              <label className="block text-sm font-medium text-slate-400 mb-1">Avatar Image URL (or upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={profile.avatarUrl}
                  onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  placeholder="https://..."
                />
                <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 cursor-pointer flex items-center justify-center transition-colors">
                  {uploadingImage ? '...' : 'Upload'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Theming & Appearance */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Appearance & Glow</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Accent/Glow Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={profile.accentColor}
                  onChange={e => setProfile({...profile, accentColor: e.target.value})}
                  className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <input 
                  type="text" 
                  value={profile.accentColor}
                  onChange={e => setProfile({...profile, accentColor: e.target.value})}
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  placeholder="#hex, rgb(), or var(--color-x)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={profile.textColor}
                  onChange={e => setProfile({...profile, textColor: e.target.value})}
                  className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <input 
                  type="text" 
                  value={profile.textColor}
                  onChange={e => setProfile({...profile, textColor: e.target.value})}
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  placeholder="#hex, rgb(), or var(--color-x)"
                />
              </div>
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
                <label className="block text-sm font-medium text-slate-400 mb-1">Background Image URL (or upload)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={profile.background.imageUrl}
                    onChange={e => setProfile({...profile, background: {...profile.background, imageUrl: e.target.value}})}
                    className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    placeholder="https://..."
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 cursor-pointer flex items-center justify-center transition-colors whitespace-nowrap">
                    {uploadingImage ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'background.imageUrl')} />
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color 1 (or Solid Color)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={profile.background.color1}
                      onChange={e => setProfile({...profile, background: {...profile.background, color1: e.target.value}})}
                      className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                    />
                    <input 
                      type="text" 
                      value={profile.background.color1}
                      onChange={e => setProfile({...profile, background: {...profile.background, color1: e.target.value}})}
                      className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                      placeholder="#hex, rgb(), or var(--color-x)"
                    />
                  </div>
                </div>
                {profile.background.type === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Color 2 (Gradient End)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={profile.background.color2}
                        onChange={e => setProfile({...profile, background: {...profile.background, color2: e.target.value}})}
                        className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                      />
                      <input 
                        type="text" 
                        value={profile.background.color2}
                        onChange={e => setProfile({...profile, background: {...profile.background, color2: e.target.value}})}
                        className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                        placeholder="#hex, rgb(), or var(--color-x)"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
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
                  <div className="grid grid-cols-2 gap-3">
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
                      <label className="block text-xs font-medium text-slate-400 mb-1">Link Title</label>
                      <input 
                        type="text" 
                        value={link.title || ""}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="e.g. GitHub"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Description (optional)</label>
                    <input 
                      type="text" 
                      value={link.description || ""}
                      onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                      placeholder="e.g. Check out my projects"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                    />
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
