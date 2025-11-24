import { useState } from 'react';
// import AuthScreen from './components/AuthScreen';
import WelcomePage from './components/WelcomePage';
import OnboardingScreen from './components/OnboardingScreen';
import RecommendationDashboard from './components/RecommendationDashboard';

//defining a type alias for preferences
type PreferencesType = {
  preferredDays: string[];
  assessmentType: string;
  attendanceRequired: string;
  classSize: string;
  classesTaken: String[]
};
type AppState = 'welcome' | 'onboarding' | 'dashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [userData, SetUserData] = useState<{ preferences: PreferencesType } | null>(null)

  return (
    <>
      {appState === 'welcome' && (
        <WelcomePage onGetStarted={() => setAppState('onboarding')} />
      )}
      {appState === 'onboarding' && (
        <OnboardingScreen
          onComplete={(data) => {
            SetUserData(data);
            // Run the recomendation algorithm here?
            setAppState('dashboard');
          }}
        />
      )}
      {appState === 'dashboard' && userData && (
        <RecommendationDashboard userData={userData} />
      )}

    </>
  );
}


export default App;
