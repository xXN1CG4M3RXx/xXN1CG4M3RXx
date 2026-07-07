import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ImageManagerModal from './ImageManagerModal';

export default function ProjectManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "projects");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjects(docSnap.data().list || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "projects");
      await setDoc(docRef, { list: projects });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving projects:", error);
      alert("Failed to save projects. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: "New Project",
        description: "",
        tags: [],
        githubUrl: "",
        liveUrl: "",
        imageUrl: ""
      }
    ]);
  };

  const removeProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        if (field === 'tags') {
          return { ...p, tags: value.split(',').map(t => t.trim()).filter(Boolean) };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const openImageManager = (projectId) => {
    setActiveProjectId(projectId);
    setIsImageManagerOpen(true);
  };

  const handleImageSelected = (url) => {
    if (activeProjectId) {
      updateProject(activeProjectId, 'imageUrl', url);
    }
  };

  if (loading) return <div className="text-slate-400 p-8">Loading projects...</div>;

  return (
    <div className="glassmorphism rounded-2xl p-8 border border-sky-aqua-500/20 relative">
      <ImageManagerModal 
        isOpen={isImageManagerOpen} 
        onClose={() => setIsImageManagerOpen(false)}
        onSelect={handleImageSelected}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">Project Showcase</h2>
          <p className="text-slate-400 mt-1">Manage the projects shown on your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addProject}
            className="whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Add Project
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="whitespace-nowrap bg-sky-aqua-600 hover:bg-sky-aqua-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-sky-aqua-500/20"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6">
          Projects saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/50 relative">
            <button 
              onClick={() => removeProject(project.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
            >
              ✕ Remove
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={(project.tags || []).join(", ")}
                  onChange={(e) => updateProject(project.id, 'tags', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  placeholder="React, Firebase, Tailwind"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea 
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">GitHub URL</label>
                <input 
                  type="text" 
                  value={project.githubUrl || ""}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Live URL (optional)</label>
                <input 
                  type="text" 
                  value={project.liveUrl || ""}
                  onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Image URL (or upload)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={project.imageUrl || ""}
                    onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => openImageManager(project.id)}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 transition-colors whitespace-nowrap"
                  >
                    Select Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-slate-500 text-center py-8">No projects added yet.</p>
        )}
      </div>
    </div>
  );
}
