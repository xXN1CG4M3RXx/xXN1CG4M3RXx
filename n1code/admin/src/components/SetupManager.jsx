import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SetupManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [setupData, setSetupData] = useState({
    gaming: [],
    development: []
  });

  useEffect(() => {
    const fetchSetup = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "setup");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSetupData({
            gaming: docSnap.data().gaming || [],
            development: docSnap.data().development || []
          });
        }
      } catch (error) {
        console.error("Error fetching setup:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSetup();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "setup");
      await setDoc(docRef, setupData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Failed to save setup. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const addItem = (category) => {
    setSetupData(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now().toString(), name: "New Item", category: "Peripheral", link: "" }]
    }));
  };

  const removeItem = (category, id) => {
    setSetupData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const updateItem = (category, id, field, value) => {
    setSetupData(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const renderSetupList = (title, categoryKey) => {
    const items = setupData[categoryKey];
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-200">{title}</h3>
          <button 
            onClick={() => addItem(categoryKey)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
          >
            + Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg relative group border border-slate-700/30">
              <button 
                onClick={() => removeItem(categoryKey, item.id)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <div className="space-y-3 pr-6">
                <div>
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => updateItem(categoryKey, item.id, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="Item Name (e.g. RTX 4080)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={item.category}
                    onChange={(e) => updateItem(categoryKey, item.id, 'category', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="Category (e.g. GPU)"
                  />
                  <input 
                    type="text" 
                    value={item.link || ""}
                    onChange={(e) => updateItem(categoryKey, item.id, 'link', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="Affiliate / Store Link"
                  />
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-slate-500 text-sm italic text-center py-4">No items added.</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-slate-400 p-8">Loading setup...</div>;

  return (
    <div className="glassmorphism rounded-2xl p-8 border border-sky-aqua-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">Hardware Setup</h2>
          <p className="text-slate-400 mt-1">Manage items in your Gaming and Development setup.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="whitespace-nowrap bg-sky-aqua-600 hover:bg-sky-aqua-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-sky-aqua-500/20"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6">
          Setup saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderSetupList("Gaming Rig", "gaming")}
        {renderSetupList("Development Setup", "development")}
      </div>
    </div>
  );
}
