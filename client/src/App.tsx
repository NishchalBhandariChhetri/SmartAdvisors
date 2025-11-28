import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WelcomePage from './components/WelcomePage';
import UploadScreen from './components/UploadScreen';
import TranscriptReview from './components/TranscriptReview'; // NEW
import PreferenceForm, { Preferences } from './components/PreferenceForm';
import RecommendationDashboard from './components/RecommendationDashboard';

interface ApiRecommendationResponse {
  success: boolean;
  recommendations: any[];
}

function App() {
  const [step, setStep] = useState<number>(0); 
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState<string>('CE'); 
  const [completedCourses, setCompletedCourses] = useState<string[]>([]); // New state for course list
  const [apiData, setApiData] = useState<ApiRecommendationResponse | null>(null);
  const [userPrefs, setUserPrefs] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // NEW LOGIC: Step 1 -> Step 2
  // Uploads file, gets list of courses, moves to Review Page
  const handleUploadAndParse = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('transcript', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/parse-transcript', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.courses) {
        setCompletedCourses(data.courses);
        setStep(2); // Go to Review Page
      } else {
        alert("Error parsing transcript: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Parse error:", error);
      alert("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // FINAL LOGIC: Step 3 -> Step 4
  // Sends the list of courses + preferences to get recommendations
  const handleGenerate = async (preferences: Preferences) => {
    setUserPrefs(preferences);
    setIsLoading(true);

    const formData = new FormData();
    // Pass the LIST of courses we verified in Step 2
    formData.append('completed_courses', JSON.stringify(completedCourses));
    formData.append('department', department);
    formData.append('preferences', JSON.stringify(preferences));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recommendations', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setApiData(data);
        setStep(4);
      } else {
        alert("Error: " + (data.error || "Unknown error occurred"));
      }
    } catch (error) {
      alert("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---

  // 0. WELCOME
  if (step === 0) {
    return (
      <Layout onLogoClick={() => setStep(0)}>
        <WelcomePage onGetStarted={() => setStep(1)} />
      </Layout>
    );
  }

  // 1. UPLOAD
  if (step === 1) {
    return (
      <Layout onLogoClick={() => setStep(0)}>
        <UploadScreen 
          file={file} 
          department={department}
          onFileChange={handleFileChange}
          setDepartment={setDepartment}
          onNext={handleUploadAndParse} // Calls new API route
          onBack={() => setStep(0)}
        />
      </Layout>
    );
  }

  // 2. REVIEW TRANSCRIPT (NEW)
  if (step === 2) {
    return (
      <Layout onLogoClick={() => setStep(0)}>
        <TranscriptReview 
          courses={completedCourses}
          onNext={() => setStep(3)} // Confirm courses, go to prefs
          onBack={() => setStep(1)}
        />
      </Layout>
    );
  }

  // 3. PREFERENCES
  if (step === 3) {
    return (
      <Layout onLogoClick={() => setStep(0)}>
         <PreferenceForm 
            onGenerateSchedule={handleGenerate} 
            isLoading={isLoading} 
            onBack={() => setStep(2)}
         />
      </Layout>
    );
  }

  // 4. DASHBOARD
  if (step === 4 && apiData && userPrefs) {
    return (
      <Layout onLogoClick={() => setStep(0)}>
        <RecommendationDashboard 
          userData={{
            preferences: userPrefs,
            recommendations: apiData.recommendations
          }}
          onBack={() => setStep(3)}
        />
      </Layout>
    );
  }

  return <div>Loading...</div>;
}

export default App;