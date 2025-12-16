import React, { useState, useEffect } from 'react';
import { Project, Secret, Bookmark, DeviceType, Platform } from '../types';
import { Icons } from './Icon';
import { GlowingButton } from './Button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateProjectModalProps extends BaseModalProps {
  onCreate: (project: Omit<Project, 'id'>) => void;
}

interface CreateSecretModalProps extends BaseModalProps {
  onSave: (secret: Omit<Secret, 'id'>) => void;
  initialData?: Secret | null;
}

interface CreateBookmarkModalProps extends BaseModalProps {
  onCreate: (bookmark: Omit<Bookmark, 'id'>) => void;
}

const inputStyle = {
  background: '#3a292c',
  boxShadow: 'inset 4px 4px 8px #2a1e20, inset -4px -4px 8px #4a3438',
  border: 'none',
  color: '#ECEDE5'
};

const ModalWrapper: React.FC<BaseModalProps & { title: string, children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-[#506467]/90 backdrop-blur-md" onClick={onClose}></div>
      <div 
        className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl custom-scrollbar rounded-t-[30px] sm:rounded-[40px]"
        style={{
          background: '#4F373B',
          boxShadow: '20px 20px 60px #2a3536, -20px -20px 60px #769398'
        }}
      >
        <div className="p-6 sm:p-8">
          {/* Mobile Handle for visual cue */}
          <div className="sm:hidden w-12 h-1.5 bg-[#ECEDE5]/20 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#ECEDE5] font-display uppercase tracking-wide">{title}</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#506467] text-[#ECEDE5] hover:text-[#C16845]">
              <Icons.X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    backendUrl: '',
    repoUrl: '',
    dockerInfo: '',
    aiPlatform: Platform.GEMINI,
    device: DeviceType.LAPTOP,
    otherDeviceName: '',
    isPushedToGit: false,
    isDeployed: false,
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.name) return;
    onCreate({
      ...formData as any,
      lastUpdated: new Date().toISOString()
    });
    onClose();
    setFormData({ name: '', backendUrl: '', repoUrl: '', dockerInfo: '', aiPlatform: Platform.GEMINI, device: DeviceType.LAPTOP, isPushedToGit: false, isDeployed: false, notes: '' });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Project">
      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Project Name</label>
           <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl text-lg font-bold focus:outline-none" style={inputStyle} placeholder="Project Name" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs font-bold text-[#C16845] uppercase">Backend URL (Supabase etc)</label>
             <input type="text" value={formData.backendUrl} onChange={e => setFormData({...formData, backendUrl: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="https://..." />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-[#C16845] uppercase">Repository URL</label>
             <input type="text" value={formData.repoUrl} onChange={e => setFormData({...formData, repoUrl: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="https://github.com/..." />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs font-bold text-[#C16845] uppercase">Docker Info</label>
             <input type="text" value={formData.dockerInfo} onChange={e => setFormData({...formData, dockerInfo: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="Image tag or path" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-[#C16845] uppercase">AI Platform Used</label>
             <select value={formData.aiPlatform} onChange={e => setFormData({...formData, aiPlatform: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none appearance-none" style={inputStyle}>
                {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Other">Other</option>
             </select>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs font-bold text-[#C16845] uppercase">Device</label>
             <select value={formData.device} onChange={e => setFormData({...formData, device: e.target.value as DeviceType})} className="w-full p-4 rounded-xl focus:outline-none appearance-none" style={inputStyle}>
                {Object.values(DeviceType).map(d => <option key={d} value={d}>{d}</option>)}
             </select>
           </div>
           {formData.device === DeviceType.OTHER && (
             <div className="space-y-2">
               <label className="text-xs font-bold text-[#C16845] uppercase">Specify Device</label>
               <input type="text" value={formData.otherDeviceName} onChange={e => setFormData({...formData, otherDeviceName: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} />
             </div>
           )}
        </div>

        <div className="flex gap-6 pt-2">
           <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.isPushedToGit ? 'bg-[#C16845] border-[#C16845]' : 'border-[#ECEDE5]/30'}`}>
                {formData.isPushedToGit && <Icons.Check size={16} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={formData.isPushedToGit} onChange={e => setFormData({...formData, isPushedToGit: e.target.checked})} />
              <span className="text-sm font-bold text-[#ECEDE5]">Pushed to Git</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.isDeployed ? 'bg-[#C16845] border-[#C16845]' : 'border-[#ECEDE5]/30'}`}>
                {formData.isDeployed && <Icons.Check size={16} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={formData.isDeployed} onChange={e => setFormData({...formData, isDeployed: e.target.checked})} />
              <span className="text-sm font-bold text-[#ECEDE5]">Deployed</span>
           </label>
        </div>

        <div className="space-y-2 mt-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Notes</label>
           <textarea 
             value={formData.notes} 
             onChange={e => setFormData({...formData, notes: e.target.value})} 
             className="w-full p-4 rounded-xl focus:outline-none resize-none" 
             style={inputStyle} 
             placeholder="Add development notes, environment variables, or commands..." 
             rows={3} 
           />
        </div>

        <div className="mt-6">
           <GlowingButton onClick={handleSubmit}>
              <Icons.PlusCircle size={20} /> Save Project
           </GlowingButton>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const CreateSecretModal: React.FC<CreateSecretModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ name: '', value: '', service: '' });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ name: initialData.name, value: initialData.value, service: initialData.service });
      } else {
        setFormData({ name: '', value: '', service: '' });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!formData.name || !formData.value) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? "Edit API Key / Secret" : "Add API Key / Secret"}>
      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Service Name</label>
           <input type="text" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="e.g. OpenAI, AWS" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Key Name</label>
           <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="e.g. Production API Key" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Secret Value</label>
           <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none font-mono text-sm" style={inputStyle} placeholder="sk-..." />
        </div>
        <div className="mt-6">
           <GlowingButton onClick={handleSubmit}>
              <Icons.Key size={20} /> {initialData ? "Save Changes" : "Save Secret"}
           </GlowingButton>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const CreateBookmarkModal: React.FC<CreateBookmarkModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({ title: '', url: '', category: '', note: '' });

  const handleSubmit = () => {
    if (!formData.title || !formData.url) return;
    onCreate({ ...formData, dateAdded: new Date().toISOString() });
    onClose();
    setFormData({ title: '', url: '', category: '', note: '' });
  };

  const suggestedCategories = ['Design Inspiration', 'AI Tools', 'Documentation', 'Resources', 'Learning'];

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Bookmark">
      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Title</label>
           <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="Resource Title" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">URL</label>
           <input type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="https://..." />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Category</label>
           <input 
             type="text" 
             value={formData.category} 
             onChange={e => setFormData({...formData, category: e.target.value})} 
             className="w-full p-4 rounded-xl focus:outline-none" 
             style={inputStyle} 
             placeholder="e.g. UI Kit, Design Pattern" 
           />
           <div className="flex flex-wrap gap-2 mt-2">
             {suggestedCategories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setFormData({...formData, category: cat})}
                 className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors ${formData.category === cat ? 'bg-[#C16845] text-white' : 'bg-[#3a292c] text-[#ECEDE5]/50 hover:bg-[#506467] hover:text-[#ECEDE5]'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-[#C16845] uppercase">Note</label>
           <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full p-4 rounded-xl focus:outline-none" style={inputStyle} placeholder="Optional notes..." rows={3} />
        </div>
        <div className="mt-6">
           <GlowingButton onClick={handleSubmit}>
              <Icons.Bookmark size={20} /> Save Bookmark
           </GlowingButton>
        </div>
      </div>
    </ModalWrapper>
  );
};