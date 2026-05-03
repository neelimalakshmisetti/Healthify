import React from 'react';
import { Heart, Home, Stethoscope, Camera, Activity, UserCheck, MapPin } from 'lucide-react';
import type { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'doctors', label: 'Doctors', icon: UserCheck },
    { id: 'hospitals', label: 'Hospitals', icon: MapPin },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Heart className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
              Healthify
            </span>
          </div>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = currentView === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id as AppView)}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg'
                      : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-teal-500/30'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} 
                  />
                  <span className="font-medium">{label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 w-4 h-1 bg-white rounded-full -translate-x-1/2" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="md:hidden">
            <select
              value={currentView}
              onChange={(e) => onNavigate(e.target.value as AppView)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-blue-500 to-teal-500 text-white"
            >
              {navItems.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};