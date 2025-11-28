import React, { useState } from 'react';
import { Settings, ThumbsUp, GraduationCap, Calendar, Loader2, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- DEFINING THE PREFERENCES INTERFACE ---
export interface Preferences {
  // Must Haves
  extraCredit: boolean;
  clearGrading: boolean;
  goodFeedback: boolean;
  caring: boolean;
  
  // Learning Style
  lectureHeavy: boolean;
  groupProjects: boolean;
  
  // Tolerances (Things to avoid unless checked)
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
  // Initialize all preferences
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
      {/* Back Button */}
      <button onClick={onBack} className="mb-4 text-[#001BB7]/60 hover:text-[#001BB7] flex items-center gap-2 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl shadow-[#001BB7]/10 border border-white overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001BB7] to-[#0046FF] p-8 text-white text-center relative">
            <div className="relative z-10">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-3xl font-bold tracking-tight">Design Your Semester</h2>
                <p className="text-blue-100 mt-2 text-lg font-medium">Select what matters, and we'll find the match.</p>
            </div>
        </div>

        <div className="p-8 bg-white space-y-10">
            
            {/* 1. PRIORITIES (Must Haves) */}
            <div>
                <h3 className="text-[#001BB7] font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#0046FF]/10 rounded-lg"><ThumbsUp className="w-5 h-5 text-[#0046FF]" /></div>
                    Your Priorities
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { id: 'extraCredit', label: 'Extra Credit Opportunities', desc: 'Boost your GPA' },
                        { id: 'clearGrading', label: 'Clear Grading Criteria', desc: 'Know exactly how to get an A' },
                        { id: 'goodFeedback', label: 'Gives Good Feedback', desc: 'Helpful comments on work' },
                        { id: 'caring', label: 'Caring & Respected', desc: 'Accessible and inspirational' },
                    ].map((item) => (
                        <label key={item.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs[item.id as keyof Preferences] ? 'border-[#0046FF] bg-[#0046FF]/5' : 'border-[#F5F1DC] hover:border-[#0046FF]/30'}`}>
                            <div className="pt-0.5"><input type="checkbox" name={item.id} checked={prefs[item.id as keyof Preferences]} onChange={handleChange} className="w-5 h-5 rounded text-[#0046FF] focus:ring-[#0046FF]" /></div>
                            <div><span className="font-bold text-[#001BB7] block">{item.label}</span><span className="text-sm text-[#001BB7]/60">{item.desc}</span></div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#001BB7]/10"></div>

            {/* 2. LEARNING STYLE */}
            <div>
                <h3 className="text-[#001BB7] font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#FF8040]/10 rounded-lg"><BookOpen className="w-5 h-5 text-[#FF8040]" /></div>
                    Teaching Style
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.lectureHeavy ? 'border-[#FF8040] bg-[#FF8040]/5' : 'border-[#F5F1DC] hover:border-[#FF8040]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="lectureHeavy" checked={prefs.lectureHeavy} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Amazing Lectures</span><span className="text-sm text-[#001BB7]/60">I learn by listening</span></div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.groupProjects ? 'border-[#FF8040] bg-[#FF8040]/5' : 'border-[#F5F1DC] hover:border-[#FF8040]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="groupProjects" checked={prefs.groupProjects} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Group Projects</span><span className="text-sm text-[#001BB7]/60">I like collaboration</span></div>
                    </label>
                </div>
            </div>

            <div className="border-t border-[#001BB7]/10"></div>

            {/* 3. TOLERANCES (Red/Danger Zone) */}
            <div>
                <h3 className="text-[#001BB7] font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                    What are you okay with? <span className="text-sm font-normal text-gray-400 ml-2">(Leave unchecked to avoid)</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { id: 'testHeavy', label: 'Test Heavy', desc: 'Few grades, mostly exams' },
                        { id: 'homeworkHeavy', label: 'Lots of Homework', desc: 'Frequent assignments' },
                        { id: 'strictAttendance', label: 'Strict Attendance', desc: 'Skip class? You won\'t pass.' },
                        { id: 'popQuizzes', label: 'Pop Quizzes', desc: 'Be ready anytime' },
                    ].map((item) => (
                        <label key={item.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs[item.id as keyof Preferences] ? 'border-red-400 bg-red-50' : 'border-[#F5F1DC] hover:border-red-200'}`}>
                            <div className="pt-0.5"><input type="checkbox" name={item.id} checked={prefs[item.id as keyof Preferences]} onChange={handleChange} className="w-5 h-5 rounded text-red-600 focus:ring-red-500" /></div>
                            <div><span className="font-bold text-[#001BB7] block">{item.label}</span><span className="text-sm text-[#001BB7]/60">{item.desc}</span></div>
                        </label>
                    ))}
                </div>
            </div>

            {/* GENERATE BUTTON */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onGenerateSchedule(prefs)}
              disabled={isLoading}
              className="w-full bg-[#0046FF] hover:bg-[#001BB7] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0046FF]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>Generating Schedule <Loader2 className="animate-spin w-5 h-5"/></>
              ) : (
                <>Find My Perfect Professors <Calendar className="w-5 h-5" /></>
              )}
            </motion.button>
        </div>
      </motion.div>
    </div>
  );
}