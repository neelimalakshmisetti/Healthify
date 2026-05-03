import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplets, Utensils, Thermometer, Moon, AlertCircle, CheckCircle, TrendingUp, ChevronRight, Minus, Plus } from 'lucide-react';
import { AppView } from '../App';

interface HealthDashboardProps {
  onNavigate: (view: AppView) => void;
}

interface HealthMetrics {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodSugar: number;
  heartRate: number;
  sleep: number;
  nutrition: number;
  activity: number;
  temperature: number;
  oxygenSaturation: number;
  sleepQuality: number;
  foodIntake: number;
  dailySteps: number;
  weight: number;
  bmi: number;
  stressLevel: number;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    bloodPressure: { systolic: 120, diastolic: 80 }, // Normal: 90-120/60-80 mmHg
    bloodSugar: 90, // Fasting normal: 70-100 mg/dL
    heartRate: 72, // Normal resting: 60-100 bpm
    sleep: 7.5, // Recommended: 7-9 hours
    nutrition: 2000, // Average daily calorie intake
    activity: 0, // Will be synced with dailySteps
    temperature: 98.6, // Normal: 97.8-99°F (36.5-37.2°C)
    oxygenSaturation: 98, // Normal: 95-100%
    sleepQuality: 8, // Scale: 1-10
    foodIntake: 8, // Scale: 1-10 (quality of diet)
    dailySteps: 0, // Will be updated when activity changes
    weight: 150, // lbs (will be used with height to calculate BMI)
    bmi: 24.5, // Normal: 18.5-24.9
    stressLevel: 3, // Scale: 1-10
  });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const updateMetric = (key: keyof HealthMetrics, value: any) => {
    setMetrics(prev => {
      // Create a new state object
      const updated = { ...prev };
      
      // Update the target metric
      updated[key] = value;
      
      // Keep activity and dailySteps in sync
      if (key === 'activity') {
        updated.dailySteps = Number(value);
      } else if (key === 'dailySteps') {
        updated.activity = Number(value);
      }
      
      return updated;
    });
  };

  const analyzeHealth = () => {
    const analysis = {
      overallScore: 0,
      status: '',
      riskFactors: [] as string[],
      recommendations: [] as string[],
      positiveFactors: [] as string[]
    };

    let score = 0;

    // Blood Pressure Analysis
    const { systolic, diastolic } = metrics.bloodPressure;
    if (systolic <= 120 && diastolic <= 80) {
      score += 15;
      analysis.positiveFactors.push('Normal blood pressure');
    } else if (systolic <= 140 && diastolic <= 90) {
      score += 10;
      analysis.riskFactors.push('Elevated blood pressure');
      analysis.recommendations.push('Monitor blood pressure regularly and reduce sodium intake');
    } else {
      score += 5;
      analysis.riskFactors.push('High blood pressure');
      analysis.recommendations.push('Consult healthcare provider immediately for blood pressure management');
    }

    // Blood Sugar Analysis
    if (metrics.bloodSugar >= 70 && metrics.bloodSugar <= 100) {
      score += 15;
      analysis.positiveFactors.push('Normal blood sugar levels');
    } else if (metrics.bloodSugar <= 125) {
      score += 10;
      analysis.riskFactors.push('Elevated blood sugar');
      analysis.recommendations.push('Reduce sugar intake and increase physical activity');
    } else {
      score += 5;
      analysis.riskFactors.push('High blood sugar');
      analysis.recommendations.push('Consult healthcare provider for diabetes screening');
    }

    // Temperature Analysis
    if (metrics.temperature >= 97.7 && metrics.temperature <= 99.5) {
      score += 10;
      analysis.positiveFactors.push('Normal body temperature');
    } else {
      score += 5;
      analysis.riskFactors.push('Abnormal body temperature');
      analysis.recommendations.push('Monitor temperature and consult doctor if fever persists');
    }

    // Oxygen Saturation Analysis
    if (metrics.oxygenSaturation >= 95) {
      score += 10;
      analysis.positiveFactors.push('Good oxygen saturation');
    } else {
      score += 3;
      analysis.riskFactors.push('Low oxygen saturation');
      analysis.recommendations.push('Seek immediate medical attention for breathing difficulties');
    }

    // Sleep Quality Analysis
    if (metrics.sleepQuality >= 7) {
      score += 15;
      analysis.positiveFactors.push('Good sleep quality');
    } else if (metrics.sleepQuality >= 5) {
      score += 8;
      analysis.riskFactors.push('Poor sleep quality');
      analysis.recommendations.push('Improve sleep hygiene and maintain regular sleep schedule');
    } else {
      score += 3;
      analysis.riskFactors.push('Very poor sleep quality');
      analysis.recommendations.push('Consult healthcare provider for sleep disorders evaluation');
    }

    // Food Intake Analysis
    if (metrics.foodIntake >= 7) {
      score += 10;
      analysis.positiveFactors.push('Good nutritional intake');
    } else if (metrics.foodIntake >= 5) {
      score += 6;
      analysis.riskFactors.push('Suboptimal nutrition');
      analysis.recommendations.push('Focus on balanced diet with more fruits and vegetables');
    } else {
      score += 2;
      analysis.riskFactors.push('Poor nutritional intake');
      analysis.recommendations.push('Consult nutritionist for proper meal planning');
    }

    // Daily Steps Analysis
    if (metrics.dailySteps >= 10000) {
      score += 15;
      analysis.positiveFactors.push('Excellent physical activity level');
    } else if (metrics.dailySteps >= 7500) {
      score += 10;
      analysis.positiveFactors.push('Good physical activity level');
    } else if (metrics.dailySteps >= 5000) {
      score += 6;
      analysis.riskFactors.push('Low physical activity');
      analysis.recommendations.push('Increase daily walking and exercise routine');
    } else {
      score += 2;
      analysis.riskFactors.push('Very low physical activity');
      analysis.recommendations.push('Start with light exercise and gradually increase activity level');
    }

    analysis.overallScore = score;

    if (score >= 80) {
      analysis.status = 'Excellent';
    } else if (score >= 65) {
      analysis.status = 'Good';
    } else if (score >= 50) {
      analysis.status = 'Fair';
    } else {
      analysis.status = 'Needs Attention';
    }

    // General lifestyle recommendations
    if (analysis.status === 'Excellent') {
      analysis.recommendations.push('Maintain your current healthy lifestyle');
      analysis.recommendations.push('Regular health check-ups every 6 months');
    } else {
      analysis.recommendations.push('Stay hydrated - drink at least 8 glasses of water daily');
      analysis.recommendations.push('Include 30 minutes of moderate exercise daily');
      analysis.recommendations.push('Eat a balanced diet rich in fruits and vegetables');
      analysis.recommendations.push('Manage stress through meditation or relaxation techniques');
    }

    setHealthStatus(analysis);
    setShowAnalysis(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Needs Attention': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showAnalysis && healthStatus) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-3">
              Your Health Analysis
            </h2>
            <p className="text-gray-600 text-lg">Comprehensive health assessment based on your metrics</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto my-4 rounded-full"></div>
            
            <div className={`inline-flex items-center px-8 py-4 rounded-full text-2xl font-bold ${getStatusColor(healthStatus.status)} shadow-lg`}>
              <Heart className="h-8 w-8 mr-3" />
              Health Status: {healthStatus.status}
            </div>
            <p className="text-gray-700 mt-4 text-lg font-medium">
              Overall Health Score: <span className="font-bold text-blue-700">{healthStatus.overallScore}/100</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {healthStatus.positiveFactors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  Positive Health Factors
                </h3>
                <ul className="space-y-3">
                  {healthStatus.positiveFactors.map((factor: string, index: number) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      className="flex items-start bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-green-100"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{factor}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {healthStatus.riskFactors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  Areas Needing Attention
                </h3>
                <ul className="space-y-3">
                  {healthStatus.riskFactors.map((factor: string, index: number) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className="flex items-start bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-red-100"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{factor}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200 mb-10 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <div className="bg-blue-100 p-2 rounded-xl mr-3">
                <TrendingUp className="h-7 w-7 text-blue-600" />
              </div>
              Personalized Health Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {healthStatus.recommendations.map((rec: string, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:border-blue-200 transition-colors flex items-start"
                >
                  <div className="bg-blue-100 p-1.5 rounded-lg mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-800">{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAnalysis(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              <Activity className="h-5 w-5" />
              <span>Update Health Metrics</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('doctors')}
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Consult a Doctor</span>
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Great! Have a Healthify Day!! 🌟</h3>
              <p className="text-lg opacity-90">Keep monitoring your health and stay active!</p>
              <div className="w-16 h-1 bg-white/50 rounded-full mx-auto my-4"></div>
              <p className="text-sm opacity-80 mt-2">Your health journey matters to us</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-3">
            Health Dashboard
          </h2>
          <p className="text-gray-600 text-lg">Track your vital signs and health metrics</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 relative">
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/4 -right-8 w-48 h-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          {/* Blood Pressure */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(251, 113, 133, 0.2)',
              background: 'linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(251, 207, 232, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-red-100 p-2 rounded-xl mr-3">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Blood Pressure</h3>
            </div>
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Systolic (mmHg)</label>
                  <span className="text-xs text-gray-500">Normal: 90-120</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={metrics.bloodPressure.systolic}
                    onChange={(e) => updateMetric('bloodPressure', { ...metrics.bloodPressure, systolic: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all placeholder-gray-400"
                    placeholder="120"
                    min="50"
                    max="200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">mmHg</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {metrics.bloodPressure.systolic < 90 ? '⚠️ Low' : 
                   metrics.bloodPressure.systolic > 120 ? '⚠️ High' : '✅ Normal'}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Diastolic (mmHg)</label>
                  <span className="text-xs text-gray-500">Normal: 60-80</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={metrics.bloodPressure.diastolic}
                    onChange={(e) => updateMetric('bloodPressure', { ...metrics.bloodPressure, diastolic: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all placeholder-gray-400"
                    placeholder="80"
                    min="30"
                    max="150"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">mmHg</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {metrics.bloodPressure.diastolic < 60 ? '⚠️ Low' : 
                   metrics.bloodPressure.diastolic > 80 ? '⚠️ High' : '✅ Normal'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Blood Sugar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(251, 191, 36, 0.2)',
              background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 243, 199, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-orange-100 p-2 rounded-xl mr-3">
                <Droplets className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Blood Sugar</h3>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Glucose Level (mg/dL)</label>
                <span className="text-xs text-gray-500">Fasting: 70-100</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.bloodSugar}
                  onChange={(e) => updateMetric('bloodSugar', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder-gray-400"
                  placeholder="90"
                  min="50"
                  max="300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">mg/dL</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {metrics.bloodSugar < 70 ? '⚠️ Low (Hypoglycemia)' : 
                 metrics.bloodSugar > 100 ? '⚠️ High (Hyperglycemia)' : '✅ Normal'}
              </p>
            </div>
          </motion.div>

          {/* Heart Rate */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(236, 72, 153, 0.2)',
              background: 'linear-gradient(135deg, rgba(252, 231, 243, 0.9) 0%, rgba(251, 207, 232, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-pink-100 p-2 rounded-xl mr-3">
                <Activity className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Heart Rate</h3>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Heart Rate (BPM)</label>
                <span className="text-xs text-gray-500">Resting: 60-100</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.heartRate}
                  onChange={(e) => updateMetric('heartRate', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-400"
                  placeholder="72"
                  min="30"
                  max="200"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">BPM</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {metrics.heartRate < 60 ? '⚠️ Bradycardia' : 
                 metrics.heartRate > 100 ? '⚠️ Tachycardia' : '✅ Normal'}
              </p>
            </div>
          </motion.div>

          {/* Sleep */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.2)',
              background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.9) 0%, rgba(199, 210, 254, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                <Moon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sleep</h3>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Hours of Sleep</label>
                <span className="text-xs text-gray-500">Recommended: 7-9h</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.sleep}
                  onChange={(e) => updateMetric('sleep', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder-gray-400"
                  placeholder="7.5"
                  min="0"
                  max="24"
                  step="0.5"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">hours</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {metrics.sleep < 6 ? '⚠️ Insufficient' : 
                 metrics.sleep > 9 ? '⚠️ Excessive' : '✅ Optimal'}
              </p>
            </div>
          </motion.div>

          {/* Nutrition */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.2)',
              background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9) 0%, rgba(204, 251, 241, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                <Utensils className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nutrition</h3>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Daily Calories (kcal)</label>
                <span className="text-xs text-gray-500">Avg. adult: 2000-2500</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.nutrition}
                  onChange={(e) => updateMetric('nutrition', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all placeholder-gray-400"
                  placeholder="2000"
                  min="500"
                  max="10000"
                  step="100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">kcal</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {metrics.nutrition < 1200 ? '⚠️ Very low' : 
                 metrics.nutrition > 3000 ? '⚠️ Very high' : '✅ Balanced'}
              </p>
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(249, 115, 22, 0.2)',
              background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.9) 0%, rgba(255, 237, 213, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-amber-100 p-2 rounded-xl mr-3">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Activity</h3>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Daily Steps</label>
                <span className="text-xs text-gray-500">Goal: 8,000-10,000</span>
              </div>
              <div className="relative">
                <div className="relative">
                  <input
                    type="range"
                    value={metrics.activity || 0}
                    onChange={(e) => updateMetric('activity', Math.max(0, Math.min(20000, parseInt(e.target.value) || 0)))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    min="0"
                    max="20000"
                    step="100"
                  />
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
                    <span className="text-xs text-gray-500">0</span>
                    <span className="text-xs text-gray-500">10k</span>
                    <span className="text-xs text-gray-500">20k</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <button 
                    onClick={() => updateMetric('activity', Math.max(0, (metrics.activity || 0) - 500))}
                    className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    aria-label="Decrease steps"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={metrics.activity || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      updateMetric('activity', Math.max(0, Math.min(20000, value)));
                    }}
                    className="mx-3 w-24 text-center px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    min="0"
                    max="20000"
                    step="100"
                  />
                  <button 
                    onClick={() => updateMetric('activity', Math.min(20000, (metrics.activity || 0) + 500))}
                    className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    aria-label="Increase steps"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {metrics.activity < 5000 ? '⚠️ Sedentary' : 
                 metrics.activity > 10000 ? '🏆 Very active' : '✅ Active'}
              </p>
            </div>
          </motion.div>

          {/* Temperature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.35 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.2)',
              background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(207, 250, 254, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-xl mr-3">
                <Thermometer className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Temperature</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">°F</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={metrics.temperature}
                  onChange={(e) => updateMetric('temperature', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                  placeholder="98.6"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">°F</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Oxygen Saturation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.2)',
              background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.9) 0%, rgba(209, 250, 229, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-teal-100 p-2 rounded-xl mr-3">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Oxygen Saturation</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.oxygenSaturation}
                  onChange={(e) => updateMetric('oxygenSaturation', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
                  placeholder="98"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sleep Quality */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.45 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)',
              background: 'linear-gradient(135deg, rgba(237, 233, 254, 0.9) 0%, rgba(224, 231, 255, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-purple-100 p-2 rounded-xl mr-3">
                <Moon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sleep Quality</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scale (1-10)</label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={metrics.sleepQuality}
                  onChange={(e) => updateMetric('sleepQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Poor</span>
                  <span className="font-bold">{metrics.sleepQuality}</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Food Intake */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 30px -10px rgba(234, 179, 8, 0.2)',
              background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.9) 0%, rgba(254, 243, 199, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center mb-5">
              <div className="bg-yellow-100 p-2 rounded-xl mr-3">
                <Utensils className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Food Intake</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality (1-10)</label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={metrics.foodIntake}
                  onChange={(e) => updateMetric('foodIntake', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Poor</span>
                  <span className="font-bold">{metrics.foodIntake}</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeHealth}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
          >
            <Activity className="h-5 w-5" />
            <span>Analyze My Health</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('home')}
            className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-8 py-4 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Back to Home</span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="text-center text-sm text-gray-500 mb-4"
        >
          <p>Your health data is secure and private. We use industry-standard encryption to protect your information.</p>
        </motion.div>
      </div>
    </div>
  );
};