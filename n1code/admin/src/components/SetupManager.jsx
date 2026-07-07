export default function SetupManager() {
  return (
    <div className="glassmorphism rounded-2xl p-8 border border-amber-500/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">Hardware Setup</h2>
          <p className="text-slate-400 mt-1">Manage items in your Gaming and Development setup.</p>
        </div>
        <button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg transition-colors shadow-lg shadow-amber-500/20">
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-4 flex justify-between items-center">
            Gaming Rig
          </h3>
          <p className="text-slate-500 text-sm italic">Items list will appear here...</p>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-4 flex justify-between items-center">
            Development Setup
          </h3>
          <p className="text-slate-500 text-sm italic">Items list will appear here...</p>
        </div>
      </div>
    </div>
  );
}
