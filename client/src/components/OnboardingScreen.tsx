import { useState } from 'react';
import { Upload, ClipboardCheck, Users, ChevronRight, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

type PreferencesType = {
  preferredDays: string[];
  assessmentType: string;
  attendanceRequired: string;
  classSize: string;
  classesTaken: string[];
};

interface RecommendationData {
  courseCode: string;
  courseName: string;
  professors: any[];
}

interface OnboardingScreenProps {
  onComplete: (data: { 
    preferences: PreferencesType;
    recommendations: RecommendationData[];
  }) => void; 
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<PreferencesType>({
    preferredDays: [],
    assessmentType: '',
    attendanceRequired: '',
    classSize: '',
    classesTaken: []
  });
  const [transcript, setTranscript] = useState<File | null>(null);
  const [department, setDepartment] = useState('CE');
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadTranscript(file: File, dept: string) {
    const formData = new FormData();
    formData.append('transcript', file);

    const response = await fetch(`http://localhost:8000/api/recommendations?department=${dept}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to process transcript');
    }

    const data = await response.json();
    return data;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setTranscript(file);
    setLoading(true);
    setError(null);

    try {
      const data = await uploadTranscript(file, department);
      
      if (data.success) {
        setRecommendations(data.recommendations || []);
        setPreferences(prev => ({
          ...prev,
          classesTaken: data.completed_courses || []
        }));
        console.log("Processed data:", data);
      } else {
        setError(data.error || "Error processing file");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server. Make sure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({ preferences, recommendations });
    }
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return transcript !== null && preferences.classesTaken.length > 0 && !loading;
    if (step === 3) return preferences.classesTaken.length > 0;
    if (step === 4) return preferences.assessmentType && preferences.attendanceRequired && preferences.classSize;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {[1,2,3,4].map((num) => (
              <div key={num} className="flex items-center" style={{ flex: num < 4 ? '1' : '0 0 auto' }}>
                <div className="flex flex-col items-center" style={{ width: '40px' }}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {num}
                  </div>
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > num ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            {['Disclaimer', 'Transcript', 'Classes', 'Preferences'].map((label, idx) => (
              <div key={label} className="flex items-center" style={{ flex: idx < 3 ? '1' : '0 0 auto' }}>
                <div className="text-sm text-gray-600 text-center" style={{ width: '40px' }}>
                  {label}
                </div>
                {idx < 3 && <div className="flex-1 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Warning Page */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Important Notice</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To provide personalized course recommendations, we'll need to analyze your academic transcript. 
                This helps us understand which courses you've completed and match you with appropriate professors.
              </p>
              {/* <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
                <h3 className="font-semibold text-green-800 mb-2">Privacy & Security</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Your transcript data is processed securely</li>
                  <li>• Data is not stored permanently</li>
                  <li>• Information is deleted after your session</li>
                  <li>• Only used for generating recommendations</li>
                </ul>
              </div> */}
            </div>
          </div>
        )}

        {/* Step 2: Transcript Upload */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Transcript</h2>
                <p className="text-gray-600">Upload your unofficial transcript for course analysis</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Your Department
              </label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
              >
                <option value="CE">Civil Engineering</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="MATH">Mathematics</option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              {!transcript ? (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your transcript here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF files only (Max 10MB)
                  </p>
                </label>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="font-medium text-gray-900">Processing transcript...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{transcript.name}</p>
                    <p className="text-sm text-gray-500">{(transcript.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => {
                      setTranscript(null);
                      setPreferences(prev => ({ ...prev, classesTaken: [] }));
                      setRecommendations([]);
                    }}
                    className="ml-4 text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Why we need your transcript:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Analyze courses you've completed</li>
                <li>• Identify prerequisite requirements</li>
                <li>• Match you with appropriate professors</li>
                <li>• Suggest optimal course sequences</li>
              </ul>
            </div>

            <div className="mt-4 bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">How to get your unofficial transcript</h3>
              <p className="text-sm text-blue-700 mb-2">
                Need help finding your transcript? Follow UTA's guide:
              </p>
              <a 
                href="https://uta.service-now.com/selfservice?id=utassp01_kb_article&sys_id=fd187c6edbd48cd8d48b5e65ce96194a&catid=&pageid=utassp02_kb_public_knowledge_base" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-700 font-medium underline text-sm hover:text-blue-800"
              >
                View transcript instructions →
              </a>
            </div>
          </div>
        )}

        {/* Step 3: Classes Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
                <p className="text-gray-600">Review the classes we found from your transcript</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 max-h-96 overflow-y-auto">
              {preferences.classesTaken && preferences.classesTaken.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {preferences.classesTaken.map((className, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border-2 border-blue-100 bg-white flex items-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{className}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No classes detected. Please go back and upload your transcript.</p>
                </div>
              )}
            </div>

            <div className="mt-6 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-2">
                {preferences.classesTaken.length} {preferences.classesTaken.length === 1 ? 'class' : 'classes'} found
              </h3>
              <p className="text-sm text-green-700">
                We'll use this information to match you with appropriate professors and courses.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Learning Preferences */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Learning Preferences</h2>
                <p className="text-gray-600">Tell us about your ideal learning environment</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Assessment Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Test Heavy', 'Assignment Heavy'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPreferences(prev => ({ ...prev, assessmentType: type }))}
                      className={`p-4 rounded-lg border-2 transition-all font-medium ${
                        preferences.assessmentType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Attendance Requirement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Required', 'Not Required'].map((req) => (
                    <button
                      key={req}
                      onClick={() => setPreferences(prev => ({ ...prev, attendanceRequired: req }))}
                      className={`p-4 rounded-lg border-2 transition-all font-medium ${
                        preferences.attendanceRequired === req
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {req}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Users className="w-4 h-4 inline mr-2" />
                  Preferred Class Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPreferences(prev => ({ ...prev, classSize: size }))}
                      className={`p-4 rounded-lg border-2 transition-all font-medium ${
                        preferences.classSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-white hover:shadow-md rounded-lg transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`ml-auto px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === 4 ? 'Complete Setup' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}