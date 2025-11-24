import { Star, Users, Calendar, TrendingUp, Clock, Award, BookOpen, Filter } from 'lucide-react';

type PreferencesType = {
  preferredDays: string[];
  assessmentType: string;
  attendanceRequired: string;
  classSize: string;
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
  userData: { preferences: PreferencesType };
}

export default function RecommendationDashboard({ userData }: RecommendationDashboardProps) {
  console.log('User Data from onboarding:', userData);
  
  const mockClasses: ClassData[] = [
    {
      courseCode: 'CE 201',
      courseName: 'Fluid Mechanics',
      professors: [
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          rating: 4.8,
          reviewCount: 234,
          difficulty: 'Moderate',
          matchScore: 98,
          schedule: 'Mon/Wed 2:00-3:30 PM',
          classSize: 'Small (25)',
          assessmentType: 'Assignment Heavy',
          attendance: 'Not Required',
          tags: ['Clear Explanations', 'Helpful', 'Fair Grader'],
        },
        {
          id: '4',
          name: 'Prof. James Liu',
          rating: 4.5,
          reviewCount: 156,
          difficulty: 'Challenging',
          matchScore: 89,
          schedule: 'Tue/Thu 1:00-2:30 PM',
          classSize: 'Medium (35)',
          assessmentType: 'Exam Heavy',
          attendance: 'Required',
          tags: ['Thorough', 'Detailed Notes', 'Tough Grader'],
        },
      ],
    },
    {
      courseCode: 'CE 305',
      courseName: 'Engineering Graphics and Drawing',
      professors: [
        {
          id: '2',
          name: 'Prof. Michael Rodriguez',
          rating: 4.6,
          reviewCount: 189,
          difficulty: 'Moderate',
          matchScore: 95,
          schedule: 'Tue/Thu 10:00-11:30 AM',
          classSize: 'Medium (40)',
          assessmentType: 'Balanced',
          attendance: 'Required',
          tags: ['Engaging', 'Real-world Examples', 'Responsive'],
        },
        {
          id: '5',
          name: 'Dr. Amanda Foster',
          rating: 4.7,
          reviewCount: 201,
          difficulty: 'Easy',
          matchScore: 91,
          schedule: 'Mon/Wed 9:00-10:30 AM',
          classSize: 'Large (50)',
          assessmentType: 'Project Heavy',
          attendance: 'Not Required',
          tags: ['Creative Projects', 'Flexible', 'Supportive'],
        },
      ],
    },
    {
      courseCode: 'CE 401',
      courseName: 'Soil Mechanics',
      professors: [
        {
          id: '3',
          name: 'Dr. Emily Watson',
          rating: 4.9,
          reviewCount: 312,
          difficulty: 'Challenging',
          matchScore: 92,
          schedule: 'Mon/Wed 4:00-5:30 PM',
          classSize: 'Small (30)',
          assessmentType: 'Assignment Heavy',
          attendance: 'Not Required',
          tags: ['Industry Expert', 'Practical Projects', 'Inspiring'],
        },
        {
          id: '6',
          name: 'Prof. David Kumar',
          rating: 4.4,
          reviewCount: 178,
          difficulty: 'Moderate',
          matchScore: 87,
          schedule: 'Tue/Thu 3:00-4:30 PM',
          classSize: 'Medium (35)',
          assessmentType: 'Balanced',
          attendance: 'Required',
          tags: ['Organized', 'Clear Syllabus', 'Approachable'],
        },
      ],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-700 bg-green-50';
      case 'moderate': return 'text-yellow-700 bg-yellow-50';
      case 'challenging': return 'text-orange-700 bg-orange-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

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
                <p className="text-sm text-gray-600 mb-1">Courses Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Matches Found</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-min">
            {mockClasses.map((classData) => (
              <div
                key={classData.courseCode}
                className="flex-shrink-0 w-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="mb-6 pb-4 border-b">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{classData.courseCode}</h3>
                  <p className="text-gray-600">{classData.courseName}</p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    {classData.professors.length} Professor{classData.professors.length !== 1 ? 's' : ''} Available
                  </p>
                </div>

                <div className="space-y-4">
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
                          <p className="text-xs text-gray-700">{professor.attendance}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(professor.difficulty)}`}>
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
      </div>
    </div>
  );
}