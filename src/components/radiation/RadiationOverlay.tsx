
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface RadiationOverlayProps {
  radiationLevel: number;  // 0-100, where 100 is fully covered
  className?: string;
  onComplete?: () => void;
  animate?: boolean;
  children: React.ReactNode;
  useCloudModel?: boolean; // Whether to use the 3D radiation cloud model
}

export function RadiationOverlay({ 
  radiationLevel, 
  className = "", 
  onComplete, 
  animate = true,
  children,
  useCloudModel = false
}: RadiationOverlayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRadiation, setCurrentRadiation] = useState(radiationLevel);
  
  // Calculate opacity based on radiation level (inverse relationship)
  const overlayOpacity = currentRadiation / 100;
  
  // Define radiation colors based on level
  const getRadiationColor = (level: number) => {
    if (level > 90) return 'from-apocalypse-red/90 to-apocalypse-red/70';
    if (level > 70) return 'from-orange-500/90 to-orange-500/70';
    if (level > 40) return 'from-amber-400/80 to-amber-400/60';
    if (level > 10) return 'from-toxic-neon/70 to-toxic-neon/50';
    return 'from-toxic-neon/30 to-toxic-neon/10';
  };
  
  // Animate radiation dissipation effect
  useEffect(() => {
    setIsLoading(true);
    
    if (animate) {
      // Simulate radiation burning away
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, [animate, radiationLevel]);
  
  // Animate radiation level change
  useEffect(() => {
    if (animate && !isLoading) {
      // Start at 100% radiation
      setCurrentRadiation(100);
      
      // Animate down to actual radiation level
      const interval = setInterval(() => {
        setCurrentRadiation(prev => {
          if (prev <= radiationLevel) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return radiationLevel;
          }
          return prev - 1;
        });
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      setCurrentRadiation(radiationLevel);
    }
  }, [radiationLevel, animate, isLoading, onComplete]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Content (NFT or 3D model) */}
      {children}
      
      {/* Radiation overlay */}
      {currentRadiation > 0 && (
        <motion.div
          initial={{ opacity: overlayOpacity }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${getRadiationColor(currentRadiation)} backdrop-blur-sm z-10`}
        >
          {/* Radiation particles effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-toxic-neon/20 to-transparent opacity-70"></div>
          
          {/* Animated radiation scan lines */}
          <div className="absolute inset-0 bg-repeat-y bg-[length:100%_8px] radiation-scan-lines"></div>
          
          {/* Animated pulse circles */}
          <div className="radiation-pulse-circles absolute inset-0 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-toxic-neon/10 animate-ping"></div>
            <div className="absolute w-32 h-32 rounded-full bg-toxic-neon/5 animate-ping animation-delay-300"></div>
          </div>
        </motion.div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <Loader2 className="h-8 w-8 text-toxic-neon animate-spin" />
        </div>
      )}
    </div>
  );
}
