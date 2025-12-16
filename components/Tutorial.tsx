import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from './Icon';
import { GlowingButton } from './Button';

export interface TutorialStep {
  targetId?: string; // If undefined, modal is centered
  title: string;
  description: string;
  onEnter?: () => void; // Action to perform when step starts (e.g., switch tab)
}

interface TutorialProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ steps, isActive, onComplete, onSkip }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [tooltipPosition, setTooltipPosition] = useState<React.CSSProperties>({});
  const [hasValidTarget, setHasValidTarget] = useState(false);
  
  const currentStep = steps[currentStepIndex];

  // Helper to calculate positions
  const updatePositions = useCallback(() => {
    // Default: Center styling
    const setCentered = () => {
      setHasValidTarget(false);
      setSpotlightStyle({
        opacity: 0,
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        position: 'fixed',
        pointerEvents: 'none'
      });
      setTooltipPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        zIndex: 61, // Ensure it's above the backdrop (z-50)
        width: '90vw',
        maxWidth: '450px'
      });
    };

    if (!currentStep.targetId) {
      setCentered();
      return;
    }

    const element = document.getElementById(currentStep.targetId);
    
    // Check if element exists and is visible (has dimensions and is not hidden)
    if (element && element.offsetParent !== null && element.getBoundingClientRect().height > 0) {
      const rect = element.getBoundingClientRect();
      const padding = 10;
      
      setHasValidTarget(true);
      setSpotlightStyle({
        opacity: 1,
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2),
        position: 'fixed',
        borderRadius: '16px',
        boxShadow: '0 0 0 9999px rgba(80, 100, 103, 0.9)', // The overlay dimming
        zIndex: 60,
        transition: 'all 0.4s ease-in-out',
        pointerEvents: 'none'
      });

      // Calculate simple tooltip position (below by default, above if too low)
      const tooltipTop = rect.bottom + 20;
      // Check if tooltip would go off screen bottom (approx height 250px)
      const isTooLow = tooltipTop + 250 > window.innerHeight;
      
      setTooltipPosition({
        top: isTooLow ? rect.top - 20 : rect.bottom + 20,
        left: rect.left + (rect.width / 2),
        transform: `translateX(-50%) ${isTooLow ? 'translateY(-100%)' : ''}`,
        position: 'fixed',
        zIndex: 61,
        width: '90vw',
        maxWidth: '400px'
      });
    } else {
      // Fallback if target exists but is hidden (e.g. mobile menu items)
      setCentered();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      // Execute any side effects for the step (like tab switching)
      if (currentStep.onEnter) {
        currentStep.onEnter();
        // Allow time for DOM to update if tab changed
        const timer = setTimeout(updatePositions, 300); // Increased timeout slightly for reliability
        return () => clearTimeout(timer);
      } else {
        updatePositions();
      }
    }
  }, [currentStepIndex, isActive, currentStep, updatePositions]);

  // Handle Resize
  useEffect(() => {
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [updatePositions]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Background Overlay (Spotlight) - Only visible when we have a valid target */}
      <div 
        className="pointer-events-none transition-all duration-300"
        style={spotlightStyle}
      />
      
      {/* Full Screen Dimmer - Visible when NO valid target (Centered mode fallback) */}
      {!hasValidTarget && (
        <div className="fixed inset-0 bg-[#506467]/90 z-50 transition-opacity duration-300 animate-in fade-in"></div>
      )}

      {/* Tooltip Card */}
      <div 
        className="p-6 rounded-[30px] shadow-2xl transition-all duration-300 flex flex-col"
        style={{
          ...tooltipPosition,
          background: '#4F373B',
          boxShadow: '20px 20px 60px #2a3536, -20px -20px 60px #769398',
          border: '1px solid rgba(236, 237, 229, 0.1)'
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C16845] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {currentStepIndex + 1}/{steps.length}
            </div>
            <h3 className="text-xl font-bold text-[#ECEDE5] leading-tight">{currentStep.title}</h3>
          </div>
          <button onClick={onSkip} className="text-[#ECEDE5]/40 hover:text-[#ECEDE5] text-xs font-bold uppercase tracking-wider p-2">
            Skip
          </button>
        </div>
        
        <p className="text-[#ECEDE5]/70 mb-8 leading-relaxed text-sm">
          {currentStep.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <button 
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1 text-sm font-bold transition-opacity ${currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-[#ECEDE5]/60 hover:text-[#ECEDE5]'}`}
          >
            <Icons.ArrowRight size={16} className="rotate-180" /> Back
          </button>

          <GlowingButton onClick={handleNext} className="py-2 px-6 text-sm">
             {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          </GlowingButton>
        </div>
      </div>
    </>
  );
};