// REMOVED: import React from 'react';
import { ArrowRight, GraduationCap, Sparkles, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  // ... (The rest of your component code remains exactly the same) ...
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-[#0046FF]/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#FF8040]/10 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        {/* Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF8040]/10 border border-[#FF8040]/20 text-[#E37035] font-bold text-sm mb-8"
        >
          <Sparkles className="w-4 h-4 fill-[#FF8040] text-[#FF8040]" />
          <span>Exclusively for UTA Students</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-[#001BB7] tracking-tight mb-6 leading-tight">
          Plan Your Perfect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0046FF] to-[#FF8040]">
            Semester
          </span>
        </h1>

        <p className="text-xl text-[#001BB7]/70 mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop guessing. We analyze your <strong>UTA transcript</strong> to identify the classes you've already completed, determine exactly what you are eligible to take next, and match you with the best professors for your learning style.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#FF8040] text-white text-xl font-bold rounded-2xl shadow-xl shadow-[#FF8040]/30 hover:shadow-2xl hover:bg-[#ff925c] transition-all"
        >
          Get Started Now
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#001BB7]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#0046FF]/10 rounded-xl flex items-center justify-center mb-4 text-[#0046FF]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001BB7] mb-2">MyMav Integration</h3>
            <p className="text-[#001BB7]/60 text-sm">Compatible with standard Unofficial Transcripts exported from MyMav.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#001BB7]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FF8040]/10 rounded-xl flex items-center justify-center mb-4 text-[#FF8040]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001BB7] mb-2">Professor Matching</h3>
            <p className="text-[#001BB7]/60 text-sm">Find teachers who match your vibe—easy grader, caring, or strict.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#001BB7]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#001BB7]/10 rounded-xl flex items-center justify-center mb-4 text-[#001BB7]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001BB7] mb-2">Smart Eligibility</h3>
            <p className="text-[#001BB7]/60 text-sm">We only show classes you are eligible for based on prerequisites.</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}