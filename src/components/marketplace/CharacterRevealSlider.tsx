
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CharacterRevealSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CharacterRevealSlider: React.FC<CharacterRevealSliderProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);
  const [animateLabel, setAnimateLabel] = useState(false);
  
  useEffect(() => {
    // Detect direction of change
    if (value !== prevValue) {
      setIsIncreasing(value > prevValue);
      setPrevValue(value);
      
      // Trigger label animation
      setAnimateLabel(true);
      const timer = setTimeout(() => setAnimateLabel(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);
  
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  // Get the description text based on radiation value
  // Higher value = more radiation, character more obscured
  const getRevealDescription = (radiationValue: number) => {
    if (radiationValue > 90) {
      return "Fully obscured by toxic radiation cloud";
    } else if (radiationValue > 75) {
      return "Character silhouette barely visible through dense radiation";
    } else if (radiationValue > 60) {
      return "Radiation strong, character partially obscured";
    } else if (radiationValue > 40) {
      return "Character features becoming visible through radiation";
    } else if (radiationValue > 25) {
      return "Character mostly revealed, moderate radiation haze";
    } else if (radiationValue > 10) {
      return "Character clearly visible, slight radiation";
    } else {
      return "Character fully visible, minimal radiation";
    }
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {value < 50 ? (
            <Eye className="h-4 w-4 text-toxic-neon" />
          ) : (
            <EyeOff className="h-4 w-4 text-toxic-neon" />
          )}
          <span className="text-sm text-toxic-neon font-mono">RADIATION LEVEL</span>
        </div>
        <span className={cn(
          "text-sm font-mono transition-colors duration-300",
          value > 70 ? "text-apocalypse-red" : 
          value > 30 ? "text-yellow-400" : 
          "text-toxic-neon"
        )}>
          {value}%
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Eye className={cn(
          "h-5 w-5 transition-opacity duration-300",
          value > 70 ? "text-white/50" : "text-white"
        )} />
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleChange}
          className={cn(
            "flex-1",
            isIncreasing === true ? "animate-pulse" : "",
            isIncreasing === false ? "animate-pulse" : ""
          )}
        />
        <EyeOff className={cn(
          "h-5 w-5 transition-opacity duration-300",
          value < 30 ? "text-white/50" : "text-white"
        )} />
      </div>
      
      <div className={cn(
        "mt-2 text-xs text-center transition-all duration-300",
        animateLabel ? "scale-105" : "scale-100",
        value > 70 ? "text-apocalypse-red/80" : 
        value > 30 ? "text-yellow-400/80" : 
        "text-toxic-neon/80"
      )}>
        {getRevealDescription(value)}
      </div>
    </div>
  );
};
