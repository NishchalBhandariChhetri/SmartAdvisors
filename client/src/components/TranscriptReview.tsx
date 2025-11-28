// REMOVED: import React from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptReviewProps {
  courses: string[];
  onNext: () => void;
  onBack: () => void;
}

export default function TranscriptReview({ courses, onNext, onBack }: TranscriptReviewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 text-[#001BB7]/60 hover:text-[#001BB7] flex items-center gap-2 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Upload
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-[#001BB7]/10 border border-white overflow-hidden"
      >
        <div className="bg-[#0046FF]/5 p-8 border-b border-[#0046FF]/10 text-center">
            <div className="w-16 h-16 bg-[#0046FF]/10 text-[#0046FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#001BB7]">Transcript Verified</h2>
            <p className="text-[#001BB7]/70 mt-1">We found <span className="font-bold text-[#0046FF]">{courses.length} courses</span> in your history.</p>
        </div>

        <div className="p-8 bg-[#F5F1DC]/30">
            <p className="text-sm font-bold text-[#001BB7]/40 uppercase tracking-wider mb-4">Completed Courses</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#001BB7]/10 shadow-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="font-bold text-[#001BB7] text-sm">{course}</span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-8 text-[#001BB7]/50 italic">
                        No courses found. Are you sure this is a transcript?
                    </div>
                )}
            </div>

            <button 
                onClick={onNext}
                className="w-full bg-[#0046FF] hover:bg-[#001BB7] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0046FF]/30 transition-all flex items-center justify-center gap-2 text-lg group"
            >
                Looks Good, Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </motion.div>
    </div>
  );
}