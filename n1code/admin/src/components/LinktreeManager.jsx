import { useState, useEffect } from 'react';
import StatusMessage from './StatusMessage';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ImageManagerModal from './ImageManagerModal';
import IconPickerModal from './IconPickerModal';
import { getIconComponent } from '../lib/IconRegistry';

export default function LinktreeManager() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  
  // Image Manager State
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null); // 'avatarUrl', 'background.imageUrl', 'pageBackground.imageUrl'
  
  // Icon Picker State
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [activeLinkIdForIcon, setActiveLinkIdForIcon] = useState(null);
  
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
      imageUrl: "",
      opacity: 100
    },
    pageBackground: {
      type: "color",
      color1: "#0b0f19",
      color2: "#000000",
      imageUrl: ""
    },
    links: [],
    views: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setInitialLoading(true);
      try {
        const docRef = doc(db, "settings", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.background) {
            data.background = { type: "gradient", color1: "#000036", color2: "#000016", imageUrl: "", opacity: 100 };
          }
          if (!data.pageBackground) {
            data.pageBackground = { type: "color", color1: "#0b0f19", color2: "#000000", imageUrl: "" };
          }
          if (!data.links) {
            data.links = [];
          }
          // Ensure pageBackground exists if migrating from old data
          if (!data.pageBackground) {
            data.pageBackground = {
              type: "color",
              color1: "#0b0f19",
              color2: "#000000",
              imageUrl: ""
            };
          }
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);



  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "profile");
      await setDoc(docRef, profile);
      setStatus({ type: 'success', message: 'Changes saved successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setStatus({ type: 'error', message: 'Failed to save profile. Please check console for details.' });
    } finally {
      setLoading(false);
    }
  };

  const openImageManager = (fieldPath) => {
    setCurrentImageField(fieldPath);
    setIsImageManagerOpen(true);
  };

  const handleImageSelected = (url) => {
    if (currentImageField === 'avatarUrl') {
      setProfile(p => ({ ...p, avatarUrl: url }));
    } else if (currentImageField === 'background.imageUrl') {
      setProfile(p => ({ ...p, background: { ...p.background, imageUrl: url } }));
    } else if (currentImageField === 'pageBackground.imageUrl') {
      setProfile(p => ({ ...p, pageBackground: { ...p.pageBackground, imageUrl: url } }));
    }
  };

  const openIconPicker = (linkId) => {
    setActiveLinkIdForIcon(linkId);
    setIsIconPickerOpen(true);
  };

  const handleIconSelected = (iconId) => {
    if (activeLinkIdForIcon) {
      updateLink(activeLinkIdForIcon, 'icon', iconId);
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
      links: (p.links || []).map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  if (initialLoading) return <div className="text-slate-400 p-8">Loading profile data...</div>;

  return (
    <div className="space-y-8 pb-12">
      <ImageManagerModal 
        isOpen={isImageManagerOpen} 
        onClose={() => setIsImageManagerOpen(false)}
        onSelect={handleImageSelected}
      />
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={handleIconSelected}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100 mb-2">Linktree Settings</h1>
          <p className="text-slate-400">Customize your public linktree page appearance and data.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="whitespace-nowrap bg-sky-aqua-600 hover:bg-sky-aqua-500 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-sky-aqua-500/20"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status && <StatusMessage status={status} />}

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
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
              <input 
                type="text" 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Avatar Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={profile.avatarUrl}
                  onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  placeholder="https://..."
                />
                <button 
                  onClick={() => openImageManager('avatarUrl')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 transition-colors whitespace-nowrap"
                >
                  Select Image
                </button>
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
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
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
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
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
                className="w-5 h-5 rounded border-slate-700 text-sky-aqua-600 focus:ring-sky-aqua-500 bg-slate-900/50"
              />
              <label htmlFor="glowToggle" className="text-sm font-medium text-slate-200">Enable Neon Glow Effects (Text, Avatar, Icons)</label>
            </div>
          </div>
        </div>

        {/* Card Background */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Card Background</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Background Type</label>
              <select 
                value={profile.background?.type}
                onChange={e => setProfile({...profile, background: {...profile.background, type: e.target.value}})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image URL</option>
              </select>
            </div>

            {profile.background?.type === 'image' ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={profile.background?.imageUrl}
                    onChange={e => setProfile({...profile, background: {...profile.background, imageUrl: e.target.value}})}
                    className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => openImageManager('background.imageUrl')}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 transition-colors whitespace-nowrap"
                  >
                    Select Image
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color 1 (or Solid Color)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={profile.background?.color1}
                      onChange={e => setProfile({...profile, background: {...profile.background, color1: e.target.value}})}
                      className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                    />
                    <input 
                      type="text" 
                      value={profile.background?.color1}
                      onChange={e => setProfile({...profile, background: {...profile.background, color1: e.target.value}})}
                      className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    />
                  </div>
                </div>
                {profile.background?.type === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Color 2 (Gradient End)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={profile.background?.color2}
                        onChange={e => setProfile({...profile, background: {...profile.background, color2: e.target.value}})}
                        className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                      />
                      <input 
                        type="text" 
                        value={profile.background?.color2}
                        onChange={e => setProfile({...profile, background: {...profile.background, color2: e.target.value}})}
                        className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Background Opacity: {profile.background?.opacity ?? 100}%
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={profile.background?.opacity ?? 100}
                onChange={e => setProfile({...profile, background: {...profile.background, opacity: parseInt(e.target.value)}})}
                className="w-full accent-sky-aqua-500"
              />
            </div>
          </div>
        </div>

        {/* Page Background */}
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Page Background</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Background Type</label>
              <select 
                value={profile.pageBackground?.type}
                onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, type: e.target.value}})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
              >
                <option value="color">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>

            {profile.pageBackground?.type === 'image' ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={profile.pageBackground?.imageUrl}
                    onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, imageUrl: e.target.value}})}
                    className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => openImageManager('pageBackground.imageUrl')}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 transition-colors whitespace-nowrap"
                  >
                    Select Image
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color 1 (or Solid Color)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={profile.pageBackground?.color1}
                      onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, color1: e.target.value}})}
                      className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                    />
                    <input 
                      type="text" 
                      value={profile.pageBackground?.color1}
                      onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, color1: e.target.value}})}
                      className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    />
                  </div>
                </div>
                {profile.pageBackground?.type === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Color 2 (Gradient End)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={profile.pageBackground?.color2}
                        onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, color2: e.target.value}})}
                        className="h-10 w-14 p-0 border-0 bg-transparent rounded-lg cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                      />
                      <input 
                        type="text" 
                        value={profile.pageBackground?.color2}
                        onChange={e => setProfile({...profile, pageBackground: {...profile.pageBackground, color2: e.target.value}})}
                        className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
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
            {(profile.links || []).map((link) => (
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
                      <label className="block text-xs font-medium text-slate-400 mb-1">Icon</label>
                      <button
                        onClick={() => openIconPicker(link.id)}
                        className="w-full bg-slate-800 border border-slate-700 hover:border-sky-aqua-500 rounded-lg px-3 py-1.5 text-sm text-slate-200 transition-colors flex items-center justify-between"
                      >
                        {(() => {
                          const IconComp = getIconComponent(link.icon);
                          return <IconComp className="w-5 h-5 text-sky-aqua-400" />;
                        })()}
                        <span>Change</span>
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Link Title</label>
                      <input 
                        type="text" 
                        value={link.title || ""}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="e.g. GitHub"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
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
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">URL / Link</label>
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
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
