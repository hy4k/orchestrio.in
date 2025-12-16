import React, { useState } from 'react';
import { Icons } from './Icon';
import { RtcrosStructure } from '../types';
import { GlowingButton } from './Button';

const Builder: React.FC = () => {
  const [formData, setFormData] = useState<RtcrosStructure>({
    role: '',
    task: '',
    context: '',
    restrictions: '',
    output: '',
    style: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleChange = (field: keyof RtcrosStructure, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    const prompt = `Role: ${formData.role}

Task: ${formData.task}

Context: ${formData.context}

Restrictions:
${formData.restrictions.split(',').map(r => `- ${r.trim()}`).join('\n')}

Output: ${formData.output}

Style: ${formData.style}`;
    
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copied!');
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#ECEDE5] mb-3">Prompt Architect</h2>
        <p className="text-[#ECEDE5]/60">Craft structurally perfect prompts using the RTCROS method.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <InputGroup 
            label="Role" 
            desc="Who is the AI acting as?" 
            placeholder="e.g., Senior Python Developer" 
            value={formData.role} 
            onChange={(v) => handleChange('role', v)}
            icon={<Icons.Briefcase size={16} />}
          />
          <InputGroup 
            label="Task" 
            desc="What specific action should it take?" 
            placeholder="e.g., Write a script to scrape data" 
            value={formData.task} 
            onChange={(v) => handleChange('task', v)}
            icon={<Icons.Check size={16} />}
          />
          <InputGroup 
            label="Context" 
            desc="Background info or target audience?" 
            placeholder="e.g., The user is a beginner" 
            value={formData.context} 
            onChange={(v) => handleChange('context', v)}
            icon={<Icons.BookOpen size={16} />}
          />
          <InputGroup 
            label="Restrictions" 
            desc="What should it avoid? (Comma separated)" 
            placeholder="e.g., No external libraries, keep it under 50 lines" 
            value={formData.restrictions} 
            onChange={(v) => handleChange('restrictions', v)}
            icon={<Icons.Filter size={16} />}
          />
          <InputGroup 
            label="Output Format" 
            desc="How should the result look?" 
            placeholder="e.g., Markdown code block with comments" 
            value={formData.output} 
            onChange={(v) => handleChange('output', v)}
            icon={<Icons.Layers size={16} />}
          />
          <InputGroup 
            label="Style" 
            desc="Tone and voice?" 
            placeholder="e.g., Professional, concise, encouraging" 
            value={formData.style} 
            onChange={(v) => handleChange('style', v)}
            icon={<Icons.Sparkles size={16} />}
          />

          <div className="pt-4" onClick={handleGenerate}>
            <GlowingButton isActive={true} className="w-full">
               Generate Structure
            </GlowingButton>
          </div>
        </div>

        <div className="relative">
           <div className="sticky top-6">
              <label className="text-xs font-bold text-[#C16845] uppercase tracking-wider mb-4 block flex items-center gap-2">
                 <Icons.Cpu size={14}/> Live Preview
              </label>
              <div 
                className="w-full h-[650px] rounded-[30px] p-8 font-mono text-sm text-[#ECEDE5]/90 relative overflow-hidden"
                style={{
                  background: '#4F373B',
                  boxShadow: 'inset 10px 10px 20px #352528, inset -10px -10px 20px #69494e'
                }}
              >
                {generatedPrompt ? (
                  <textarea 
                    className="w-full h-full bg-transparent resize-none focus:outline-none custom-scrollbar"
                    value={generatedPrompt}
                    readOnly
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#ECEDE5]/30">
                    <Icons.Sparkles size={48} className="mb-4 opacity-50" />
                    <p>Fill the form to generate structure</p>
                  </div>
                )}
                
                {generatedPrompt && (
                  <button 
                    onClick={copyToClipboard}
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#C16845] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Icons.Copy size={24} />
                  </button>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, desc, placeholder, value, onChange, icon }: any) => (
  <div 
    className="p-5 rounded-2xl transition-all duration-300 focus-within:translate-x-2"
    style={{
        background: '#4F373B',
        boxShadow: '8px 8px 16px #3a292c, -8px -8px 16px #64454a'
    }}
  >
    <label className="flex items-center gap-2 text-sm font-bold text-[#ECEDE5] mb-1">
      <span className="text-[#BB7287]">{icon}</span>
      {label}
    </label>
    <p className="text-xs text-[#ECEDE5]/50 mb-3">{desc}</p>
    <input 
      type="text" 
      className="w-full bg-transparent text-[#ECEDE5] focus:outline-none placeholder-[#ECEDE5]/20 border-b border-[#ECEDE5]/10 focus:border-[#C16845] py-1 transition-colors"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Builder;