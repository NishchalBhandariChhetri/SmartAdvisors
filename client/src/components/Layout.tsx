import React, { useState, useEffect } from 'react';
import { Compass, Github } from 'lucide-react'; // Added Github icon

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
    <div className="min-h-screen bg-[#F5F1DC] font-sans text-[#001BB7]">
      
      {/* NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b
          ${isScrolled 
            ? 'bg-[#F5F1DC]/50 backdrop-blur-sm border-[#001BB7]/10 shadow-sm py-3' 
            : 'bg-transparent border-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LEFT: LOGO */}
          <button 
            onClick={onLogoClick} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group"
          >
            <div className="relative bg-gradient-to-tr from-[#001BB7] to-[#0046FF] p-2.5 rounded-xl shadow-lg shadow-[#0046FF]/20 group-hover:shadow-[#FF8040]/20 transition-all duration-300">
              <Compass className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF8040] rounded-full z-20 animate-pulse"></div>
            </div>

            <h1 className="text-xl font-bold text-[#001BB7] tracking-tight group-hover:text-[#0046FF] transition-colors">
              Smart Advisors
            </h1>
          </button>

          {/* RIGHT: GITHUB LINK */}
          <a 
            href="https://github.com/krm3798/SmartAdvisors" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#001BB7]/10 bg-white/50 hover:bg-white hover:border-[#001BB7]/30 hover:shadow-md transition-all group"
          >
            <span className="text-sm font-bold text-[#001BB7] hidden sm:block group-hover:text-[#0046FF]">GitHub</span>
            <Github className="w-5 h-5 text-[#001BB7] group-hover:text-[#0046FF]" />
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