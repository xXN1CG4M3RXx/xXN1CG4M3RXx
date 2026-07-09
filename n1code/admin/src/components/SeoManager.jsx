import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ImageManagerModal from './ImageManagerModal';

export default function SeoManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    ogImage: "",
    themeColor: "#0ea5e9",
    buildHookUrl: ""
  });

  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "seo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSeoData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching SEO:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const docRef = doc(db, "settings", "seo");
      await setDoc(docRef, seoData);
      
      let message = "SEO settings saved successfully!";
      
      // Trigger rebuild if hook is provided
      if (seoData.buildHookUrl && seoData.buildHookUrl.trim() !== "") {
        try {
          const res = await fetch(seoData.buildHookUrl, { method: 'POST' });
          if (res.ok) {
            message += " Site rebuild triggered successfully.";
          } else {
            message += " However, the build hook failed to trigger.";
          }
        } catch (err) {
          message += " Could not reach the build hook URL.";
        }
      }
      
      setSuccess(message);
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error saving SEO:", error);
      setError("Failed to save SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="text-slate-400 p-8">Loading SEO settings...</div>;

  return (
    <div className="glassmorphism rounded-2xl p-8 border border-sky-aqua-500/20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">SEO & Metadata</h2>
          <p className="text-slate-400 mt-1">Control how your site appears in search engines and social embeds.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="whitespace-nowrap bg-sky-aqua-600 hover:bg-sky-aqua-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-sky-aqua-500/20"
        >
          {saving ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        
        {/* Meta Tags */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Global Meta Tags</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Site Title</label>
              <input 
                type="text" 
                value={seoData.title || ""}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500 transition-colors"
                placeholder="e.g. Nico's Portfolio"
              />
              <p className="text-xs text-slate-500 mt-1">The main title that appears in browser tabs and search results.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Site Description</label>
              <textarea 
                value={seoData.description || ""}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500 transition-colors resize-none"
                placeholder="A short description of your site..."
              />
              <p className="text-xs text-slate-500 mt-1">Recommended length: 150-160 characters.</p>
            </div>
          </div>
        </div>
        
        {/* Social / Open Graph */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Social Embeds (Open Graph)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Preview Image URL (OG Image)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={seoData.ogImage || ""}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500 transition-colors"
                  placeholder="https://example.com/preview.png"
                />
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Browse Library
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">The image that shows up when you link your site on Discord, Twitter, or iMessage. (1200x630 recommended)</p>
              
              {seoData.ogImage && (
                <div className="mt-4 border border-slate-700 rounded-lg overflow-hidden max-w-sm">
                  <img src={seoData.ogImage} alt="OG Preview" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Theme Color</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-lg border border-slate-700 overflow-hidden shrink-0 relative">
                  <input 
                    type="color" 
                    value={seoData.themeColor || "#0ea5e9"}
                    onChange={(e) => updateField('themeColor', e.target.value)}
                    className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
                <input 
                  type="text" 
                  value={seoData.themeColor || "#0ea5e9"}
                  onChange={(e) => updateField('themeColor', e.target.value)}
                  className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">The accent color used on mobile browsers and Discord embeds.</p>
            </div>
          </div>
        </div>
        
        {/* Advanced / Netlify */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-sky-aqua-500/30">
          <h3 className="font-bold text-sky-aqua-400 mb-4 border-b border-sky-aqua-500/20 pb-2">Deployment Hooks</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Netlify Build Hook URL</label>
            <input 
              type="password" 
              value={seoData.buildHookUrl || ""}
              onChange={(e) => updateField('buildHookUrl', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500 transition-colors font-mono text-sm"
              placeholder="https://api.netlify.com/build_hooks/..."
            />
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              To apply SEO changes globally, the site needs to rebuild. Paste your Netlify Build Hook URL here. When you click "Save & Publish", it will automatically trigger a background rebuild to inject the new metadata into your HTML.
            </p>
          </div>
        </div>

      </div>

      <ImageManagerModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={(url) => updateField('ogImage', url)}
      />
    </div>
  );
}
