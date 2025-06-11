import { useState } from 'react';
import { AnalysisResult, UserProfile } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Layout/Header';
import CameraCapture from './components/Camera/CameraCapture';
import AnalysisResults from './components/Analysis/AnalysisResults';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';

const defaultProfile: UserProfile = {
  age: 30,
  sex: 'male',
  lifestyle: 'moderately_active'
};

function App() {
  const [currentView, setCurrentView] = useState('camera');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [analyses, setAnalyses] = useLocalStorage<AnalysisResult[]>('nutrisnap-analyses', []);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('nutrisnap-profile', defaultProfile);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    setCurrentView('analysis');
  };

  const handleSaveAnalysis = (result: AnalysisResult) => {
    setAnalyses(prev => [result, ...prev]);
    setCurrentAnalysis(null);
  };

  const handleBackFromAnalysis = () => {
    setCurrentAnalysis(null);
    setCurrentView('camera');
  };

  const handleViewAnalysis = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    setCurrentView('analysis');
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const renderCurrentView = () => {
    if (currentView === 'analysis' && currentAnalysis) {
      return (
        <AnalysisResults
          result={currentAnalysis}
          userProfile={userProfile}
          onBack={handleBackFromAnalysis}
          onSave={handleSaveAnalysis}
        />
      );
    }

    switch (currentView) {
      case 'camera':
        return <CameraCapture onAnalysisComplete={handleAnalysisComplete} />;
      case 'dashboard':
        return (
          <Dashboard
            analyses={analyses}
            userProfile={userProfile}
            onViewAnalysis={handleViewAnalysis}
          />
        );
      case 'profile':
        return (
          <Profile
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <CameraCapture onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

export default App;