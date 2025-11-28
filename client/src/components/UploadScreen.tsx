import React from 'react';
import { UploadCloud, FileText, ArrowRight, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadScreenProps {
  file: File | null;
  department: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDepartment: (dept: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function UploadScreen({ file, department, onFileChange, setDepartment, onNext, onBack }: UploadScreenProps) {
  return (
    <div className="max-w-xl mx-auto">
      {/* Back Button */}
      <button onClick={onBack} className="mb-2 text-[#001BB7]/60 hover:text-[#001BB7] flex items-center gap-2 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-[#001BB7]/10 border border-white p-10 text-center"
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-[#0046FF]/10 text-[#0046FF]'}`}>
          {file ? <CheckCircle className="w-10 h-10" /> : <UploadCloud className="w-10 h-10" />}
        </div>
        
        <h1 className="text-3xl font-bold text-[#001BB7] mb-3">
            {file ? "Transcript Loaded!" : "Upload Transcript"}
        </h1>
        <p className="text-[#001BB7]/70 mb-8 text-lg">
            {file ? "We are ready to analyze your courses." : "We need your unofficial transcript (PDF) to see what you've taken."}
        </p>

        {/* Upload Box */}
        <div className={`group relative border-2 border-dashed rounded-2xl p-10 mb-6 transition-all cursor-pointer 
          ${file 
            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100/50' 
            : 'border-[#001BB7]/20 hover:border-[#FF8040] hover:bg-[#FF8040]/5'
          }`}
        >
          <input type="file" accept=".pdf" onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="flex flex-col items-center pointer-events-none">
            {/* Inner Icon */}
            <div className={`p-4 rounded-full shadow-sm mb-3 transition-transform group-hover:scale-110 
              ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-[#001BB7]/40'}`}
            >
                {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            
            {/* Status Text */}
            <span className={`text-base font-bold transition-colors 
              ${file ? 'text-emerald-700' : 'text-[#0046FF] group-hover:text-[#FF8040]'}`}
            >
              {file ? file.name : "Click to browse or drag PDF"}
            </span>
          </div>
        </div>

        {/* RESTORED: Instructions / UTA Link */}
        <div className="bg-[#0046FF]/5 rounded-xl p-4 mb-8 border border-[#0046FF]/10 text-left">
            <h4 className="text-[#001BB7] font-bold text-sm mb-1 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> How to get your transcript?
            </h4>
            <p className="text-[#001BB7]/70 text-sm leading-relaxed">
                Log into MyMav, go to <strong>Academic Records</strong>, and select <strong>View Unofficial Transcript</strong>. Save it as a PDF and upload it here.
                <br/>
                <a href="https://www.uta.edu/academics/records/transcripts" target="_blank" rel="noopener noreferrer" className="text-[#0046FF] font-bold hover:underline mt-1 inline-block">
                    View Official Guide &rarr;
                </a>
            </p>
        </div>

        <div className="mb-8 text-left">
          <label className="block text-sm font-bold text-[#001BB7] mb-2 ml-1">Major / Department</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-4 bg-[#F5F1DC] border border-[#001BB7]/10 rounded-xl focus:ring-2 focus:ring-[#0046FF] outline-none transition-all font-bold text-[#001BB7]">
            <option value="CE">Civil Engineering (CE)</option>
            <option value="CSE">Computer Science (CSE)</option>
          </select>
        </div>

        <button onClick={onNext} disabled={!file} className="w-full bg-[#0046FF] hover:bg-[#001BB7] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0046FF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg group">
          Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}