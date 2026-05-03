import React, { useState } from 'react';
import { Phone, MapPin, Star, Clock, ArrowLeft, User, Stethoscope } from 'lucide-react';
import { useDoctors } from '../context/DoctorContext';
import type { AppView } from '../types';

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

interface DoctorConsultationProps {
  onNavigate: (view: AppView) => void;
  diagnosisData?: DiagnosisData;
}

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({ onNavigate, diagnosisData }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('general');

  const specialties = [
    { id: 'general', name: 'General Medicine', icon: Stethoscope },
    { id: 'cardiology', name: 'Cardiology', icon: Stethoscope },
    { id: 'dermatology', name: 'Dermatology', icon: User },
    { id: 'orthopedic', name: 'Orthopedic', icon: User },
    { id: 'pediatric', name: 'Pediatric', icon: User },
    { id: 'psychiatry', name: 'Psychiatry', icon: User }
  ];

  const { doctors: allDoctors } = useDoctors();
  const doctorsForSpecialty = allDoctors.filter(d => d.specialtyId === selectedSpecialty);

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleFindDoctorsNearMe = () => {
    const specialtyName = specialties.find(s => s.id === selectedSpecialty)?.name || 'doctors';
    const searchQuery = `${specialtyName} near me`;
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getAvailabilityColor = (availability: string) => {
    return availability.includes('Today') 
      ? 'text-green-800 bg-green-100 border border-green-200' 
      : 'text-blue-800 bg-blue-50 border border-blue-100';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Consult with Doctors
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl">
              Connect with qualified healthcare professionals and book appointments easily
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('doctor-portal')}
              className="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              For Doctors
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center justify-center px-4 py-2 bg-white border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>
        </div>

        {diagnosisData && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border-l-4 border-blue-500 shadow-sm border-r border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <Stethoscope className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Based on Your Recent Diagnosis</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="bg-white px-3 py-1 rounded-full border border-blue-200 text-blue-700 font-medium shadow-sm">
                    {diagnosisData.condition}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full border border-amber-200 text-amber-700 font-medium shadow-sm">
                    {diagnosisData.severity} Severity
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full border border-green-200 text-green-700 font-medium shadow-sm">
                    {diagnosisData.confidence}% Confidence
                  </span>
                </div>
                <p className="mt-3 text-blue-700">
                  We recommend consulting with a healthcare professional for proper evaluation and treatment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Google Maps Integration */}
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-3 shadow-sm">
                <MapPin className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">LOCATION SERVICES</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Find {specialties.find(s => s.id === selectedSpecialty)?.name} Specialists
              </h3>
              <p className="text-blue-700 max-w-2xl">
                Discover top-rated {specialties.find(s => s.id === selectedSpecialty)?.name.toLowerCase()} specialists near you with verified reviews and instant booking options.
              </p>
            </div>
            <button
              onClick={handleFindDoctorsNearMe}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3.5 rounded-xl hover:shadow-xl font-semibold flex items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-200"
            >
              <span className="relative z-10 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-white" />
                Find Near Me
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Specialty Selection */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-blue-800">Browse by Specialty</h3>
            <span className="text-sm text-blue-600">{specialties.length} specializations</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((specialty) => {
              const isSelected = selectedSpecialty === specialty.id;
              return (
                <button
                  key={specialty.id}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                    isSelected 
                      ? 'border-blue-500 bg-white shadow-lg scale-[1.02]' 
                      : 'border-blue-100 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      SELECTED
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl mr-4 transition-colors ${
                      isSelected ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      <specialty.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className={`block font-semibold text-left ${
                        isSelected ? 'text-blue-800' : 'text-gray-700 group-hover:text-blue-700'
                      }`}>
                        {specialty.name}
                      </span>
                      <span className={`text-sm ${
                        isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                      }`}>
                        View specialists
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors List */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-800">
                {specialties.find(s => s.id === selectedSpecialty)?.name} Specialists
              </h3>
              <p className="text-blue-700">
                Top-rated doctors with verified credentials and patient reviews
              </p>
            </div>
            <div className="flex items-center bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100">
              <span className="text-sm font-medium text-blue-700">
                {doctorsForSpecialty.length} doctors available
              </span>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {doctorsForSpecialty.map((doctor, index) => (
              <div key={index} className="group bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="pr-4">
                      <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h4>
                      <p className="text-blue-600 font-medium">{doctor.specialtyName}</p>
                      <p className="text-gray-500 text-sm mt-1">{doctor.experience} experience</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400 mr-1" />
                    <span className="text-yellow-700 font-semibold">{doctor.rating}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6 mt  -2">
                  <div className="flex items-start bg-gray-50 p-3 rounded-xl">
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{doctor.address}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${getAvailabilityColor(doctor.availability)}`}>
                        {doctor.availability}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Consultation</span>
                      <span className="text-lg font-bold text-green-600">{doctor.consultationFee}</span>
                    </div>
                  </div>
                  <div className="pt-1 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-2">SPEAKS</span>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((lang, langIndex) => (
                          <span 
                            key={langIndex} 
                            className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    {doctor.mode && (
                      <div className="text-right">
                        <span className="text-xs font-medium text-gray-500 block mb-2">MODE</span>
                        <span className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          {doctor.mode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handlePhoneCall(doctor.phone)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg font-semibold flex items-center justify-center transition-all duration-300 hover:from-green-600 hover:to-teal-700"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </button>
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(doctor.address)}`, '_blank')}
                    className="flex-1 bg-white border-2 border-blue-100 text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-50 font-semibold flex items-center justify-center transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="bg-yellow-100 rounded-full p-2 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Use "Find Doctors Near Me" to search for specialists in your exact location</li>
                <li>• Please call ahead to confirm availability and book an appointment</li>
                <li>• Bring your insurance card and a valid ID</li>
                <li>• Arrive 15 minutes early for your appointment</li>
                <li>• Consultation fees may vary based on insurance coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};