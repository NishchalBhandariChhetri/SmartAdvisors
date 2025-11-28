import { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, BookOpen, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

type PreferencesType = {
  easyGrader: boolean;
  caring: boolean;
  testHeavy: boolean;
  attendanceStrict: boolean;
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

  // --- NEW COLOR PALETTE LOGIC ---
  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return 'text-[#001BB7]/60 bg-[#F5F1DC] border-[#001BB7]/20';
    const d = difficulty.toLowerCase();
    if (d.includes('easy')) return 'text-[#0046FF] bg-[#0046FF]/10 border-[#0046FF]/20';
    if (d.includes('medium') || d.includes('moderate')) return 'text-[#FF8040] bg-[#FF8040]/10 border-[#FF8040]/20';
    if (d.includes('hard') || d.includes('challenging')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-[#001BB7]/60 bg-[#F5F1DC] border-[#001BB7]/20';
  };

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    // Good (Blue)
    if (t.includes('easy') || t.includes('amazing') || t.includes('respected') || t.includes('clear')) {
      return 'bg-[#0046FF]/10 text-[#0046FF] border-[#0046FF]/20';
    }
    // Hard (Orange)
    if (t.includes('tough') || t.includes('heavy') || t.includes('strict')) {
      return 'bg-[#FF8040]/10 text-[#FF8040] border-[#FF8040]/20';
    }
    return 'bg-[#F5F1DC] text-[#001BB7] border-[#001BB7]/20';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-12 h-12 text-[#0046FF] animate-spin mx-auto mb-4" />
          <p className="text-[#001BB7] font-medium text-lg">Curating your perfect schedule...</p>
        </motion.div>
      </div>
    );
  }

  const totalCourses = visibleClasses.length;
  const totalProfessors = visibleClasses.reduce((sum, c) => sum + c.professors.length, 0);

  return (
    <div className="max-w-7xl mx-auto">
      
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-[#001BB7]/60 hover:text-[#001BB7] transition-colors font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Preferences
      </button>

      {/* CENTERED HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl font-bold text-[#001BB7] mb-3 flex items-center justify-center gap-3">
          Your Recommendations <Sparkles className="w-8 h-8 text-[#FF8040] fill-[#FF8040]" />
        </h2>
        <p className="text-[#001BB7]/80 text-xl font-medium">
          Found <span className="font-bold text-[#0046FF]">{totalProfessors} professors</span> across <span className="font-bold text-[#0046FF]">{totalCourses} courses</span>.
        </p>
      </motion.div>

      {/* MAIN LAYOUT: HORIZONTAL SCROLLING CLASSES */}
      {visibleClasses.length === 0 ? (
          <div className="text-center py-20">
              <p className="text-[#001BB7]/60 text-lg">No classes found matching your criteria.</p>
          </div>
      ) : (
        <>
          <div className="overflow-x-auto pb-12 no-scrollbar">
            <div className="flex gap-8 min-w-min px-2">
              {visibleClasses.map((classData, index) => (
                <motion.div
                  key={classData.courseCode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-96 bg-white rounded-3xl shadow-xl shadow-[#001BB7]/5 border border-white overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="bg-[#F5F1DC]/30 px-6 py-5 border-b border-[#001BB7]/10 flex-shrink-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xl font-bold text-[#001BB7]">{classData.courseCode}</h3>
                      <span className="text-xs font-bold bg-[#0046FF]/10 text-[#0046FF] px-2 py-1 rounded-full border border-[#0046FF]/10">
                          {classData.professors.length} Options
                      </span>
                    </div>
                    <p className="text-[#001BB7]/60 font-medium text-sm truncate" title={classData.courseName}>
                      {classData.courseName}
                    </p>
                  </div>

                  <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar flex-grow">
                    {classData.professors.map((professor) => (
                      <motion.div
                        key={professor.id}
                        whileHover={{ y: -2 }}
                        className="border border-[#001BB7]/10 bg-white rounded-2xl p-5 hover:border-[#0046FF] hover:shadow-lg hover:shadow-[#0046FF]/5 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-full">
                            <h4 className="font-bold text-[#001BB7] text-lg leading-tight mb-2 truncate" title={professor.name}>
                              {professor.name}
                            </h4>
                            
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-sm font-bold border ${professor.rating > 0 ? 'bg-[#FF8040]/10 text-[#FF8040] border-[#FF8040]/20' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                <Star className={`w-3.5 h-3.5 ${professor.rating > 0 ? 'fill-[#FF8040] text-[#FF8040]' : 'text-gray-300'}`} />
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
                              <span className="text-xs text-[#001BB7]/40 italic py-1">No attributes</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-[#001BB7]/40 font-bold">
              Scroll right for more classes →
          </div>
        </>
      )}
    </div>
  );
}