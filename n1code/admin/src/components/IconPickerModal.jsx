import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ICONS } from '../lib/IconRegistry';

export default function IconPickerModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return ICONS;
    const lowerSearch = searchTerm.toLowerCase();
    return ICONS.filter(icon => 
      icon.name.toLowerCase().includes(lowerSearch) || 
      icon.category.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const categories = useMemo(() => {
    const cats = [...new Set(filteredIcons.map(i => i.category))];
    return cats.sort();
  }, [filteredIcons]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-sky-aqua-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Select an Icon</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search icons (e.g. 'discord', 'gaming')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-sky-aqua-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {categories.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No icons found matching "{searchTerm}"
            </div>
          ) : (
            categories.map(category => (
              <div key={category}>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {filteredIcons.filter(i => i.category === category).map(icon => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.id}
                        onClick={() => {
                          onSelect(icon.id);
                          onClose();
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-sky-aqua-500 hover:text-sky-aqua-400 transition-all group"
                        title={icon.name}
                      >
                        <IconComponent className="w-8 h-8 mb-2 text-slate-300 group-hover:text-sky-aqua-400 transition-colors" />
                        <span className="text-[10px] text-slate-400 group-hover:text-sky-aqua-300 truncate w-full text-center">
                          {icon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
