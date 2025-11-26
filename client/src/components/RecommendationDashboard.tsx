import { useState, useEffect } from 'react';
import { Star, Users, Calendar, TrendingUp, Clock, Award, BookOpen, Loader2 } from 'lucide-react';

type PreferencesType = {
  preferredDays: string[];
  assessmentType: string;
  attendanceRequired: string;
  classSize: string;
  classesTaken: string[];
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
}

export default function RecommendationDashboard({ userData }: RecommendationDashboardProps) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.recommendations) {
      setClasses(userData.recommendations);
      console.log(userData);
      console.log(userData.recommendations);
      setIsLoading(false);
    }
  }, [userData]);

  const visibleClasses = classes.filter((c) => c.professors.length > 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-700 bg-green-50';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-50';
      case 'challenging':
        return 'text-orange-700 bg-orange-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center mb-4">
            <Award className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Error Loading Recommendations</h2>
          </div>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  const totalCourses = visibleClasses.length;
  const totalProfessors = visibleClasses.reduce((sum, c) => sum + c.professors.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Smart Advisors</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                My Schedule
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Recommended Classes</h2>
          <p className="text-gray-600">Explore professors for each class based on your preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Eligible Courses</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Professor Options</p>
                <p className="text-2xl font-bold text-gray-900">{totalProfessors}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {visibleClasses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600">
              You may have completed all available courses, or there might be an issue with your transcript.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-min">
                {visibleClasses.map((classData) => (
                  <div
                    key={classData.courseCode}
                    className="flex-shrink-0 w-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="mb-6 pb-4 border-b">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{classData.courseCode}</h3>
                      <p className="text-gray-600">{classData.courseName}</p>
                      <p className="text-sm text-blue-600 mt-2 font-medium">
                        {classData.professors.length} Professor{classData.professors.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* NEW: Scrollable professor list with a fixed height */}
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {classData.professors.map((professor) => (
                        <div
                          key={professor.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{professor.name}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-gray-900">{professor.rating}</span>
                                <span className="text-xs text-gray-500">({professor.reviewCount})</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-start gap-2">
                              <BookOpen className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                              <p className="text-xs text-gray-700">{professor.assessmentType}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                              <p className="text-xs text-gray-700">{professor.schedule}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                              <p className="text-xs text-gray-700">{professor.attendance}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                professor.difficulty
                              )}`}
                            >
                              {professor.difficulty}
                            </span>
                            {professor.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              ← Scroll to see more classes →
            </div>
          </>
        )}
      </div>
    </div>
  );
}
