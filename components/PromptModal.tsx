import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { Icons } from './Icon';
import { GlowingButton } from './Button';

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: (updatedPrompt: Prompt) => void;
  onToggleEdit: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, isOpen, isEditing, onClose, onSave, onToggleEdit }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<Prompt | null>(null);

  useEffect(() => {
    if (prompt) {
      setFormData({ ...prompt });
    }
  }, [prompt]);

  if (!prompt || !formData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (field: keyof Prompt, value: string) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const inputStyle = {
    background: '#3a292c',
    boxShadow: 'inset 4px 4px 8px #2a1e20, inset -4px -4px 8px #4a3438',
    border: 'none',
    color: '#ECEDE5'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#506467]/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-6xl h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-t-[30px] sm:rounded-[40px]"
        style={{
          background: '#4F373B',
          boxShadow: '20px 20px 60px #2a3536, -20px -20px 60px #769398'
        }}
      >
        
        {/* Left Side: Content */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto custom-scrollbar">
          
          {/* Mobile Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-[#ECEDE5]/20 rounded-full mx-auto mb-6"></div>

          <div className="flex justify-between items-start mb-8">
            <div className="w-full mr-4">
              {isEditing ? (
                <div className="space-y-4">
                   <label className="text-xs font-bold text-[#C16845] uppercase">Title</label>
                   <input 
                     type="text" 
                     value={formData.title} 
                     onChange={(e) => handleInputChange('title', e.target.value)}
                     className="w-full p-3 rounded-xl text-xl font-bold focus:outline-none focus:ring-1 focus:ring-[#C16845]"
                     style={inputStyle}
                   />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#ECEDE5] mb-2 font-display">{prompt.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                     <span className="bg-[#C16845] text-white text-xs font-bold px-3 py-1 rounded-full">{prompt.category}</span>
                     <div className="flex flex-wrap gap-1">
                       {prompt.tags.map(tag => (
                         <span key={tag} className="text-[#ECEDE5]/50 text-xs px-2 py-1 rounded-full border border-[#ECEDE5]/10">
                           {tag}
                         </span>
                       ))}
                     </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
               {isEditing ? (
                 <button 
                   onClick={handleSave} 
                   className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C16845] text-white shadow-lg hover:scale-105 transition-transform"
                   title="Save Changes"
                 >
                   <Icons.Check size={20} />
                 </button>
               ) : (
                 <button 
                   onClick={onToggleEdit} 
                   className="flex w-10 h-10 rounded-full items-center justify-center bg-[#506467] text-[#ECEDE5] shadow-inner hover:text-[#C16845]"
                   title="Edit Prompt"
                 >
                   <Icons.Edit size={18} />
                 </button>
               )}
               <button 
                 onClick={onClose} 
                 className="w-10 h-10 rounded-full flex items-center justify-center bg-[#506467] text-[#ECEDE5] shadow-inner"
               >
                 <Icons.X size={20} />
               </button>
            </div>
          </div>

          <div className="bg-[#506467] rounded-3xl p-6 sm:p-8 mb-8 relative group shadow-inner">
             {isEditing ? (
               <div className="h-[300px]">
                 <textarea 
                   value={formData.content}
                   onChange={(e) => handleInputChange('content', e.target.value)}
                   className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-[#ECEDE5]/90 custom-scrollbar"
                   placeholder="Prompt content..."
                 />
               </div>
             ) : (
               <>
                 <div className="font-mono text-sm text-[#ECEDE5]/90 leading-relaxed whitespace-pre-wrap">
                   {prompt.content}
                 </div>
                 <div className="absolute top-4 right-4">
                    <GlowingButton onClick={handleCopy} className="py-2 px-4 text-sm min-w-0">
                       {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                       {copied ? 'Copied' : 'Copy'}
                    </GlowingButton>
                 </div>
               </>
             )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#C16845] uppercase">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-4 rounded-xl text-lg text-[#ECEDE5]/70 focus:outline-none focus:ring-1 focus:ring-[#C16845]"
                rows={3}
                style={inputStyle}
              />
            </div>
          ) : (
            <p className="text-[#ECEDE5]/70 italic text-lg leading-relaxed border-l-4 border-[#BB7287] pl-6 py-2">
              {prompt.description}
            </p>
          )}
        </div>

        {/* Right Side: Analysis & Parameters */}
        {!isEditing && (
          <div className="w-full md:w-[450px] bg-[#3a292c] p-6 sm:p-8 md:p-10 overflow-y-auto border-l border-[#ECEDE5]/5 custom-scrollbar pb-safe-bottom">
            
            {/* RTCROS Structure */}
            {prompt.rtcros && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-[#ECEDE5] flex items-center gap-2 font-display uppercase tracking-wide">
                    <Icons.Cpu className="text-[#BB7287]" size={24}/>
                    Structure
                  </h3>
                </div>
                
                <div className="space-y-8 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#ECEDE5]/10"></div>
                  <AnalysisItem icon={<Icons.Briefcase size={16}/>} label="Role" value={prompt.rtcros.role} color="text-[#C16845]" />
                  <AnalysisItem icon={<Icons.Check size={16}/>} label="Task" value={prompt.rtcros.task} color="text-[#BB7287]" />
                  <AnalysisItem icon={<Icons.BookOpen size={16}/>} label="Context" value={prompt.rtcros.context} color="text-[#ECEDE5]" />
                  <AnalysisItem icon={<Icons.Filter size={16}/>} label="Restrictions" value={prompt.rtcros.restrictions} color="text-[#C16845]" />
                  <AnalysisItem icon={<Icons.Layers size={16}/>} label="Output" value={prompt.rtcros.output} color="text-[#BB7287]" />
                  <AnalysisItem icon={<Icons.Sparkles size={16}/>} label="Style" value={prompt.rtcros.style} color="text-[#ECEDE5]" />
                </div>
              </div>
            )}

            {/* Model Parameters */}
            {prompt.parameters && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#ECEDE5] flex items-center gap-2 font-display uppercase tracking-wide">
                    <Icons.Settings2 className="text-[#C16845]" size={24}/>
                    Settings
                  </h3>
                </div>

                <div className="bg-[#4F373B] rounded-2xl p-6 space-y-4 shadow-neumorphic-sm">
                   {prompt.parameters.model && (
                     <ParamItem label="Recommended Model" value={prompt.parameters.model} />
                   )}
                   {prompt.parameters.temperature !== undefined && (
                     <ParamItem label="Temperature" value={prompt.parameters.temperature.toString()} />
                   )}
                   {prompt.parameters.aspectRatio && (
                     <ParamItem label="Aspect Ratio" value={prompt.parameters.aspectRatio} />
                   )}
                   {prompt.parameters.guidanceScale !== undefined && (
                     <ParamItem label="Guidance Scale" value={prompt.parameters.guidanceScale.toString()} />
                   )}
                   {prompt.parameters.negativePrompt && (
                     <div className="pt-2 border-t border-[#ECEDE5]/10 mt-2">
                       <span className="text-[10px] text-[#BB7287] font-bold uppercase tracking-widest block mb-2">Negative Prompt</span>
                       <p className="text-xs text-[#ECEDE5]/70 leading-relaxed font-mono">
                         {prompt.parameters.negativePrompt}
                       </p>
                     </div>
                   )}
                </div>
              </div>
            )}

            {prompt.rtcros && (
              <div className="mt-auto p-5 bg-[#C16845]/10 border border-[#C16845]/20 rounded-2xl">
                <h4 className="text-[#C16845] text-xs font-bold uppercase tracking-wider mb-2">Why it works</h4>
                <p className="text-[#ECEDE5]/60 text-xs leading-relaxed">
                  RTCROS framework ensures precision by defining the persona, objective, and boundaries explicitly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisItem = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="relative pl-8 group">
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-[#3a292c] border-2 border-[#4F373B] flex items-center justify-center z-10 ${color}`}>
      {icon}
    </div>
    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${color}`}>
      {label}
    </div>
    <div className="text-sm text-[#ECEDE5]/80 leading-snug group-hover:text-white transition-colors">
      {value}
    </div>
  </div>
);

const ParamItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-[#ECEDE5]/50 font-bold uppercase">{label}</span>
    <span className="text-sm text-[#ECEDE5] font-mono">{value}</span>
  </div>
);

export default PromptModal;