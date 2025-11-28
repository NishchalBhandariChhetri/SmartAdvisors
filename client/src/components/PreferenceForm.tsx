import React, { useState } from 'react';
import { Settings, ThumbsUp, GraduationCap, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Preferences {
  easyGrader: boolean;
  caring: boolean;
  testHeavy: boolean;
  attendanceStrict: boolean;
}

interface PreferenceFormProps {
  onGenerateSchedule: (prefs: Preferences) => void;
  isLoading: boolean;
  onBack: () => void;
}

export default function PreferenceForm({ onGenerateSchedule, isLoading, onBack }: PreferenceFormProps) {
  const [prefs, setPrefs] = useState<Preferences>({
    easyGrader: true,
    caring: true,
    testHeavy: false,
    attendanceStrict: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button (Reduced Margin) */}
      <button onClick={onBack} className="mb-2 text-[#001BB7]/60 hover:text-[#001BB7] flex items-center gap-2 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl shadow-[#001BB7]/10 border border-white overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#001BB7] to-[#0046FF] p-8 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-3xl font-bold tracking-tight">Customize Your Schedule</h2>
                <p className="text-blue-100 mt-2 text-lg font-medium">Tell us what matters most in a professor</p>
            </div>
        </div>

        <div className="p-8 bg-white">
            {/* POSITIVE */}
            <div className="mb-8">
                <h3 className="text-[#001BB7] font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#0046FF]/10 rounded-lg"><ThumbsUp className="w-5 h-5 text-[#0046FF]" /></div>
                    What do you prioritize?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.easyGrader ? 'border-[#0046FF] bg-[#0046FF]/5' : 'border-[#F5F1DC] bg-[#F5F1DC]/50 hover:border-[#0046FF]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="easyGrader" checked={prefs.easyGrader} onChange={handleChange} className="w-5 h-5 rounded text-[#0046FF] focus:ring-[#0046FF]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Easy Graders</span><span className="text-sm text-[#001BB7]/60">Prioritize high GPAs</span></div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.caring ? 'border-[#0046FF] bg-[#0046FF]/5' : 'border-[#F5F1DC] bg-[#F5F1DC]/50 hover:border-[#0046FF]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="caring" checked={prefs.caring} onChange={handleChange} className="w-5 h-5 rounded text-[#0046FF] focus:ring-[#0046FF]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Caring & Respected</span><span className="text-sm text-[#001BB7]/60">Inspirational professors</span></div>
                    </label>
                </div>
            </div>

            <div className="border-t border-[#001BB7]/10 my-8"></div>

            {/* TOLERANCES */}
            <div className="mb-8">
                <h3 className="text-[#001BB7] font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-[#FF8040]/10 rounded-lg"><GraduationCap className="w-5 h-5 text-[#FF8040]" /></div>
                    What are you okay with?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.testHeavy ? 'border-[#FF8040] bg-[#FF8040]/5' : 'border-[#F5F1DC] bg-[#F5F1DC]/50 hover:border-[#FF8040]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="testHeavy" checked={prefs.testHeavy} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Test Heavy</span><span className="text-sm text-[#001BB7]/60">Heavy exams okay</span></div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm ${prefs.attendanceStrict ? 'border-[#FF8040] bg-[#FF8040]/5' : 'border-[#F5F1DC] bg-[#F5F1DC]/50 hover:border-[#FF8040]/30'}`}>
                        <div className="pt-0.5"><input type="checkbox" name="attendanceStrict" checked={prefs.attendanceStrict} onChange={handleChange} className="w-5 h-5 rounded text-[#FF8040] focus:ring-[#FF8040]" /></div>
                        <div><span className="font-bold text-[#001BB7] block">Strict Attendance</span><span className="text-sm text-[#001BB7]/60">Attendance is fine</span></div>
                    </label>
                </div>
            </div>

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