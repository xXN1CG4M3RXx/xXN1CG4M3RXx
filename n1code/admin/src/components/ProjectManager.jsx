export default function ProjectManager() {
  return (
    <div className="glassmorphism rounded-2xl p-8 border border-pink-500/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">Project Showcase</h2>
          <p className="text-slate-400 mt-1">Manage the projects shown on your portfolio.</p>
        </div>
        <button className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg transition-colors shadow-lg shadow-pink-500/20">
          Add Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-sm">
              <th className="pb-3 font-medium">Project Title</th>
              <th className="pb-3 font-medium">Tags</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
              <td className="py-4 text-slate-200">n1code Platform</td>
              <td className="py-4">
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">React</span>
              </td>
              <td className="py-4 text-right">
                <button className="text-slate-400 hover:text-white mr-3">Edit</button>
                <button className="text-red-400 hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
