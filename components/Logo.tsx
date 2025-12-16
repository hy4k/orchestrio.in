import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icons } from './Icon';

interface LogoProps {
  className?: string;
  // Variant is kept for backward compatibility but effectively we just return the image
  variant?: 'full' | 'icon'; 
}

// Incremented to v2 to force new logo generation
const LOGO_STORAGE_KEY = 'orchestrio_logo_v2';

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", variant = 'icon' }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) {
      setLogoUrl(savedLogo);
    } else {
      generateLogo();
    }
  }, []);

  const generateLogo = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'Create a cute, simple, and brilliant logo icon for an AI platform named "Orchestrio". The design should be a single, glowing, abstract shape that looks like a friendly spark or a simplified musical note. Style: Minimalist flat vector art, rounded soft geometry. Primary color: #C16845 (Terracotta Orange). Background: Dark #4F373B. No text inside the image. High contrast.',
            },
          ],
        },
      });

      // Find the image part
      let base64Image = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (base64Image) {
        const url = `data:image/png;base64,${base64Image}`;
        setLogoUrl(url);
        localStorage.setItem(LOGO_STORAGE_KEY, url);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to generate logo", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#4F373B] rounded-2xl animate-pulse ring-2 ring-[#C16845]/20`}>
        <Icons.Sparkles className="text-[#C16845] animate-spin-slow" size={24} />
      </div>
    );
  }

  if (error || !logoUrl) {
    // Fallback logo
    return (
      <div className={`${className} flex items-center justify-center bg-[#C16845] rounded-2xl text-white shadow-lg`}>
        <Icons.Sparkles size={24} />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-[#C16845] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-2xl"></div>
      <img 
        src={logoUrl} 
        alt="Orchestrio Logo" 
        className={`${className} relative rounded-2xl shadow-2xl object-cover border border-[#C16845]/30`} 
      />
    </div>
  );
};

export default Logo;