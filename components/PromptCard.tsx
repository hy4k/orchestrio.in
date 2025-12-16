import React, { useState } from 'react';
import { Prompt, Platform } from '../types';
import { Icons } from './Icon';

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onEdit: (e: React.MouseEvent, prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, isSaved, onToggleSave, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = (tag: Platform) => {
    switch (tag) {
      case Platform.GEMINI: return <Icons.Sparkles size={14} className="text-[#ECEDE5]" />;
      case Platform.OPENAI: return <Icons.Bot size={14} className="text-[#ECEDE5]" />;
      case Platform.ANTHROPIC: return <Icons.Brain size={14} className="text-[#ECEDE5]" />;
      case Platform.VEO: return <Icons.Film size={14} className="text-[#ECEDE5]" />;
      case Platform.MIDJOURNEY: return <Icons.Palette size={14} className="text-[#ECEDE5]" />;
      case Platform.LEONARDO: return <Icons.Image size={14} className="text-[#ECEDE5]" />;
      default: return <Icons.Cpu size={14} className="text-[#ECEDE5]" />;
    }
  };

  // Neumorphic shadow calculation for #4F373B
  // Dark shadow: #352528
  // Light shadow: #69494e
  const cardStyle = {
    background: '#4F373B',
    boxShadow: '10px 10px 20px #352528, -10px -10px 20px #69494e',
    borderRadius: '30px'
  };

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col justify-between p-6 transition-all duration-300 cursor-pointer hover:-translate-y-2"
      style={cardStyle}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex -space-x-2">
            {prompt.tags.slice(0, 3).map((tag, i) => (
              <div key={tag} className="w-8 h-8 rounded-full bg-[#506467] border-2 border-[#4F373B] flex items-center justify-center z-[1]">
                 {getPlatformIcon(tag)}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => onEdit(e, prompt)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-neumorphic-sm text-[#ECEDE5]/50 hover:text-[#ECEDE5]"
              style={{ background: '#4F373B' }}
              title="Edit Prompt"
            >
              <Icons.Edit size={14} />
            </button>
            <button 
              onClick={(e) => onToggleSave(e, prompt.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-neumorphic-sm ${isSaved ? 'text-[#C16845]' : 'text-[#ECEDE5]/50 hover:text-[#ECEDE5]'}`}
              style={{ background: '#4F373B' }}
            >
              <Icons.Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={handleCopy}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-neumorphic-sm text-[#ECEDE5]/50 hover:text-[#ECEDE5]"
              style={{ background: '#4F373B' }}
            >
              {copied ? <Icons.Check size={14} className="text-[#BB7287]" /> : <Icons.Copy size={14} />}
            </button>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-[#ECEDE5] mb-2 leading-tight">
          {prompt.title}
        </h3>
        <p className="text-[#ECEDE5]/60 text-sm line-clamp-3 mb-4 font-light">
          {prompt.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#ECEDE5]/5">
        <span className="flex items-center gap-2 text-xs font-medium text-[#C16845] uppercase tracking-wider">
          <Icons.Layers size={12} />
          {prompt.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#ECEDE5]/40">
           {prompt.likes} saves
        </span>
      </div>
    </div>
  );
};

export default PromptCard;