import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

export const GlowingButton: React.FC<ButtonProps> = ({ children, isActive, className, ...props }) => {
  return (
    <button
      className={`relative group overflow-hidden rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 py-4 px-6 ${className || ''}`}
      style={{
        background: '#4F373B',
        boxShadow: isActive 
          ? 'inset 6px 6px 12px #352528, inset -6px -6px 12px #69494e' // Pressed state (Inset)
          : '8px 8px 16px #352528, -8px -8px 16px #69494e', // Normal state (Outset)
        color: isActive ? '#C16845' : '#ECEDE5',
        border: 'none'
      }}
      {...props}
    >
      {/* Hover Highlight Overlay */}
      <div className={`absolute inset-0 bg-[#C16845] transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-5' : 'opacity-0 group-hover:opacity-5'}`}></div>
      
      {/* Content */}
      <span className={`relative z-10 transition-colors flex items-center justify-center gap-2 tracking-wide ${isActive ? 'text-[#C16845]' : 'group-hover:text-[#C16845]'}`}>
        {children}
      </span>
    </button>
  );
};