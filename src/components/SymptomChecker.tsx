import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, MapPin, ArrowLeft, Pill, Shield, ChevronRight } from 'lucide-react';
import { AppView } from '../App';

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

interface SymptomCheckerProps {
  onNavigate: (view: AppView) => void;
  onDiagnosis: (data: DiagnosisData) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onNavigate, onDiagnosis }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [step, setStep] = useState<'symptoms' | 'diagnosis'>('symptoms');

  const symptomCategories = [
    {
      category: 'General',
      symptoms: ['Fever', 'Fatigue', 'Headache', 'Dizziness', 'Nausea', 'Vomiting', 'Loss of appetite', 'Night sweats', 'Chills']
    },
    {
      category: 'Respiratory',
      symptoms: ['Cough', 'Shortness of breath', 'Chest pain', 'Sore throat', 'Runny nose', 'Sneezing', 'Wheezing', 'Difficulty breathing']
    },
    {
      category: 'Digestive',
      symptoms: ['Stomach pain', 'Diarrhea', 'Constipation', 'Bloating', 'Heartburn', 'Acid reflux', 'Nausea after eating', 'Blood in stool']
    },
    {
      category: 'Musculoskeletal',
      symptoms: ['Back pain', 'Joint pain', 'Muscle aches', 'Stiffness', 'Swelling', 'Limited mobility', 'Muscle weakness']
    },
    {
      category: 'Skin',
      symptoms: ['Rash', 'Itching', 'Dry skin', 'Redness', 'Swelling', 'Bruising', 'Unusual moles', 'Skin discoloration']
    },
    {
      category: 'Neurological',
      symptoms: ['Memory problems', 'Confusion', 'Seizures', 'Numbness', 'Tingling', 'Balance problems', 'Vision changes']
    }
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptomsAI = () => {
    // Enhanced AI analysis based on symptom combinations
    const conditions = {
      'Common Cold': {
        symptoms: ['Runny nose', 'Sneezing', 'Sore throat', 'Cough', 'Fatigue'],
        severity: 'mild',
        isSerious: false
      },
      'Influenza': {
        symptoms: ['Fever', 'Fatigue', 'Headache', 'Muscle aches', 'Cough'],
        severity: 'moderate',
        isSerious: false
      },
      'Gastroenteritis': {
        symptoms: ['Stomach pain', 'Diarrhea', 'Nausea', 'Vomiting', 'Fever'],
        severity: 'moderate',
        isSerious: false
      },
      'Migraine': {
        symptoms: ['Headache', 'Nausea', 'Dizziness', 'Vision changes'],
        severity: 'moderate',
        isSerious: false
      },
      'Hypertension': {
        symptoms: ['Headache', 'Dizziness', 'Chest pain', 'Shortness of breath'],
        severity: 'moderate',
        isSerious: true
      },
      'Pneumonia': {
        symptoms: ['Cough', 'Fever', 'Chest pain', 'Shortness of breath', 'Fatigue'],
        severity: 'severe',
        isSerious: true
      },
      'Heart Condition': {
        symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness', 'Fatigue'],
        severity: 'severe',
        isSerious: true
      },
      'Allergic Reaction': {
        symptoms: ['Rash', 'Itching', 'Swelling', 'Difficulty breathing'],
        severity: 'moderate',
        isSerious: true
      }
    };

    // Find the best matching condition
    let bestMatch = { condition: 'General Discomfort', score: 0, severity: 'mild', isSerious: false };
    
    Object.entries(conditions).forEach(([conditionName, conditionData]) => {
      const matchingSymptoms = selectedSymptoms.filter(symptom => 
        conditionData.symptoms.some(condSymptom => 
          symptom.toLowerCase().includes(condSymptom.toLowerCase()) ||
          condSymptom.toLowerCase().includes(symptom.toLowerCase())
        )
      );
      
      const score = matchingSymptoms.length / Math.max(conditionData.symptoms.length, selectedSymptoms.length);
      
      if (score > bestMatch.score) {
        bestMatch = {
          condition: conditionName,
          score,
          severity: conditionData.severity,
          isSerious: conditionData.isSerious
        };
      }
    });

    // Generate confidence based on symptom match
    const confidence = Math.min(Math.floor(bestMatch.score * 100) + 60, 95);

    const getMedications = (condition: string) => {
      const medications: Record<string, string[]> = {
        'Common Cold': [
          'Paracetamol (500mg) - 1-2 tablets every 4-6 hours for fever and pain',
          'Decongestant nasal spray - Use as directed for nasal congestion',
          'Cough syrup - 5-10ml every 4-6 hours for dry cough'
        ],
        'Influenza': [
          'Paracetamol (500mg) - 2 tablets every 6 hours for fever',
          'Ibuprofen (400mg) - 1 tablet every 8 hours for body aches',
          'Antiviral medication (if prescribed) - As per doctor\'s instructions'
        ],
        'Gastroenteritis': [
          'ORS (Oral Rehydration Solution) - 1 packet in 200ml water, drink frequently',
          'Loperamide (2mg) - 1 tablet after each loose stool (max 4 per day)',
          'Probiotics - As directed on package for gut health'
        ],
        'Migraine': [
          'Sumatriptan (50mg) - 1 tablet at onset of migraine',
          'Ibuprofen (400mg) - 1-2 tablets for pain relief',
          'Anti-nausea medication - As prescribed by doctor'
        ],
        'Hypertension': [
          'ACE inhibitors - As prescribed by cardiologist',
          'Beta-blockers - Take as directed by physician',
          'Lifestyle modifications recommended over medication initially'
        ],
        'Pneumonia': [
          'Antibiotics - As prescribed by doctor (course must be completed)',
          'Paracetamol (500mg) - For fever management',
          'Bronchodilators - If prescribed for breathing difficulty'
        ],
        'Heart Condition': [
          'Immediate medical attention required',
          'Aspirin (if not allergic) - 1 tablet (300mg) if chest pain occurs',
          'Prescribed cardiac medications - As per cardiologist'
        ],
        'Allergic Reaction': [
          'Antihistamines (Cetirizine 10mg) - 1 tablet once daily',
          'Topical corticosteroids - Apply to affected skin areas',
          'Epinephrine auto-injector - If prescribed for severe allergies'
        ]
      };

      return medications[condition] || [
        'Paracetamol (500mg) - 1-2 tablets every 6 hours for pain/fever',
        'Rest and adequate hydration',
        'Consult healthcare provider for proper diagnosis'
      ];
    };

    const getRecommendations = (condition: string) => {
      const baseRecommendations = [
        'Get adequate rest (7-8 hours of sleep)',
        'Stay well hydrated - drink plenty of fluids',
        'Eat light, nutritious meals',
        'Avoid strenuous activities until symptoms improve'
      ];

      const conditionSpecific: Record<string, string[]> = {
        'Common Cold': [
          'Use a humidifier or breathe steam from hot water',
          'Gargle with warm salt water for sore throat',
          'Avoid close contact with others to prevent spread'
        ],
        'Influenza': [
          'Stay home and rest until fever-free for 24 hours',
          'Cover coughs and sneezes to prevent spread',
          'Consider antiviral medication if symptoms started recently'
        ],
        'Gastroenteritis': [
          'Follow BRAT diet (Bananas, Rice, Applesauce, Toast)',
          'Avoid dairy, alcohol, and fatty foods',
          'Watch for signs of dehydration'
        ],
        'Migraine': [
          'Rest in a dark, quiet room',
          'Apply cold or warm compress to head/neck',
          'Identify and avoid personal migraine triggers'
        ],
        'Hypertension': [
          'Monitor blood pressure regularly',
          'Reduce sodium intake significantly',
          'Engage in regular moderate exercise',
          'Manage stress through relaxation techniques'
        ],
        'Pneumonia': [
          'Seek immediate medical attention',
          'Take all prescribed antibiotics completely',
          'Use a humidifier to ease breathing'
        ],
        'Heart Condition': [
          'Seek immediate emergency medical care',
          'Avoid physical exertion',
          'Call emergency services if chest pain worsens'
        ],
        'Allergic Reaction': [
          'Identify and avoid the allergen trigger',
          'Keep antihistamines readily available',
          'Seek emergency care if breathing becomes difficult'
        ]
      };

      return [...baseRecommendations, ...(conditionSpecific[condition] || [])];
    };

    const diagnosisResult = {
      condition: bestMatch.condition,
      severity: bestMatch.severity,
      isSerious: bestMatch.isSerious,
      confidence: confidence,
      recommendations: getRecommendations(bestMatch.condition),
      medications: getMedications(bestMatch.condition),
      matchedSymptoms: selectedSymptoms,
      urgencyLevel: bestMatch.isSerious ? 'High' : bestMatch.severity === 'moderate' ? 'Medium' : 'Low'
    };

    setDiagnosis(diagnosisResult);
    onDiagnosis(diagnosisResult);
    setStep('diagnosis');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (step === 'diagnosis' && diagnosis) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">AI Diagnosis Results</h2>
            <button
              onClick={() => setStep('symptoms')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Symptoms
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Diagnosis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Condition Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Possible Condition</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">{diagnosis.condition}</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
                    Severity: {diagnosis.severity.toUpperCase()}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getUrgencyColor(diagnosis.urgencyLevel)}`}>
                    Urgency: {diagnosis.urgencyLevel}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {diagnosis.confidence}% Confidence
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Based on analysis of {diagnosis.matchedSymptoms.length} symptoms</p>
                </div>
              </div>

              {/* Severity Alert */}
              {diagnosis.isSerious && (
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
                    <div>
                      <h4 className="text-xl font-bold text-red-800 mb-2">Medical Attention Recommended</h4>
                      <p className="text-red-700">
                        This condition may require professional medical evaluation. Please consider consulting 
                        with a healthcare provider promptly, especially if symptoms worsen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-3" />
                  Health Recommendations
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {diagnosis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <Pill className="h-6 w-6 mr-3" />
                  Suggested Medications & Dosage
                </h3>
                <div className="space-y-3">
                  {diagnosis.medications.map((med: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-purple-800 font-medium">{med}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ Important: Always consult with a healthcare professional before taking any medication. 
                    Dosages may vary based on age, weight, and medical history.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Symptoms */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Your Symptoms ({diagnosis.matchedSymptoms.length})
                </h4>
                <div className="space-y-2">
                  {diagnosis.matchedSymptoms.map((symptom: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-2 border border-gray-200">
                      <span className="text-gray-700 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://www.google.com/maps/search/doctor+near+me', '_blank')}
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Find Doctor Near Me
                </button>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Find Hospitals
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Health Dashboard
                </button>
              </div>

              {/* Emergency Contact */}
              {diagnosis.isSerious && (
                <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                  <h4 className="text-lg font-bold text-red-800 mb-2">Emergency Contact</h4>
                  <p className="text-red-700 text-sm mb-3">
                    If symptoms worsen or you experience severe distress:
                  </p>
                  <button
                    onClick={() => window.location.href = 'tel:108'}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold"
                  >
                    Call 108 Emergency
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Great! Have a Healthify Day!! 🌟</h3>
              <p className="text-lg opacity-90">
                Take care of yourself and follow the recommendations above. 
                Remember to consult healthcare professionals for proper treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Symptom selection view
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-3">
            AI Symptom Checker
          </h2>
          <p className="text-gray-600 text-lg">Select all symptoms you're experiencing for accurate diagnosis</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-8">
          {symptomCategories.map((category, index) => (
            <div key={index} className="border-b border-gray-100 pb-8 mb-6 last:border-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-100 to-teal-50 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-blue-100">
                  {category.category}
                </span>
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {category.symptoms.map((symptom: string, symIndex: number) => (
                  <motion.button
                    key={symIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      selectedSymptoms.includes(symptom)
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 shadow-md transform scale-[1.02] font-semibold'
                        : 'border-gray-200 hover:border-blue-200 text-gray-700 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{symptom}</span>
                      {selectedSymptoms.includes(symptom) ? (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedSymptoms.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100 shadow-inner"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h4 className="text-2xl font-bold text-gray-800">
                Selected Symptoms <span className="text-blue-600">({selectedSymptoms.length})</span>
              </h4>
              <span className="text-sm text-blue-600 font-medium">
                {selectedSymptoms.length >= 3 ? 'Great! You can now analyze your symptoms.' : 'Select at least 3 symptoms for better accuracy.'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {selectedSymptoms.map((symptom: string, index: number) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center shadow-md"
                >
                  {symptom}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSymptom(symptom);
                    }}
                    className="ml-2 hover:bg-blue-700/30 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
            <button
              onClick={analyzeSymptomsAI}
              disabled={selectedSymptoms.length < 3}
              className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-lg transform hover:scale-[1.02] ${
                selectedSymptoms.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Analyze My Symptoms with AI</span>
              <ChevronRight className="h-6 w-6 ml-2" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};