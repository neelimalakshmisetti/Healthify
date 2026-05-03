import React, { useState } from 'react';
import { MapPin, Star, Clock, ArrowLeft, Phone, ExternalLink, Ambulance, HeartPulse, Stethoscope } from 'lucide-react';
import { AppView } from '../App';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  availability: string;
  phone: string;
  specialties: string[];
  emergency: boolean;
  image: string;
}

interface HospitalsProps {
  onNavigate: (view: AppView) => void;
}

const Hospitals: React.FC<HospitalsProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const specialties = [
    { id: 'all', name: 'All Specialties', icon: Stethoscope },
    { id: 'cardiology', name: 'Cardiology', icon: HeartPulse },
    { id: 'orthopedics', name: 'Orthopedics', icon: Stethoscope },
    { id: 'neurology', name: 'Neurology', icon: Stethoscope },
    { id: 'pediatrics', name: 'Pediatrics', icon: Stethoscope },
    { id: 'oncology', name: 'Oncology', icon: Stethoscope },
  ];

  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, City, State 10001',
      distance: '1.2 miles',
      rating: 4.7,
      reviewCount: 1243,
      availability: '24/7 Emergency',
      phone: '+1 (555) 123-4567',
      specialties: ['Cardiology', 'Neurology', 'Emergency'],
      emergency: true,
      image: '/hospital-1.jpg',
    },
    {
      id: '2',
      name: 'Sunrise Medical Center',
      address: '456 Health Ave, City, State 10002',
      distance: '2.5 miles',
      rating: 4.5,
      reviewCount: 987,
      availability: 'Open 24/7',
      phone: '+1 (555) 234-5678',
      specialties: ['Orthopedics', 'Pediatrics'],
      emergency: true,
      image: '/hospital-2.jpg',
    },
    {
      id: '3',
      name: 'Pineview Community Hospital',
      address: '789 Wellness Blvd, City, State 10003',
      distance: '3.1 miles',
      rating: 4.3,
      reviewCount: 754,
      availability: 'Open until 10 PM',
      phone: '+1 (555) 345-6789',
      specialties: ['Oncology', 'Neurology'],
      emergency: false,
      image: '/hospital-3.jpg',
    },
  ];

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                           hospital.specialties.some(spec => 
                             spec.toLowerCase() === selectedSpecialty.toLowerCase()
                           );
    return matchesSearch && matchesSpecialty;
  });

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getAvailabilityColor = (availability: string) => {
    return availability.includes('24/7') 
      ? 'text-green-800 bg-green-100 border border-green-200' 
      : 'text-blue-800 bg-blue-50 border border-blue-100';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Find Hospitals Near You
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl">
              Locate nearby hospitals and medical facilities with emergency services
            </p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center justify-center px-5 py-2.5 bg-white border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 font-medium shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 mr-2 text-blue-600 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-blue-800 mb-2">
                Search Hospitals
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or location..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-blue-800 mb-2">
                Filter by Specialty
              </label>
              <div className="relative">
                <select
                  id="specialty"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none appearance-none bg-white cursor-pointer transition-all duration-200"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialty Quick Filters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Quick Filters</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSpecialty('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSpecialty === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-700 border-2 border-blue-100 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              All Hospitals
            </button>
            {specialties.slice(1).map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                  selectedSpecialty === specialty.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-blue-700 border-2 border-blue-100 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <specialty.icon className="h-4 w-4 mr-2" />
                {specialty.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hospitals List */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-800">
                {selectedSpecialty === 'all' ? 'All' : specialties.find(s => s.id === selectedSpecialty)?.name} Hospitals
              </h3>
              <p className="text-blue-700">
                Showing {filteredHospitals.length} {filteredHospitals.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <div className="flex items-center bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100 mt-2 sm:mt-0">
              <span className="text-sm font-medium text-blue-700">
                Sorted by: <span className="font-semibold">Distance</span>
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="group bg-white rounded-2xl border-2 border-blue-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row">
                    {/* Hospital Image */}
                    <div className="w-full md:w-48 h-40 bg-blue-100 rounded-xl overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                        <HospitalIcon emergency={hospital.emergency} />
                      </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-400 mr-1" />
                              <span className="text-sm font-medium text-yellow-700">
                                {hospital.rating} ({hospital.reviewCount.toLocaleString()})
                              </span>
                            </div>
                            {hospital.emergency && (
                              <span className="ml-2 bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-100 flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                                24/7 Emergency
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-sm text-blue-700">
                          <span className="font-medium">{hospital.distance} away</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start">
                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-blue-700">{hospital.address}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hospital.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <Clock className="h-5 w-5 text-amber-500 mr-2" />
                          <span className={`text-sm px-3 py-1 rounded-full font-medium ${getAvailabilityColor(hospital.availability)}`}>
                            {hospital.availability}
                          </span>
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                          <button
                            onClick={() => handlePhoneCall(hospital.phone)}
                            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg font-medium flex items-center justify-center transition-all duration-300 hover:from-blue-700 hover:to-teal-700 flex-1 sm:flex-none"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </button>
                          <button
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`, '_blank')}
                            className="bg-white border-2 border-blue-100 text-blue-700 px-5 py-2.5 rounded-xl hover:bg-blue-50 font-medium flex items-center justify-center transition-all duration-300 hover:border-blue-200 hover:shadow-md flex-1 sm:flex-none"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-blue-800">No hospitals found</h3>
                <p className="mt-1 text-blue-600">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('all');
                  }}
                  className="mt-4 px-4 py-2 bg-white border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for hospital icons
const HospitalIcon: React.FC<{ emergency: boolean }> = ({ emergency }) => {
  if (emergency) {
    return (
      <div className="text-center">
        <Ambulance className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <span className="text-sm font-medium text-red-700">Emergency</span>
      </div>
    );
  }
  
  return (
    <div className="text-center">
      <HeartPulse className="h-12 w-12 text-blue-500 mx-auto mb-2" />
      <span className="text-sm font-medium text-blue-700">Medical Center</span>
    </div>
  );
};

export default Hospitals;
