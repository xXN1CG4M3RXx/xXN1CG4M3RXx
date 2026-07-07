export default function LinktreeManager() {
  return (
    <div className="glassmorphism rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-6">Linktree Configuration</h2>
      <p className="text-slate-400 mb-8">Manage your profile aesthetics and links displayed on the main website.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Accent Color (Hex)</label>
          <input type="text" placeholder="#a78bfa" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Bio Text</label>
          <textarea rows="3" placeholder="Software Engineer & Gamer" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200"></textarea>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors">
          Save Settings
        </button>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Manage Links</h3>
        <button className="border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-4 py-2 rounded-lg transition-colors text-sm mb-4">
          + Add New Link
        </button>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
           <p className="text-slate-500 text-sm text-center">Links will appear here.</p>
        </div>
      </div>
    </div>
  );
}
