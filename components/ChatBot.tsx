import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Icons } from './Icon';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are "Orchestrio Architect", an advanced AI assistant for the "orchestrio.in" application. 

Your goal is to help users craft perfect AI prompts using the RTCROS framework:
1. Role (Who is the AI?)
2. Task (What must be done?)
3. Context (Background info?)
4. Restrictions (What to avoid?)
5. Output (Format?)
6. Style (Tone/Voice?)

If a user asks for help with a prompt, guide them through this structure or generate a prompt for them using this format.
Be concise, professional, and use a tone that fits a high-tech, futuristic application.
Do not use markdown bolding too heavily, keep it clean.`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Greetings. I am the Orchestrio Architect. How can I assist you in crafting the perfect prompt today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.slice(1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      // Add empty model message to start streaming into
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
          ));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I encountered a neural disruption. Please try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{ id: 'init', role: 'model', text: "Memory purged. Ready for new architectural parameters." }]);
  };

  return (
    <div className={`fixed z-50 flex flex-col items-end ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-6 right-6'}`}>
      
      {/* Chat Window */}
      <div 
        className={`transition-all duration-300 ease-in-out origin-bottom-right overflow-hidden flex flex-col ${
          isOpen 
            ? 'w-full h-full sm:w-[400px] sm:h-[500px] opacity-100 scale-100 sm:mb-4 rounded-none sm:rounded-[30px]' 
            : 'w-0 h-0 opacity-0 scale-90 mb-0'
        }`}
        style={{
          background: '#4F373B',
          boxShadow: '20px 20px 60px #2a3536, -20px -20px 60px #769398',
          border: isOpen && window.innerWidth < 640 ? 'none' : '1px solid rgba(236, 237, 229, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-4 bg-[#506467]/50 backdrop-blur-md flex items-center justify-between border-b border-[#ECEDE5]/10 pt-safe-top">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C16845] animate-pulse"></div>
            <span className="font-bold text-[#ECEDE5] tracking-widest text-sm uppercase">Orchestrio Architect</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={resetChat}
              className="text-[#ECEDE5]/50 hover:text-[#C16845] transition-colors p-1"
              title="Reset Context"
            >
              <Icons.RefreshCw size={14} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-[#ECEDE5]/50 hover:text-[#C16845] p-1"
            >
              <Icons.X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-[#506467] ${
                  msg.role === 'user' ? 'bg-[#C16845] text-white' : 'bg-[#506467] text-[#C16845]'
                }`}
              >
                {msg.role === 'user' ? <Icons.User size={14} /> : <Icons.Cpu size={14} />}
              </div>
              
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#C16845] text-white rounded-tr-none shadow-lg' 
                    : 'bg-[#506467] text-[#ECEDE5] rounded-tl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-[#506467] flex items-center justify-center border-2 border-[#506467] text-[#C16845]">
                 <Icons.Cpu size={14} />
               </div>
               <div className="bg-[#506467] p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-10">
                 <div className="w-1.5 h-1.5 bg-[#ECEDE5]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-[#ECEDE5]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-[#ECEDE5]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#506467]/30 pb-safe-bottom">
          <div 
            className="flex items-center gap-2 p-2 rounded-xl transition-all"
            style={{
               background: '#4F373B',
               boxShadow: 'inset 4px 4px 8px #3a292c, inset -4px -4px 8px #64454a'
            }}
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Orchestrio..."
              className="flex-1 bg-transparent text-[#ECEDE5] text-sm focus:outline-none px-2 placeholder-[#ECEDE5]/30"
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2 rounded-lg transition-all ${
                !inputValue.trim() || isTyping
                  ? 'text-[#ECEDE5]/20 cursor-not-allowed' 
                  : 'text-[#C16845] hover:bg-[#C16845]/10 hover:scale-110 active:scale-95'
              }`}
            >
              <Icons.Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 z-50 ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        style={{
          background: '#C16845',
          boxShadow: '10px 10px 20px rgba(0,0,0,0.4), -10px -10px 20px rgba(255,255,255,0.05)'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        {isOpen ? (
          <Icons.Minimize2 size={24} className="text-white" />
        ) : (
          <Icons.MessageSquare size={24} className="text-white" />
        )}
        
        {/* Notification Dot (fake) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ECEDE5]"></span>
          </span>
        )}
      </button>

    </div>
  );
};

export default ChatBot;