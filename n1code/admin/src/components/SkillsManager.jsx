import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import IconPickerModal from './IconPickerModal';

export default function SkillsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [skills, setSkills] = useState([]);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "skills");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSkills(docSnap.data().list || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "skills");
      await setDoc(docRef, { list: skills });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Failed to save skills. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: "New Skill", icon: "Code", category: "Language", proficiency: "Expert" }]);
  };

  const removeSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const updateSkill = (id, field, value) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newSkills = [...skills];
    const temp = newSkills[index - 1];
    newSkills[index - 1] = newSkills[index];
    newSkills[index] = temp;
    setSkills(newSkills);
  };

  const moveDown = (index) => {
    if (index === skills.length - 1) return;
    const newSkills = [...skills];
    const temp = newSkills[index + 1];
    newSkills[index + 1] = newSkills[index];
    newSkills[index] = temp;
    setSkills(newSkills);
  };

  const handleIconSelect = (iconName) => {
    if (activeItemIndex !== null) {
      const id = skills[activeItemIndex].id;
      updateSkill(id, 'icon', iconName);
    }
  };

  if (loading) return <div className="text-slate-400 p-8">Loading skills...</div>;

  return (
    <div className="glassmorphism rounded-2xl p-8 border border-sky-aqua-500/20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">Tech Stack</h2>
          <p className="text-slate-400 mt-1">Manage your programming languages, frameworks, and tools.</p>
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
          Skills saved successfully!
        </div>
      )}

      <div className="space-y-4 mb-6">
        {skills.map((skill, index) => (
          <div key={skill.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center group">
            
            {/* Reorder Buttons */}
            <div className="flex flex-row md:flex-col gap-1">
              <button 
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 p-1"
              >
                ▲
              </button>
              <button 
                onClick={() => moveDown(index)}
                disabled={index === skills.length - 1}
                className="text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 p-1"
              >
                ▼
              </button>
            </div>
            
            {/* Icon Picker */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setActiveItemIndex(index);
                  setIsIconModalOpen(true);
                }}
                className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 hover:border-sky-aqua-500 flex flex-col items-center justify-center transition-colors"
              >
                <span className="text-xs text-slate-400">Icon</span>
                <span className="text-xs font-bold text-slate-300 truncate w-10 text-center">{skill.icon || "..."}</span>
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Name</label>
                <input 
                  type="text" 
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                  placeholder="e.g. React"
                />
              </div>
              
              <div>
                <label className="block text-xs text-slate-500 mb-1">Category</label>
                <select
                  value={skill.category || "Frontend"}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                >
                  <option value="Language">Language</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tool">Tool / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Proficiency</label>
                <select
                  value={skill.proficiency || "Advanced"}
                  onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-aqua-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => removeSkill(skill.id)}
              className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0"
              title="Delete skill"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addSkill}
        className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-sky-aqua-500 text-slate-400 hover:text-sky-aqua-400 transition-colors flex items-center justify-center gap-2"
      >
        <span>+ Add Skill</span>
      </button>

      <IconPickerModal 
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelect={handleIconSelect}
      />
    </div>
  );
}
