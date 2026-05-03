import React from 'react';
import { Stethoscope, Camera, Activity, HeartPulse, Pill, Heart, ActivitySquare, Brain, Syringe, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AppView } from '../types';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Stethoscope,
      title: 'Check Symptoms',
      description: 'Select your symptoms and get AI-powered health insights',
      action: () => onNavigate('symptoms'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Camera,
      title: 'Upload Medical Image',
      description: 'Analyze medical scans and get detailed reports',
      action: () => onNavigate('image'),
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      icon: Activity,
      title: 'Health Dashboard',
      description: 'Track your vital signs and health metrics',
      action: () => onNavigate('dashboard'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const healthIcons = [
    { icon: <HeartPulse className="w-8 h-8" />, delay: 0.1 },
    { icon: <Pill className="w-7 h-7" />, delay: 0.2 },
    { icon: <Heart className="w-7 h-7" />, delay: 0.3 },
    { icon: <ActivitySquare className="w-7 h-7" />, delay: 0.4 },
    { icon: <Brain className="w-7 h-7" />, delay: 0.5 },
    { icon: <Syringe className="w-7 h-7" />, delay: 0.6 },
    { icon: <Thermometer className="w-7 h-7" />, delay: 0.7 },
    { icon: <Stethoscope className="w-7 h-7" />, delay: 0.8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-24">
        <div className="relative">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Welcome to </span>
            <motion.span 
              className="relative inline-block"
              whileHover={{ scale: 1.02 }}
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                Healthify
              </span>
              <span className="absolute inset-0 z-20 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                Healthify
              </span>
            </motion.span>
          </h1>
          
          {/* Floating Icons */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-full flex justify-center gap-8 flex-wrap">
            {healthIcons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.5 + (index * 0.1),
                  type: 'spring',
                  stiffness: 200,
                  damping: 10
                }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-blue-200/80 hover:text-white transition-all duration-300"
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium animate-slide-up" 
           style={{ animationDelay: '0.2s' }}>
          Your AI-powered health companion for symptom checking, medical image analysis, 
          and comprehensive health monitoring.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => onNavigate('symptoms')}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="relative overflow-hidden group bg-transparent text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:border-white/60 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>View Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-right">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-52 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        {features.map((feature) => (
          <div 
            key={feature.title}
            onClick={feature.action}
            className={`group p-8 rounded-2xl cursor-pointer transition-all duration-500 backdrop-blur-sm bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/20 transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`w-16 h-16 ${feature.color.replace('hover:bg', 'bg')} rounded-xl flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-white/80 group-hover:text-white transition-colors duration-300 mb-6">
                {feature.description}
              </p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-blue-300 font-medium inline-flex items-center gap-1 group-hover:text-blue-200 transition-colors">
                  Try it now
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Us Section */}
      <div className="mt-32 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/20 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center mb-8 text-white">
            About Us
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-white/90 text-center mb-10 leading-relaxed font-medium">
              Healthify is a revolutionary healthcare platform that leverages AI to provide personalized health insights and connect users with medical professionals. 
              Our mission is to make healthcare more accessible, efficient, and effective for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: '⚡', 
                  title: 'Fast & Accurate', 
                  description: 'Get instant health insights with our advanced AI technology',
                  color: 'from-blue-400 to-cyan-300'
                },
                { 
                  icon: '👨‍⚕️', 
                  title: 'Expert Doctors', 
                  description: 'Connect with experienced healthcare professionals',
                  color: 'from-blue-500 to-teal-400'
                },
                { 
                  icon: '🔒', 
                  title: 'Secure & Private', 
                  description: 'Your health data is always protected and confidential',
                  color: 'from-teal-500 to-blue-400'
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 rounded-2xl text-center transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg border border-white/5 overflow-hidden relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className={`absolute -z-10 -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500`}></div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};