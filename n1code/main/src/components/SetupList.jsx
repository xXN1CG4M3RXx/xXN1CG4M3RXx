export default function SetupList({ title, icon, items }) {
  return (
    <div className="glassmorphism rounded-2xl p-8 border border-slate-800/60 hover:border-sky-aqua-500/30 transition-all duration-300">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-800/80 pb-6">
        <div className="w-12 h-12 rounded-xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-100 font-display tracking-wide">{title}</h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-slate-300 font-medium tracking-wide group-hover:text-sky-aqua-400 transition-colors">
                {item.name}
              </span>
              <span className="text-slate-500 text-xs font-mono mt-1">
                {item.category}
              </span>
            </div>
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-sky-aqua-400 transition-colors p-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
