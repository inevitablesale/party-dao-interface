
import React, { useState } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicButton } from '@/components/ui/toxic-button';
import { User, Shield, Zap, Target, Award, Flag, Network, BookOpen, Radiation, Eye, Hammer, X, Plus, ChevronDown } from 'lucide-react';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { motion } from 'framer-motion';

interface CharacterProgressProps {
  className?: string;
  role?: 'sentinel' | 'pioneer' | undefined;
}

export function CharacterProgress({ className, role }: CharacterProgressProps) {
  const { isConnected } = useCustomWallet();
  const [viewingModel, setViewingModel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // This would come from actual user data in production
  const characterStats = {
    level: 2,
    reputation: 65,
    influence: 42,
    radiation: 28,
    territories: 3,
    chronicles: 8,
    achievements: 5
  };
  
  // Character model based on role
  const characterModel = role === 'sentinel' 
    ? "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
    : "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa";
  
  // Calculate XP percentage to next level
  const levelProgress = ((characterStats.level % 1) * 100) || 75;
  
  // Determine character class based on role
  const characterRole = role || 'sentinel';
  const getRoleColor = () => {
    return characterRole === 'sentinel' ? 'text-purple-400' : 'text-amber-400';
  };
  
  const getRoleBadge = () => {
    if (characterRole === 'sentinel') {
      return (
        <ToxicBadge variant="marketplace" className="bg-purple-900/60 text-purple-300 absolute top-3 right-3 z-10">
          <Eye className="w-3 h-3 mr-1" /> SENTINEL
        </ToxicBadge>
      );
    } else {
      return (
        <ToxicBadge variant="marketplace" className="bg-amber-900/60 text-amber-300 absolute top-3 right-3 z-10">
          <Hammer className="w-3 h-3 mr-1" /> PIONEER
        </ToxicBadge>
      );
    }
  };
  
  const toggleModel = () => {
    setViewingModel(!viewingModel);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <ToxicCard className={`bg-black/70 border-toxic-neon/30 p-0 relative overflow-hidden ${className} hover:border-toxic-neon/60 transition-all`}>
      <div className="scanline"></div>
      
      {/* Card Header - Fixed height */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-toxic-neon/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-toxic-neon/10">
            <User className="w-4 h-4 text-toxic-neon" />
          </div>
          <h3 className="text-lg font-mono text-toxic-neon">SURVIVOR PROFILE</h3>
        </div>
        <div className="text-sm text-toxic-neon font-mono">
          Lvl {Math.floor(characterStats.level)}
        </div>
      </div>
      
      {/* Image/Model Container - Fixed height */}
      <div className="relative h-64 w-full bg-gradient-to-b from-black/30 to-black/90">
        {getRoleBadge()}
        
        {/* 3D Model View */}
        <ModelPreview 
          modelUrl={characterModel} 
          height="100%" 
          width="100%" 
          autoRotate={true}
          className="rounded-none"
        />
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 flex justify-between">
          <div className="text-lg font-mono text-toxic-neon truncate pr-2">
            Wasteland Survivor
          </div>
          <div className="flex-shrink-0 text-toxic-neon font-mono">
            <ToxicBadge variant="rating" className="text-xs">
              <Radiation className="w-3 h-3 mr-1" /> {characterStats.radiation}%
            </ToxicBadge>
          </div>
        </div>
      </div>
      
      {/* Level Progress Bar */}
      <div className="px-4 py-3 border-b border-toxic-neon/10">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-white/70">NEXT LEVEL</span>
          <span className={`font-mono ${getRoleColor()}`}>
            {levelProgress}%
          </span>
        </div>
        <ToxicProgress 
          value={levelProgress} 
          className="h-2" 
          variant={characterRole === 'sentinel' ? 'governance' : 'staking'} 
        />
      </div>
      
      {/* Character Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center text-xs text-white/70">
                <Shield className="w-3 h-3 mr-1 text-toxic-neon/70" /> Reputation
              </span>
              <span className="text-xs text-toxic-neon">{characterStats.reputation}%</span>
            </div>
            <ToxicProgress value={characterStats.reputation} className="h-1" variant="reputation" />
          </div>
          
          <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center text-xs text-white/70">
                <Network className="w-3 h-3 mr-1 text-toxic-neon/70" /> Influence
              </span>
              <span className="text-xs text-toxic-neon">{characterStats.influence}%</span>
            </div>
            <ToxicProgress value={characterStats.influence} className="h-1" variant="governance" />
          </div>
        </div>
      </div>
      
      {/* Footer with Expand/Collapse button */}
      <div className="px-4 pb-4">
        <ToxicButton 
          variant="outline" 
          size="sm" 
          className="w-full text-toxic-neon border-toxic-neon/20 flex items-center justify-center gap-1"
          onClick={toggleDetails}
        >
          {showDetails ? (
            <>
              <X className="w-3 h-3" /> Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Show Details
            </>
          )}
        </ToxicButton>
      </div>
      
      {/* Expandable Details Section */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 border-t border-toxic-neon/10"
        >
          <div className="pt-3 grid grid-cols-3 gap-2">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
            >
              <BookOpen className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
              <div className="text-xs text-white/70">Chronicles</div>
              <div className="text-sm text-toxic-neon">{characterStats.chronicles}</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
            >
              <Award className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
              <div className="text-xs text-white/70">Achievements</div>
              <div className="text-sm text-toxic-neon">{characterStats.achievements}</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
            >
              <Target className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
              <div className="text-xs text-white/70">Rank</div>
              <div className="text-sm text-toxic-neon">Survivor</div>
            </motion.div>
          </div>
          
          <div className="mt-3">
            <ToxicButton 
              variant="ghost" 
              size="sm" 
              className="w-full text-toxic-neon hover:bg-toxic-neon/5 flex items-center justify-center gap-1"
              onClick={toggleModel}
            >
              <Eye className="w-3 h-3" /> {viewingModel ? "Hide 3D Model" : "View 3D Model"}
            </ToxicButton>
          </div>
        </motion.div>
      )}
      
      {/* Full 3D Model View Modal */}
      {viewingModel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        >
          <div className="relative w-full max-w-2xl h-[70vh] bg-black/90 border border-toxic-neon/30 rounded-lg overflow-hidden">
            <ModelPreview 
              modelUrl={characterModel} 
              height="100%" 
              width="100%" 
              autoRotate={true}
            />
            <button 
              className="absolute top-4 right-4 rounded-full p-1 bg-black/80 border border-toxic-neon/50 text-toxic-neon"
              onClick={toggleModel}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <ToxicBadge variant="marketplace" className={characterRole === 'sentinel' ? 'bg-purple-900/60 text-purple-300' : 'bg-amber-900/60 text-amber-300'}>
                {characterRole === 'sentinel' ? (
                  <><Eye className="w-3 h-3 mr-1" /> SENTINEL</>
                ) : (
                  <><Hammer className="w-3 h-3 mr-1" /> PIONEER</>
                )}
              </ToxicBadge>
            </div>
          </div>
        </motion.div>
      )}
    </ToxicCard>
  );
}
