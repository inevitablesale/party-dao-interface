
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Lock, LockKeyhole, Terminal, ArrowRight, Check, AlertTriangle } from 'lucide-react';

interface BreachSequenceProps {
  onComplete: () => void;
}

export const BreachSequence: React.FC<BreachSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  // Breach sequence phases
  const phases = [
    { icon: LockKeyhole, text: "BYPASSING SECURITY", delay: 400 },
    { icon: Terminal, text: "ACCESSING NETWORK", delay: 400 },
    { icon: Zap, text: "INJECTING PROTOCOLS", delay: 400 },
    { icon: Shield, text: "SECURING CONNECTION", delay: 400 },
    { icon: Check, text: "ACCESS GRANTED", delay: 400 }
  ];

  useEffect(() => {
    // Initial glitch effect
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 300);
    
    // Progress animation - faster at 70ms intervals
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 8; // Faster increment to complete in ~875ms
      });
    }, 70);
    
    // Phase transitions
    let phaseTimeout: NodeJS.Timeout;
    const advancePhase = (index: number) => {
      if (index < phases.length) {
        setCurrentPhase(index);
        
        if (index < phases.length - 1) {
          phaseTimeout = setTimeout(() => advancePhase(index + 1), phases[index].delay);
        }
      }
    };
    
    // Start phase transitions
    advancePhase(0);
    
    // Complete after 2 seconds total
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      onComplete();
    }, 2000);
    
    return () => {
      clearInterval(progressInterval);
      if (phaseTimeout) clearTimeout(phaseTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Matrix-like data streams in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="data-stream-container">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="data-stream" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDuration: `${Math.random() * 2 + 1}s`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            >
              {[...Array(10)].map((_, j) => (
                <div key={j} className="text-toxic-neon/30 font-mono text-sm">
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Glitch overlay */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div 
            className="absolute inset-0 bg-toxic-neon/10 mix-blend-screen z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>
      
      {/* Scan lines */}
      <div className="scanline absolute inset-0 pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        <motion.div 
          className="bg-black/80 border border-toxic-neon/30 p-6 rounded-lg relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar */}
          <div className="h-2 w-full bg-white/10 mb-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-toxic-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-toxic-neon/20 flex items-center justify-center mb-2">
                {React.createElement(phases[currentPhase].icon, { className: "h-6 w-6 text-toxic-neon animate-pulse" })}
              </div>
              
              <h2 className="text-xl text-center font-mono text-toxic-neon mb-1">
                {phases[currentPhase].text}
              </h2>
            </motion.div>
          </AnimatePresence>
          
          <div className="text-center font-mono text-sm text-toxic-neon/70 mt-2">
            <span className="inline-block mr-1 text-apocalypse-red">&gt;</span> 
            BREACH PROTOCOL {Math.floor(progress)}% COMPLETE
          </div>
        </motion.div>
      </div>
    </div>
  );
};
