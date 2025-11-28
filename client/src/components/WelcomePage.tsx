import { ArrowRight, GraduationCap, Sparkles, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#FF8040] font-bold text-sm mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 fill-[#FF8040]" />
          <span className="text-white/90">Exclusively for UTA Students</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Plan Your Perfect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8040] to-white">
            Semester
          </span>
        </h1>

        <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
          Stop guessing. We analyze your <strong>UTA transcript</strong> to identify the classes you've already completed, determine exactly what you are eligible to take next, and match you with the best professors for your learning style.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#FF8040] text-white text-xl font-bold rounded-2xl shadow-xl shadow-[#FF8040]/20 hover:shadow-2xl hover:bg-[#ff925c] transition-all"
        >
          Get Started Now
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Dark Glass Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-[#FF8040]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Transcript Analysis</h3>
            <p className="text-white/60 text-sm">We automatically detect your completed courses to filter out what you don't need.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-[#FF8040]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Professor Matching</h3>
            <p className="text-white/60 text-sm">Find teachers who match your vibe—easy grader, caring, or strict.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-[#FF8040]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Eligibility</h3>
            <p className="text-white/60 text-sm">We only show classes you are eligible for based on prerequisites.</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}