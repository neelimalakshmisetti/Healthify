import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DoctorProvider } from './context/DoctorContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DoctorProvider>
      <App />
    </DoctorProvider>
  </StrictMode>
);
