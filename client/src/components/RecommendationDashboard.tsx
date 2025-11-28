import { useState, useEffect } from 'react';
import { Star, TrendingUp, BookOpen, Loader2, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

type PreferencesType = {
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
};

interface Professor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
  matchScore: number;
  schedule: string;
  classSize: string;
  assessmentType: string;
  attendance: string;
  tags: string[]; 
}

interface ClassData {
  courseCode: string;
  courseName: string;
  professors: Professor[];
}

interface RecommendationDashboardProps {
  userData: {
    preferences: PreferencesType;
    recommendations: ClassData[];
  };
  onBack: () => void;
}

export default function RecommendationDashboard({ userData, onBack }: RecommendationDashboardProps) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.recommendations) {
      setClasses(userData.recommendations);
      setIsLoading(false);
    }
  }, [userData]);

  const visibleClasses = classes.filter((c) => c.professors.length > 0);

  const totalCourses = visibleClasses.length;
  const totalProfessors = visibleClasses.reduce((sum, c) => sum + c.professors.length, 0);

  // --- DARK MODE COLORS ---
  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return 'text-slate-300 bg-slate-800/50 border-slate-700';
    const d = difficulty.toLowerCase();
    if (d.includes('easy')) return 'text-emerald-300 bg-emerald-900/40 border-emerald-800';
    if (d.includes('medium') || d.includes('moderate')) return 'text-amber-300 bg-amber-900/40 border-amber-800';
    if (d.includes('hard') || d.includes('challenging')) return 'text-rose-300 bg-rose-900/40 border-rose-800';
    return 'text-slate-300 bg-slate-800/50 border-slate-700';
  };

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('easy') || t.includes('amazing') || t.includes('respected') || t.includes('clear') || t.includes('extra')) {
      return 'bg-[#0046FF]/20 text-blue-200 border-[#0046FF]/30';
    }
    if (t.includes('tough') || t.includes('heavy') || t.includes('strict') || t.includes('pop')) {
      return 'bg-[#FF8040]/20 text-orange-200 border-[#FF8040]/30';
    }
    return 'bg-white/5 text-slate-300 border-white/10';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80 font-medium text-lg">Curating your perfect schedule...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Preferences
      </button>

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
          Your Recommendations <Sparkles className="w-8 h-8 text-[#FF8040] fill-[#FF8040]" />
        </h2>
        <p className="text-white/80 text-xl font-medium">
          Found <span className="font-bold text-[#FF8040]">{totalProfessors} professors</span> across <span className="font-bold text-white">{totalCourses} courses</span>.
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Courses</p>
                  <p className="text-3xl font-bold text-white">{totalCourses}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full text-white"><BookOpen className="w-6 h-6" /></div>
          </div>

          <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Professors</p>
                  <p className="text-3xl font-bold text-white">{totalProfessors}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full text-white"><TrendingUp className="w-6 h-6" /></div>
          </div>
      </div>

      {visibleClasses.length === 0 ? (
          <div className="text-center py-20">
              <p className="text-white/60 text-lg">No classes found matching your criteria.</p>
          </div>
      ) : (
        <>
          {/* HORIZONTAL CLASS SCROLL */}
          <div className="overflow-x-auto pb-12 no-scrollbar">
            <div className="flex gap-8 min-w-min px-2">
              {visibleClasses.map((classData, index) => (
                <motion.div
                  key={classData.courseCode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-96 bg-black/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh]"
                >
                  {/* Class Header */}
                  <div className="bg-[#0046FF]/10 px-6 py-5 border-b border-white/10 flex-shrink-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xl font-bold text-white">{classData.courseCode}</h3>
                      <span className="text-xs font-bold bg-[#0046FF] text-white px-2 py-1 rounded-full border border-white/10">
                          {classData.professors.length} Options
                      </span>
                    </div>
                    <p className="text-white/60 font-medium text-sm truncate" title={classData.courseName}>
                      {classData.courseName}
                    </p>
                  </div>

                  {/* VERTICAL PROFESSOR LIST */}
                  <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar flex-grow">
                    {classData.professors.map((professor, profIndex) => {
                      const isBestMatch = profIndex === 0;

                      return (
                        <motion.div
                          key={professor.id}
                          whileHover={{ y: -2 }}
                          className={`
                            relative rounded-2xl p-5 transition-all group border
                            ${isBestMatch 
                                ? 'bg-[#FF8040]/10 border-[#FF8040] shadow-lg shadow-[#FF8040]/10 z-10 scale-[1.02]' 
                                : 'bg-[#0046FF]/10 border-white/5 hover:border-[#0046FF] hover:bg-[#0046FF]/20'
                            }
                          `}
                        >
                          {/* TROPHY BADGE */}
                          {isBestMatch && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF8040] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border-2 border-[#001BB7] z-20">
                                <Trophy className="w-3 h-3 fill-white" /> Top Match
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-3 mt-1">
                            <div className="w-full">
                              <h4 className="font-bold text-white text-lg leading-tight mb-2 truncate" title={professor.name}>
                                {professor.name}
                              </h4>
                              
                              <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-sm font-bold border ${professor.rating > 0 ? 'bg-[#FF8040]/20 text-[#FF8040] border-[#FF8040]/30' : 'bg-white/10 text-white/40 border-white/10'}`}>
                                  <Star className={`w-3.5 h-3.5 ${professor.rating > 0 ? 'fill-[#FF8040] text-[#FF8040]' : 'text-gray-500'}`} />
                                  {professor.rating > 0 ? professor.rating : "N/A"}
                                </div>

                                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getDifficultyColor(professor.difficulty)}`}>
                                  Diff: {professor.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {professor.tags && professor.tags.length > 0 ? (
                                professor.tags.slice(0, 4).map((tag, i) => (
                                    <span key={i} className={`px-2 py-1 rounded-md text-[11px] font-bold border ${getTagStyle(tag)}`}>
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-white/30 italic py-1">No attributes</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-white/40 font-bold">
              Scroll right for more classes →
          </div>
        </>
      )}
    </div>
  );
}