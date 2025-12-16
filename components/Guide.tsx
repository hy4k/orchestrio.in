import React, { useState } from 'react';
import { Icons } from './Icon';

const Guide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const guideSteps = [
    {
      id: 1,
      title: "The Golden Rule",
      subtitle: "Be Clear & Specific",
      icon: <Icons.Zap size={32} className="text-[#eab308]" />,
      desc: "Imagine the AI is a brilliant student who doesn't know the context. You need to tell it exactly what to do.",
      bad: "Write code for a website.",
      good: "Write a React functional component for a landing page hero section using Tailwind CSS. Include a title, subtitle, and two CTA buttons."
    },
    {
      id: 2,
      title: "The Persona",
      subtitle: "Give it a Role",
      icon: <Icons.User size={32} className="text-[#BB7287]" />,
      desc: "Tell the AI who it should be. This sets the tone, style, and expertise level of the response.",
      bad: "Explain quantum physics.",
      good: "Act as a friendly science teacher for 5th graders. Explain quantum physics using an analogy about spinning tops."
    },
    {
      id: 3,
      title: "Context is King",
      subtitle: "Add Background Info",
      icon: <Icons.BookOpen size={32} className="text-[#3b82f6]" />,
      desc: "The more the AI knows about the situation, the better the answer. Feed it the backstory.",
      bad: "Write an email.",
      good: "I am applying for a Senior Dev job. Write a polite follow-up email to the recruiter 'Sarah' after our interview last Tuesday. Mention my interest in the AI project."
    },
    {
      id: 4,
      title: "Show, Don't Just Tell",
      subtitle: "Few-Shot Examples",
      icon: <Icons.Layers size={32} className="text-[#C16845]" />,
      desc: "Give examples of what you want. The AI will spot the pattern and copy it.",
      bad: "Convert these to JSON.",
      good: "Convert to JSON. \nInput: 'Apple, Red'\nOutput: {fruit: 'Apple', color: 'Red'}\nInput: 'Banana, Yellow'\nOutput: {fruit: 'Banana', color: 'Yellow'}"
    },
    {
      id: 5,
      title: "The Constraints",
      subtitle: "Set Boundaries",
      icon: <Icons.Filter size={32} className="text-[#ec4899]" />,
      desc: "Tell the AI what NOT to do. This prevents it from rambling or using the wrong format.",
      bad: "Summarize this text.",
      good: "Summarize this text in exactly 3 bullet points. Do not use jargon. Keep it under 50 words."
    },
    {
      id: 6,
      title: "Gemini 3 Thinking",
      subtitle: "Reasoning Power",
      icon: <Icons.Brain size={32} className="text-[#a855f7]" />,
      desc: "For complex problems, ask the model to 'think step-by-step' or 'plan before answering'.",
      bad: "Solve this math problem.",
      good: "Solve this problem. First, list the known variables. Then, choose the correct formula. Finally, calculate the result step-by-step."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#C16845] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <h2 className="text-5xl md:text-6xl font-bold text-[#ECEDE5] mb-6 tracking-tight relative z-10">
          Prompt <span className="text-[#C16845]">Mastery</span>
        </h2>
        <p className="text-xl text-[#ECEDE5]/60 max-w-2xl mx-auto relative z-10 leading-relaxed">
          Unlock the true power of AI. It's not magic, it's engineering. 
          Master these 6 concepts to control the output perfectly.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {guideSteps.map((step) => (
          <div 
            key={step.id}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
            className={`group relative p-8 rounded-[40px] transition-all duration-500 cursor-pointer overflow-hidden border border-[#ECEDE5]/5 ${activeStep === step.id ? 'bg-[#4F373B] scale-105 z-10 shadow-2xl ring-1 ring-[#C16845]/50' : 'bg-[#4F373B]/50 hover:bg-[#4F373B] hover:-translate-y-2'}`}
            style={{
              boxShadow: activeStep === step.id 
                ? '20px 20px 60px #2a3536, -20px -20px 60px #60787c' 
                : '10px 10px 30px #354244, -10px -10px 30px #6b868a'
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 rounded-3xl bg-[#506467] shadow-inner group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <span className="text-6xl font-bold text-[#ECEDE5]/5 font-mono select-none absolute top-4 right-6">
                0{step.id}
              </span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-[#ECEDE5] mb-1">{step.title}</h3>
              <p className="text-sm font-bold text-[#C16845] uppercase tracking-widest">{step.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-[#ECEDE5]/70 leading-relaxed mb-8 min-h-[80px]">
              {step.desc}
            </p>

            {/* Interactive Example (Always visible but highlighted on active) */}
            <div className={`space-y-4 transition-all duration-500 ${activeStep === step.id ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
              
              {/* Bad Example */}
              <div className="relative pl-4 border-l-2 border-red-500/30">
                 <div className="text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center gap-1">
                   <Icons.X size={10} /> Weak Prompt
                 </div>
                 <p className="text-sm text-[#ECEDE5]/50 font-mono bg-[#3a292c]/50 p-2 rounded-lg italic">
                   "{step.bad}"
                 </p>
              </div>

              {/* Good Example */}
              <div className="relative pl-4 border-l-2 border-[#C16845]">
                 <div className="text-[10px] font-bold text-[#C16845] uppercase mb-1 flex items-center gap-1">
                   <Icons.Check size={10} /> Pro Prompt
                 </div>
                 <p className="text-sm text-[#ECEDE5] font-mono bg-[#3a292c] p-3 rounded-lg shadow-inner">
                   "{step.good}"
                 </p>
              </div>

            </div>

            {/* Instruction Footer */}
            <div className="mt-6 pt-6 border-t border-[#ECEDE5]/5 flex items-center justify-between opacity-50 text-xs">
               <span className="text-[#ECEDE5]/40 uppercase tracking-widest">Tap to focus</span>
               <Icons.PlusCircle size={14} className={`text-[#ECEDE5] transition-transform duration-300 ${activeStep === step.id ? 'rotate-45' : ''}`} />
            </div>

          </div>
        ))}
      </div>

      {/* Footer / Call to Action */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C16845]/10 border border-[#C16845]/20 text-[#C16845] text-sm font-bold uppercase tracking-widest">
          <Icons.Sparkles size={16} />
          Ready to build?
        </div>
        <p className="mt-4 text-[#ECEDE5]/40 text-sm">
          Head over to the <span className="text-[#ECEDE5] font-bold">Builder</span> tab to apply these techniques with RTCROS.
        </p>
      </div>

    </div>
  );
};

export default Guide;