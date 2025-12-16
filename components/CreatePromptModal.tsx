import React, { useState } from 'react';
import { Prompt, Category, Platform } from '../types';
import { Icons } from './Icon';
import { GlowingButton } from './Button';

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (prompt: Omit<Prompt, 'id' | 'likes'>) => void;
}

const CreatePromptModal: React.FC<CreatePromptModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.CODING,
    tags: [] as Platform[],
    content: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: Platform) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) return; // Basic validation
    onCreate(formData);
    onClose();
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: Category.CODING,
      tags: [],
      content: ''
    });
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
        className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl custom-scrollbar rounded-t-[30px] sm:rounded-[40px]"
        style={{
          background: '#4F373B',
          boxShadow: '20px 20px 60px #2a3536, -20px -20px 60px #769398'
        }}
      >
        <div className="p-6 sm:p-8">
          
          {/* Mobile Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-[#ECEDE5]/20 rounded-full mx-auto mb-6"></div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#ECEDE5] font-display uppercase tracking-wide">Create Prompt</h2>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#506467] text-[#ECEDE5] shadow-inner hover:text-[#C16845] transition-colors"
            >
              <Icons.X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider">Title</label>
               <input 
                 type="text" 
                 value={formData.title} 
                 onChange={(e) => handleInputChange('title', e.target.value)}
                 className="w-full p-4 rounded-xl text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#C16845] transition-all"
                 placeholder="e.g., Python Script Generator"
                 style={inputStyle}
               />
            </div>

            {/* Description */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider">Description</label>
               <textarea 
                 value={formData.description}
                 onChange={(e) => handleInputChange('description', e.target.value)}
                 className="w-full p-4 rounded-xl text-md text-[#ECEDE5]/80 focus:outline-none focus:ring-1 focus:ring-[#C16845] resize-none transition-all"
                 rows={2}
                 placeholder="Short description of what this prompt does..."
                 style={inputStyle}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider">Category</label>
                 <div className="relative">
                   <select 
                     value={formData.category}
                     onChange={(e) => handleInputChange('category', e.target.value)}
                     className="w-full p-4 rounded-xl text-md text-[#ECEDE5] focus:outline-none focus:ring-1 focus:ring-[#C16845] appearance-none cursor-pointer transition-all"
                     style={inputStyle}
                   >
                     {Object.values(Category).map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                   <Icons.Layers size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ECEDE5]/50 pointer-events-none" />
                 </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider">Platform Tags</label>
                 <div className="flex flex-wrap gap-2">
                   {Object.values(Platform).map(tag => (
                     <button
                       key={tag}
                       onClick={() => toggleTag(tag)}
                       className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                         formData.tags.includes(tag)
                           ? 'bg-[#C16845] border-[#C16845] text-white'
                           : 'bg-transparent border-[#ECEDE5]/20 text-[#ECEDE5]/50 hover:border-[#ECEDE5]/50'
                       }`}
                     >
                       {tag}
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider">Prompt Content</label>
               <div 
                 className="p-4 rounded-xl transition-all"
                 style={inputStyle}
               >
                 <textarea 
                   value={formData.content}
                   onChange={(e) => handleInputChange('content', e.target.value)}
                   className="w-full h-48 bg-transparent resize-none focus:outline-none font-mono text-sm text-[#ECEDE5]/90 custom-scrollbar placeholder-[#ECEDE5]/20"
                   placeholder="Type your prompt here..."
                 />
               </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
               <GlowingButton onClick={handleSubmit}>
                 <Icons.PlusCircle size={20} />
                 Create Prompt
               </GlowingButton>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePromptModal;