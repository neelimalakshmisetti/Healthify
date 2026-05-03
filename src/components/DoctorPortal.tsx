import React, { useState } from 'react';
import { useDoctors, Doctor } from '../context/DoctorContext';
import { ArrowLeft, UserPlus, Save, CheckCircle } from 'lucide-react';
import type { AppView } from '../types';

interface DoctorPortalProps {
  onNavigate: (view: AppView) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ onNavigate }) => {
  const { addDoctor } = useDoctors();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialtyId: 'general',
    specialtyName: 'General Medicine',
    experience: '',
    phone: '',
    address: '',
    availability: 'Available Today',
    consultationFee: '',
    languages: '',
    mode: 'Both',
    qualifications: ''
  });

  const specialties = [
    { id: 'general', name: 'General Medicine' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'orthopedic', name: 'Orthopedic' },
    { id: 'pediatric', name: 'Pediatric' },
    { id: 'psychiatry', name: 'Psychiatry' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'specialtyId') {
        const spec = specialties.find(s => s.id === value);
        if (spec) updated.specialtyName = spec.name;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDoctor: Doctor = {
      id: `doc_${Date.now()}`,
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      specialtyId: formData.specialtyId,
      specialtyName: formData.specialtyName,
      experience: formData.experience,
      rating: 5.0, // Default for new doctors
      phone: formData.phone,
      address: formData.address,
      availability: formData.availability,
      consultationFee: formData.consultationFee.startsWith('₹') ? formData.consultationFee : `₹${formData.consultationFee}`,
      languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
      mode: formData.mode,
      qualifications: formData.qualifications
    };

    addDoctor(newDoctor);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onNavigate('doctors');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Doctor Portal
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl">
              Register your profile to connect with patients
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="group flex items-center justify-center px-5 py-2.5 bg-white border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Doctors
          </button>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">Profile Added Successfully!</h3>
            <p className="text-green-700">Redirecting to patient view...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-800 border-b pb-2">Basic Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select
                    name="specialtyId"
                    value={formData.specialtyId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {specialties.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                  <input
                    required
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="e.g., MBBS, MD"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    required
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g., 10 years"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Clinic & Consultation Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-800 border-b pb-2">Consultation Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic/Hospital Address</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                    <input
                      required
                      type="text"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      placeholder="e.g., 1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Consultation</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Online">Online Only</option>
                      <option value="Offline">Offline Only</option>
                      <option value="Both">Both (Online & Offline)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <input
                      required
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      placeholder="e.g., Available Today"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                    <input
                      required
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="English, Hindi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3.5 rounded-xl hover:shadow-lg font-semibold flex items-center justify-center transition-all duration-300"
              >
                <Save className="h-5 w-5 mr-2" />
                Publish Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
