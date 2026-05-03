import React, { useEffect, useRef, useMemo } from 'react';
import { 
  HeartPulse, Stethoscope, Activity, Pill, Thermometer, 
  Syringe, Bone, Brain, ActivitySquare, TestTube2, 
  Microscope, Droplets, Shield, Eye, Heart 
} from 'lucide-react';

// Define icon configurations with different sizes and animations
const iconConfigs = [
  { icon: <HeartPulse size={24} />, size: 'text-xl', delay: 0, duration: 8 },
  { icon: <Stethoscope size={20} />, size: 'text-lg', delay: 1, duration: 10 },
  { icon: <Activity size={22} />, size: 'text-xl', delay: 2, duration: 9 },
  { icon: <Pill size={18} />, size: 'text-base', delay: 0.5, duration: 7 },
  { icon: <Thermometer size={20} />, size: 'text-lg', delay: 1.5, duration: 8 },
  { icon: <Syringe size={22} />, size: 'text-xl', delay: 0.8, duration: 9 },
  { icon: <Bone size={18} />, size: 'text-base', delay: 1.2, duration: 7 },
  { icon: <Brain size={24} />, size: 'text-xl', delay: 0.3, duration: 10 },
  { icon: <ActivitySquare size={20} />, size: 'text-lg', delay: 1.7, duration: 8 },
  { icon: <TestTube2 size={22} />, size: 'text-xl', delay: 0.6, duration: 9 },
  { icon: <Microscope size={20} />, size: 'text-lg', delay: 1.1, duration: 8 },
  { icon: <Droplets size={18} />, size: 'text-base', delay: 0.9, duration: 7 },
  { icon: <Shield size={20} />, size: 'text-lg', delay: 0.4, duration: 8 },
  { icon: <Eye size={18} />, size: 'text-base', delay: 1.3, duration: 7 },
  { icon: <Heart size={22} />, size: 'text-xl', delay: 0.7, duration: 9 },
];

interface FloatingIconProps {
  icon: React.ReactNode;
  initialX: number;
  initialY: number;
  delay: number;
  duration: number;
  size: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ 
  icon, 
  initialX, 
  initialY, 
  delay, 
  size 
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTime = useRef<number>();
  const amplitude = useMemo(() => 15 + Math.random() * 10, []); // Random amplitude between 15-25
  const frequency = useMemo(() => 0.3 + Math.random() * 0.3, []); // Random frequency between 0.3-0.6

  useEffect(() => {
    const iconElement = iconRef.current;
    if (!iconElement) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = (timestamp - startTime.current) / 1000; // Convert to seconds
      
      // Smooth floating animation with random offsets
      const y = Math.sin(elapsed * frequency) * amplitude;
      const x = Math.sin(elapsed * frequency * 0.7) * (amplitude * 0.5);
      const rotation = Math.sin(elapsed * frequency * 0.5) * 10; // Gentle rotation
      
      iconElement.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      
      // Fade in/out effect
      const fadeInOut = 0.5 + 0.5 * Math.sin(elapsed * 0.5);
      iconElement.style.opacity = `${0.5 + 0.5 * fadeInOut}`;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      startTime.current = undefined;
      animationRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [delay, frequency, amplitude]);

  return (
    <div
      ref={iconRef}
      className={`absolute ${size} text-blue-200/80 hover:text-white transition-all duration-1000`}
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      {icon}
    </div>
  );
};

const HealthIcons = () => {
  // Use fixed vw units for consistent spacing
  const gapVW = 5; // 5vw gap between icons
  
  // Define content area (80% of viewport width, centered)
  const contentStart = 10; // 10% from left
  const contentEnd = 90;   // 90% from left
  const contentTop = 10;   // 10% from top
  const contentBottom = 90; // 90% from top
  
  // Calculate how many icons can fit in a row and column
  const iconSizeVW = 5; // Approximate icon size in vw
  const iconsPerRow = Math.floor((contentEnd - contentStart) / (iconSizeVW + gapVW));
  const iconsPerCol = Math.floor((contentBottom - contentTop) / (iconSizeVW + gapVW));
  const totalPossibleIcons = iconsPerRow * iconsPerCol;
  
  // Limit the number of icons to fit the grid
  const visibleIcons = Math.min(iconConfigs.length, totalPossibleIcons);
  
  // Generate grid positions
  const positions = useMemo(() => {
    const grid: {x: number, y: number}[] = [];
    
    // Calculate exact positions in a grid
    for (let row = 0; row < iconsPerCol; row++) {
      for (let col = 0; col < iconsPerRow; col++) {
        // Add some randomness to the position (±1vw)
        const randomX = (Math.random() - 0.5) * 2;
        const randomY = (Math.random() - 0.5) * 2;
        
        // Calculate position with gap
        const x = contentStart + (col * (iconSizeVW + gapVW)) + (iconSizeVW / 2) + randomX;
        const y = contentTop + (row * (iconSizeVW + gapVW)) + (iconSizeVW / 2) + randomY;
        
        grid.push({ x, y });
      }
    }
    
    // Shuffle the positions randomly
    return grid.sort(() => Math.random() - 0.5);
  }, [iconsPerRow, iconsPerCol]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {iconConfigs.slice(0, visibleIcons).map((config, index) => {
        const position = positions[index % positions.length];
        
        return (
          <FloatingIcon 
            key={index}
            icon={config.icon}
            size={config.size}
            initialX={position.x}
            initialY={position.y}
            delay={config.delay}
            duration={config.duration}
          />
        );
      })}
    </div>
  );
};

export default HealthIcons;
