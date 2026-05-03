import { useState } from 'react';
import { Home } from './components/Home';
import { SymptomChecker } from './components/SymptomChecker';
import { HealthDashboard } from './components/HealthDashboard';
import { DoctorConsultation } from './components/DoctorConsultation';
import HospitalFinder from './components/HospitalFinder';
import { Navigation } from './components/Navigation';
import { Chatbot } from './components/Chatbot';
import { DoctorPortal } from './components/DoctorPortal';

import type { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  interface DiagnosisData {
    condition: string;
    severity: string;
    isSerious: boolean;
    confidence: number;
    recommendations: string[];
    medications: string[];
    matchedSymptoms: string[];
    urgencyLevel: string;
  }

  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'symptoms':
        return <SymptomChecker onNavigate={setCurrentView} onDiagnosis={setDiagnosisData} />;
      case 'dashboard':
        return <HealthDashboard onNavigate={setCurrentView} />;
      case 'doctors':
        return (
          <DoctorConsultation 
            onNavigate={setCurrentView} 
            diagnosisData={diagnosisData || undefined} 
          />
        );
      case 'hospitals':
        return <HospitalFinder onNavigate={setCurrentView} />;
      case 'doctor-portal':
        return <DoctorPortal onNavigate={setCurrentView} />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg1.png')",
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen flex flex-col">
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
        
        <main className="flex-grow relative pt-16">
          <div 
            key={currentView}
            className="animate-fade-in transition-opacity duration-300"
            style={{
              animation: 'fadeIn 0.5s ease-out',
              position: 'absolute',
              width: '100%',
              padding: '2rem 0',
            }}
          >
            {renderView()}
          </div>
        </main>
      </div>
      
      <Chatbot diagnosisData={diagnosisData || undefined} />
    </div>
  );
}

export default App;