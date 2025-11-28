import React, { useState } from 'react';
import { Settings, ThumbsUp, Calendar, Loader2, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Preferences {
  extraCredit: boolean;
  clearGrading: boolean;
  goodFeedback: boolean;
  caring: boolean;
  lectureHeavy: boolean;
  groupProjects: boolean;
  testHeavy: boolean;
  homeworkHeavy: boolean;
  strictAttendance: boolean;
  popQuizzes: boolean;
}

interface PreferenceFormProps {
  onGenerateSchedule: (prefs: Preferences) => void;
  isLoading: boolean;
  onBack: () => void;
}

export default function PreferenceForm({ onGenerateSchedule, isLoading, onBack }: PreferenceFormProps) {
  const [prefs, setPrefs] = useState<Preferences>({
    extraCredit: true,
    clearGrading: true,
    goodFeedback: true,
    caring: true,
    lectureHeavy: true,
    groupProjects: false,
    testHeavy: false,
    homeworkHeavy: false,
    strictAttendance: false,
    popQuizzes: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-4 text-white/60 hover:text-white flex items-center gap-2 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="bg-[#0046FF]/10 p-8 text-center relative border-b border-white/10">
            <div className="relative z-10">
                <Settings className="w-12 h-12 mx-auto mb-3 text-white opacity-90" />
                <h2 className="text-3xl font-bold tracking-tight text-white">Design Your Semester</h2>
                <p className="text-white/60 mt-2 text-lg font-medium">Select what matters, and we'll find the match.</p>
            </div>
        </div>

        <div className="p-8 space-y-10">
            {/* 1. PRIORITIES */}
            <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#0046FF]/20 rounded-lg"><ThumbsUp className="w-5 h-5 text-[#0046FF]" /></div>
                    Your Priorities
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { id: 'extraCredit', label: 'Extra Credit', desc: 'Boost your GPA' },
                        { id: 'clearGrading', label: 'Clear Grading', desc: 'Know how to get an A' },
                        { id: 'goodFeedback', label: 'Good Feedback', desc: 'Helpful comments' },
                        { id: 'caring', label: 'Caring', desc: 'Accessible & kind' },
                    ].map((item) => (
                        <label key={item.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs[item.id as keyof Preferences] ? 'border-[#0046FF] bg-[#0046FF]/20' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                            <div className="pt-0.5"><input type="checkbox" name={item.id} checked={prefs[item.id as keyof Preferences]} onChange={handleChange} className="w-5 h-5 rounded text-[#0046FF] focus:ring-[#0046FF]" /></div>
                            <div><span className="font-bold text-white block">{item.label}</span><span className="text-sm text-white/50">{item.desc}</span></div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 2. LEARNING STYLE */}
            <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#FF8040]/20 rounded-lg"><BookOpen className="w-5 h-5 text-[#FF8040]" /></div>
                    Teaching Style
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.lectureHeavy ? 'border-[#FF8040] bg-[#FF8040]/20' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="lectureHeavy" checked={prefs.lectureHeavy} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-white block">Amazing Lectures</span><span className="text-sm text-white/50">I learn by listening</span></div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.groupProjects ? 'border-[#FF8040] bg-[#FF8040]/20' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="groupProjects" checked={prefs.groupProjects} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-white block">Group Projects</span><span className="text-sm text-white/50">I like collaboration</span></div>
                    </label>
                </div>
            </div>

            {/* 3. TOLERANCES */}
            <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-red-500/20 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                    What are you okay with?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { id: 'testHeavy', label: 'Test Heavy', desc: 'Few grades, mostly exams' },
                        { id: 'homeworkHeavy', label: 'Lots of Homework', desc: 'Frequent assignments' },
                        { id: 'strictAttendance', label: 'Strict Attendance', desc: 'Mandatory attendance' },
                        { id: 'popQuizzes', label: 'Pop Quizzes', desc: 'Be ready anytime' },
                    ].map((item) => (
                        <label key={item.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs[item.id as keyof Preferences] ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                            <div className="pt-0.5"><input type="checkbox" name={item.id} checked={prefs[item.id as keyof Preferences]} onChange={handleChange} className="w-5 h-5 rounded text-red-500 focus:ring-red-500" /></div>
                            <div><span className="font-bold text-white block">{item.label}</span><span className="text-sm text-white/50">{item.desc}</span></div>
                        </label>
                    ))}
                </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onGenerateSchedule(prefs)}
              disabled={isLoading}
              className="w-full bg-[#0046FF] hover:bg-[#0036CC] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0046FF]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>Matching  <Loader2 className="animate-spin w-5 h-5"/></>
              ) : (
                <>Find My Perfect Matches</>
              )}
            </motion.button>
        </div>
      </motion.div>
    </div>
  );
}