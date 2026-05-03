import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, MapPin, Phone, Star, Navigation, AlertTriangle } from 'lucide-react';

import type { AppView } from '../types';

interface HospitalFinderProps {
  onNavigate: (view: AppView) => void;
}

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  error?: string;
}

interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  emergencyServices: boolean;
  specialties: string[];
  waitTime: string;
  beds: number;
  image: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

const HospitalFinder = ({ onNavigate }: HospitalFinderProps): JSX.Element => {
  // State
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hospital types for filtering
  const hospitalTypes = [
    { id: 'all', name: 'All Hospitals' },
    { id: 'emergency', name: 'Emergency Care' },
    { id: 'specialty', name: 'Specialty Centers' },
    { id: 'general', name: 'General Hospitals' },
    { id: 'clinic', name: 'Clinics' }
  ];

  // Sample hospitals data for different cities in Andhra Pradesh and Telangana
  const hospitals = useMemo<Hospital[]>(() => [
    // Vijayawada Hospitals
    {
      id: 'vij-1',
      name: 'Apollo Hospitals',
      type: 'General Hospital',
      address: 'NH-16 Service Road, Pinnamaneni Polyclinic',
      city: 'Vijayawada',
      phone: '0866 668 8888',
      rating: 4.5,
      emergencyServices: true,
      specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
      waitTime: '15-30 mins',
      beds: 250,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.5062,
      longitude: 80.6480
    },
    {
      id: 'vij-2',
      name: 'Manipal Hospitals',
      type: 'Multi-Specialty Hospital',
      address: 'Mangalagiri Road, Tadepalli',
      city: 'Vijayawada',
      phone: '0863 398 9898',
      rating: 4.4,
      emergencyServices: true,
      specialties: ['Cardiac Surgery', 'Neurosurgery', 'Cancer Care'],
      waitTime: '20-40 mins',
      beds: 300,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.5132,
      longitude: 80.6325
    },
    {
      id: 'vij-3',
      name: 'Vijaya Marie Hospital',
      type: 'Specialty Center',
      address: 'MG Road, Labbipet',
      city: 'Vijayawada',
      phone: '0866 257 5757',
      rating: 4.2,
      emergencyServices: true,
      specialties: ['Pediatrics', 'Gynecology', 'Fertility'],
      waitTime: '10-20 mins',
      beds: 120,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.5123,
      longitude: 80.6489
    },
    
    // Guntur Hospitals
    {
      id: 'gun-1',
      name: 'KIMS Cuddles Mother & Child Hospital',
      type: 'Specialty Center',
      address: 'Lakshmipuram, Arundalpet',
      city: 'Guntur',
      phone: '0863 225 5000',
      rating: 4.3,
      emergencyServices: true,
      specialties: ['Pediatrics', 'Neonatology', 'Obstetrics'],
      waitTime: '15-25 mins',
      beds: 100,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.3067,
      longitude: 80.4365
    },
    
    // Tenali Hospitals
    {
      id: 'ten-1',
      name: 'Sai Sree Hospital',
      type: 'General Hospital',
      address: 'Gandhi Road, Near Bus Stand',
      city: 'Tenali',
      phone: '08644 224 455',
      rating: 4.0,
      emergencyServices: true,
      specialties: ['General Medicine', 'General Surgery', 'Pediatrics'],
      waitTime: '10-20 mins',
      beds: 50,
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.2430,
      longitude: 80.6400
    },
    
    // Hyderabad Hospitals
    {
      id: 'hyd-1',
      name: 'Yashoda Hospitals',
      type: 'Multi-Specialty Hospital',
      address: 'Raj Bhavan Road, Somajiguda',
      city: 'Hyderabad',
      phone: '040 4567 4567',
      rating: 4.6,
      emergencyServices: true,
      specialties: ['Cardiology', 'Oncology', 'Transplants'],
      waitTime: '20-40 mins',
      beds: 400,
      image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4126,
      longitude: 78.4449
    },
    {
      id: 'hyd-2',
      name: 'Apollo Hospitals',
      type: 'Multi-Specialty Hospital',
      address: 'Jubilee Hills',
      city: 'Hyderabad',
      phone: '040 2360 7777',
      rating: 4.7,
      emergencyServices: true,
      specialties: ['Cardiac Sciences', 'Neurosciences', 'Orthopedics'],
      waitTime: '25-45 mins',
      beds: 350,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4360,
      longitude: 78.3950
    },
    {
      id: 'hyd-3',
      name: 'KIMS Hospitals',
      type: 'Multi-Specialty Hospital',
      address: '1-8-31/1, Minister Road, Secunderabad',
      city: 'Hyderabad',
      phone: '040 4488 5000',
      rating: 4.5,
      emergencyServices: true,
      specialties: ['Cardiology', 'Neurology', 'Gastroenterology'],
      waitTime: '20-35 mins',
      beds: 1000,
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4399,
      longitude: 78.4983
    },
    {
      id: 'hyd-4',
      name: 'Continental Hospitals',
      type: 'Multi-Specialty Hospital',
      address: 'Nanakramguda, Financial District',
      city: 'Hyderabad',
      phone: '040 6713 9999',
      rating: 4.4,
      emergencyServices: true,
      specialties: ['Organ Transplant', 'Oncology', 'Cardiac Sciences'],
      waitTime: '15-30 mins',
      beds: 750,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4126,
      longitude: 78.3248
    },
    
    // Clinics in Hyderabad
    {
      id: 'hyd-clinic-1',
      name: 'Care Clinic',
      type: 'Clinic',
      address: 'Banjara Hills, Road No. 1',
      city: 'Hyderabad',
      phone: '040 1234 5678',
      rating: 4.2,
      emergencyServices: false,
      specialties: ['General Medicine', 'Pediatrics', 'Dermatology'],
      waitTime: '10-20 mins',
      beds: 5,
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4259,
      longitude: 78.4525
    },
    {
      id: 'hyd-clinic-2',
      name: 'City Health Clinic',
      type: 'Clinic',
      address: 'Ameerpet, Near Metro Station',
      city: 'Hyderabad',
      phone: '040 2345 6789',
      rating: 4.0,
      emergencyServices: false,
      specialties: ['General Medicine', 'Dermatology', 'ENT'],
      waitTime: '15-25 mins',
      beds: 3,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4375,
      longitude: 78.4482
    },
    
    // Emergency Care Centers
    {
      id: 'hyd-emer-1',
      name: 'AIG Hospitals Emergency',
      type: 'Emergency Care',
      address: 'Mindspace Road, Gachibowli',
      city: 'Hyderabad',
      phone: '040 2415 1234',
      rating: 4.5,
      emergencyServices: true,
      specialties: ['Trauma Care', 'Cardiac Emergencies', 'Stroke Care'],
      waitTime: '5-15 mins',
      beds: 30,
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 17.4401,
      longitude: 78.3489
    },
    {
      id: 'vij-emer-1',
      name: 'Vijayawada Emergency Care',
      type: 'Emergency Care',
      address: 'Benz Circle',
      city: 'Vijayawada',
      phone: '0866 247 7777',
      rating: 4.3,
      emergencyServices: true,
      specialties: ['Trauma Care', 'Accident & Emergency'],
      waitTime: '5-10 mins',
      beds: 20,
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      latitude: 16.5156,
      longitude: 80.6385
    }
  ], []);

  // Function to calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || 'your location';
          setUserLocation({ latitude, longitude, city });
          setLocationError('');
        })
        .catch(() => {
          setUserLocation({ latitude, longitude });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    const error = () => {
      setLocationError('Unable to retrieve your location. Using default location.');
      setUserLocation({
        latitude: 17.3850, // Default to Hyderabad
        longitude: 78.4867,
        city: 'Hyderabad'
      });
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  // Process hospitals data with distances and filter by proximity
  const processedHospitals = useMemo(() => {
    if (!userLocation) return [];

    return hospitals
      .map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hospital.latitude,
          hospital.longitude
        )
      }))
      .filter(hospital => hospital.distance <= 50) // Within 50km
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 10); // Top 10 nearest
  }, [hospitals, userLocation]);

  // Filter hospitals by selected type
  const filteredHospitals = useMemo(() => {
    return processedHospitals.filter(hospital => 
      selectedType === 'all' || hospital.type.toLowerCase().includes(selectedType)
    );
  }, [processedHospitals, selectedType]);

  const handleDirections = (hospital: Hospital) => {
    if (!userLocation) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.latitude},${hospital.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Safely access user location properties
  const userCity = userLocation?.city || 'your area';
  const showCityInHeader = userLocation?.city 
    ? `Showing hospitals near ${userCity}` 
    : 'Enable location services to find hospitals near you';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Find Hospitals Near You
              </h1>
              <p className="text-lg text-blue-700 max-w-2xl">
                {showCityInHeader}
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

          {/* Filters */}
          <div className="grid md:grid-cols-1 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hospital Type</h3>
              <div className="space-y-2">
                {hospitalTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h4 className="text-lg font-semibold text-red-800">Emergency? Call 108</h4>
                <p className="text-red-700">For life-threatening emergencies, call 108 immediately or go to the nearest emergency room.</p>
              </div>
            </div>
          </div>

          {/* Hospitals List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Finding hospitals near you...</p>
              </div>
            ) : locationError ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {locationError} Using default location in Hyderabad.
                    </p>
                  </div>
                </div>
              </div>
            ) : filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img className="h-48 w-full object-cover md:w-48" src={hospital.image} alt={hospital.name} />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-900">{hospital.name}</h2>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(hospital.type)}`}>
                            {hospital.type}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{hospital.address}, {hospital.city}</span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{hospital.rating}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{hospital.waitTime} wait</span>
                          {hospital.distance !== undefined && (
                            <>
                              <span className="mx-2">•</span>
                              <Navigation className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{hospital.distance.toFixed(1)} km away</span>
                            </>
                          )}
                        </div>
                        {hospital.emergencyServices && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                              24/7 Emergency Services
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDirections(hospital)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Directions
                        </button>
                        <button
                          onClick={() => handleCall(hospital.phone)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          {hospital.phone}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No hospitals found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedType !== 'all' 
                    ? 'No hospitals match the selected filters.' 
                    : 'No hospitals found near your location. Try expanding your search area.'}
                </p>
                {selectedType !== 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedType('all')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Show all hospitals
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Services Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Location Services</h4>
                <p className="text-blue-700 text-sm mb-2">
                  {userLocation 
                    ? `Showing hospitals within 50km of your location in ${userCity}.`
                    : 'For more accurate results, enable location services in your browser to find hospitals near your current location.'
                  }
                </p>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Click "Get Directions" to open Google Maps with turn-by-turn navigation</li>
                  <li>• Call ahead to confirm availability and reduce wait times</li>
                  <li>• In case of emergency, always call 108 first</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on hospital type
const getTypeColor = (type: string): string => {
  switch (type) {
    case 'Emergency Care': return 'bg-red-100 text-red-800';
    case 'General Hospital': return 'bg-blue-100 text-blue-800';
    case 'Specialty Center': return 'bg-purple-100 text-purple-800';
    case 'Clinic': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default HospitalFinder;
