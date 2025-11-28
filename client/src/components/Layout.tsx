import React, { useState, useEffect } from 'react';
import { Compass, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLogoClick: () => void;
}

export default function Layout({ children, onLogoClick }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // 1. BASE BACKGROUND: Very Dark Slate/Blue (Almost Black)
    <div className="min-h-screen bg-[#020617] font-sans text-white relative overflow-x-hidden selection:bg-[#FF8040] selection:text-white">
      
      {/* --- CREATIVE BACKGROUND LAYERS --- */}
      
      {/* Top Left: Deep Primary Blue Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#001BB7] rounded-full blur-[120px] opacity-20 -z-10 pointer-events-none mix-blend-screen" />
      
      {/* Center Right: Bright Blue Highlight */}
      <div className="fixed top-[20%] right-[-5%] w-[600px] h-[600px] bg-[#0046FF] rounded-full blur-[100px] opacity-10 -z-10 pointer-events-none mix-blend-screen" />
      
      {/* Bottom Left: Orange Accent Glow (Subtle) */}
      <div className="fixed bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[#FF8040] rounded-full blur-[120px] opacity-10 -z-10 pointer-events-none mix-blend-screen" />
      
      {/* ---------------------------------- */}

      {/* NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b
          ${isScrolled 
            ? 'bg-[#0F172A]/100 backdrop-blur-md border-white/5 shadow-lg py-3' 
            : 'bg-[#0F172A]/100 transparent border-transparent py-3'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LEFT: LOGO */}
          <button 
            onClick={onLogoClick} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group"
          >
            <div className="relative bg-white/5 p-2.5 rounded-xl border border-white/10 shadow-lg group-hover:bg-white/10 transition-all duration-300">
              <Compass className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF8040] rounded-full z-20 animate-pulse"></div>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              Smart Advisors
            </h1>
          </button>

          {/* RIGHT: GITHUB LINK */}
          <a 
            href="https://github.com/krm3798/SmartAdvisors" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#0046FF]/50 transition-all group text-white"
          >
            <span className="text-sm font-bold hidden sm:block group-hover:text-[#0046FF] transition-colors">GitHub</span>
            <Github className="w-5 h-5 group-hover:text-[#0046FF] transition-colors" />
          </a>

        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-36 px-4 pb-12">
        {children}
      </main>
    </div>
  );
}