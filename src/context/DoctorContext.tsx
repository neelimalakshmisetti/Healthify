import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialtyName: string;
  experience: string;
  rating: number;
  phone: string;
  address: string;
  availability: string;
  consultationFee: string;
  languages: string[];
  mode: string;
  qualifications: string;
  imageUrl?: string;
}

interface DoctorContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;
}

const defaultDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Rajesh Kumar',
    specialtyId: 'general',
    specialtyName: 'General Medicine',
    experience: '15 years',
    rating: 4.8,
    phone: '+91 98 1234 5678',
    address: 'H.No. 8-2-293/82, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    availability: 'Available Today',
    consultationFee: '₹1000',
    languages: ['English', 'Hindi', 'Telugu'],
    mode: 'Offline',
    qualifications: 'MBBS, MD',
  },
  {
    id: 'd2',
    name: 'Dr. Priya Sharma',
    specialtyId: 'general',
    specialtyName: 'Family Medicine',
    experience: '12 years',
    rating: 4.7,
    phone: '+91 97 8765 4321',
    address: 'Flat No. 302, Sri Sai Residency, Banjara Hills, Hyderabad - 500034',
    availability: 'Available Tomorrow',
    consultationFee: '₹1200',
    languages: ['English', 'Hindi', 'Telugu'],
    mode: 'Both',
    qualifications: 'MBBS, DNB',
  },
  {
    id: 'd3',
    name: 'Dr. Sanjay Mehra',
    specialtyId: 'cardiology',
    specialtyName: 'Cardiology',
    experience: '22 years',
    rating: 4.9,
    phone: '+91 98 7654 3210',
    address: '8-2-350, Road No. 3, Banjara Hills, Hyderabad - 500034',
    availability: 'Available Tomorrow',
    consultationFee: '₹2000',
    languages: ['English', 'Hindi', 'Telugu'],
    mode: 'Offline',
    qualifications: 'MBBS, MD, DM',
  },
  {
    id: 'd4',
    name: 'Dr. Ayesha Khan',
    specialtyId: 'dermatology',
    specialtyName: 'Dermatology',
    experience: '14 years',
    rating: 4.7,
    phone: '+91 99 8888 7777',
    address: '3-6-366, Street No. 10, Himayatnagar, Hyderabad - 500029',
    availability: 'Available Today',
    consultationFee: '₹1500',
    languages: ['English', 'Hindi', 'Urdu'],
    mode: 'Online',
    qualifications: 'MBBS, MD',
  }
];

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('healthify_doctors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse doctors from local storage', e);
      }
    }
    return defaultDoctors;
  });

  useEffect(() => {
    localStorage.setItem('healthify_doctors', JSON.stringify(doctors));
  }, [doctors]);

  const addDoctor = (doctor: Doctor) => {
    setDoctors(prev => [...prev, doctor]);
  };

  const updateDoctor = (id: string, updatedDoctor: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === id ? updatedDoctor : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctors must be used within a DoctorProvider');
  }
  return context;
};
