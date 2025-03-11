
import React from 'react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Radiation, Biohazard, ChevronRight, Eye, Hammer, Coins, Shield, Award, Target, Map, Flag, Network, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomWallet } from '@/hooks/useCustomWallet';

interface WastelandSurvivalGuideEnhancedProps {
  className?: string;
}

export function WastelandSurvivalGuideEnhanced({ className }: WastelandSurvivalGuideEnhancedProps) {
  const navigate = useNavigate();
  const { isConnected } = useCustomWallet();
  
  // These would come from actual user data in production
  const achievements = [
    {
      id: 'ach-1',
      name: 'Network Founder',
      description: 'Established first territory connection',
      earned: true,
      icon: <Network className="w-5 h-5 text-toxic-neon" />
    },
    {
      id: 'ach-2',
      name: 'Chronicle Keeper',
      description: 'Recorded 5 wasteland stories',
      earned: false, 
      progress: 3,
      total: 5,
      icon: <BookOpen className="w-5 h-5 text-toxic-neon" />
    },
    {
      id: 'ach-3',
      name: 'Territory Guardian',
      description: 'Maintained 75% control in any territory',
      earned: false,
      progress: 65,
      total: 75,
      icon: <Shield className="w-5 h-5 text-toxic-neon" />
    }
  ];
  
  return (
    <div className={`mb-8 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass ${className}`}>
      <div className="scanline"></div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
          <Radiation className="h-6 w-6 mr-2" /> WASTELAND SURVIVAL GUIDE
        </h3>
      </div>
      
      <div className="mb-6 p-4 bg-black/50 border border-apocalypse-red/30 rounded-lg relative">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
            <Biohazard className="w-6 h-6 text-apocalypse-red" />
          </div>
          <div>
            <h4 className="text-lg font-mono text-apocalypse-red mb-2">Resistance Protocol</h4>
            <p className="text-white/80 mb-3 text-sm">
              The <span className="text-apocalypse-red font-semibold">Resistance</span> connects sentinels and pioneers to rebuild from the ashes of the old financial world.
            </p>
            <p className="text-white/80 mb-3 text-sm">
              Whether you're a <span className="text-toxic-neon font-semibold">Sentinel tracking resources and territories</span> or a <span className="text-toxic-neon font-semibold">Pioneer building settlements and innovations</span>, our network facilitates wasteland justice and rebuilding efforts.
            </p>
            
            {isConnected && (
              <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20 mb-3">
                <h5 className="text-toxic-neon font-mono mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" /> YOUR ACHIEVEMENTS
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className={`p-3 rounded-lg ${achievement.earned ? 'bg-toxic-neon/10 border border-toxic-neon/30' : 'bg-black/30 border border-white/10'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-full ${achievement.earned ? 'bg-toxic-neon/20' : 'bg-white/5'}`}>
                          {achievement.icon}
                        </div>
                        <span className={`text-sm font-medium ${achievement.earned ? 'text-toxic-neon' : 'text-white/70'}`}>
                          {achievement.name}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mb-1">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <ToxicBadge variant="rating" className="animate-toxic-pulse w-full justify-center">
                          <Award className="w-3 h-3 mr-1" /> Earned
                        </ToxicBadge>
                      ) : (
                        <div className="text-xs text-white/50">
                          Progress: {achievement.progress}/{achievement.total}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <ToxicButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/achievements')}
                  >
                    View All Achievements <ChevronRight className="ml-1 h-4 w-4" />
                  </ToxicButton>
                </div>
              </div>
            )}
            
            <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
              <span className="text-toxic-neon font-semibold block mb-1">» COMING SOON «</span>
              Settlement Control | Territory Expansion | Network Influence - Expanding the Resistance with more ways to survive and rebuild.
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Eye className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Become a Sentinel</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Direct network resources, monitor territories, and establish strategic outposts. Shape the wasteland's future through resource allocation.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/hunt')}
            >
              Direct <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Hammer className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Become a Pioneer</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Build settlement projects, lead innovations, and develop technologies. Each pioneer shapes our community from outpost builders to tech innovators.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/marketplace/pioneers')}
            >
              Build <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Coins className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Fund Economy</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Convert your Old World assets to Resistance Dollars (RD). Power the new wasteland economy and gain governance rights in settlement decisions.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/buy-rd')}
            >
              Convert <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
      </div>
    </div>
  );
}
