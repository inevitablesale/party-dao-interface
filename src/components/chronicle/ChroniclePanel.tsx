
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Scroll, PenLine, Map, Eye, Users, Clock, Zap, Flag, Award, Shield } from 'lucide-react';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { useNavigate } from 'react-router-dom';

interface ChronicleEntry {
  id: string;
  title: string;
  timestamp: string;
  territory: string;
  status: 'pending' | 'approved' | 'featured';
  impact: number;
}

interface ChronicleTerritory {
  id: string;
  name: string;
  controlLevel: number;
  activeStories: number;
  contributorsCount: number;
}

interface ChroniclePanelProps {
  className?: string;
}

export function ChroniclePanel({ className }: ChroniclePanelProps) {
  const { isConnected } = useCustomWallet();
  const navigate = useNavigate();
  
  // Simulated chronicle data - would come from API in production
  const chronicles: ChronicleEntry[] = [
    {
      id: 'chron-1',
      title: 'First contact with Sector 7',
      timestamp: '2 days ago',
      territory: 'Outpost Alpha',
      status: 'approved',
      impact: 75
    },
    {
      id: 'chron-2',
      title: 'Resource cache discovered',
      timestamp: '1 week ago',
      territory: 'Deadzone Perimeter',
      status: 'featured',
      impact: 92
    },
    {
      id: 'chron-3',
      title: 'Established comm relay',
      timestamp: '3 days ago',
      territory: 'Echo Valley',
      status: 'pending',
      impact: 45
    }
  ];
  
  const territories: ChronicleTerritory[] = [
    {
      id: 'terr-1',
      name: 'Outpost Alpha',
      controlLevel: 65,
      activeStories: 8,
      contributorsCount: 12
    },
    {
      id: 'terr-2',
      name: 'Deadzone Perimeter',
      controlLevel: 42,
      activeStories: 5,
      contributorsCount: 7
    },
    {
      id: 'terr-3',
      name: 'Echo Valley',
      controlLevel: 28,
      activeStories: 3,
      contributorsCount: 5
    }
  ];
  
  const getStatusBadge = (status: ChronicleEntry['status']) => {
    switch(status) {
      case 'approved':
        return <ToxicBadge variant="default" className="bg-toxic-neon/20">Approved</ToxicBadge>;
      case 'featured':
        return <ToxicBadge variant="marketplace" className="animate-pulse">Featured</ToxicBadge>;
      case 'pending':
        return <ToxicBadge variant="secondary" className="bg-amber-900/60 text-amber-300">Pending</ToxicBadge>;
      default:
        return null;
    }
  };
  
  return (
    <ToxicCard className={`bg-black/70 border-toxic-neon/30 p-6 relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="scanline"></div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-toxic-neon/10">
            <Scroll className="w-5 h-5 text-toxic-neon" />
          </div>
          <h3 className="text-xl font-mono text-toxic-neon">WASTELAND CHRONICLES</h3>
        </div>
        
        <ToxicButton 
          variant="outline" 
          size="sm"
          className="text-toxic-neon border-toxic-neon/30"
          onClick={() => navigate('/chronicle/create')}
        >
          <PenLine className="w-4 h-4 mr-2" /> New Entry
        </ToxicButton>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Territory Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-4 h-4 text-toxic-neon" />
            <h4 className="text-sm font-mono text-toxic-neon">CONTROLLED TERRITORIES</h4>
          </div>
          
          {territories.map(territory => (
            <div key={territory.id} className="bg-black/50 border border-toxic-neon/20 p-3 rounded-md hover:border-toxic-neon/40 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{territory.name}</span>
                <ToxicBadge variant="status" className="text-xs">
                  <Flag className="w-3 h-3 mr-1" /> {territory.controlLevel}% Control
                </ToxicBadge>
              </div>
              <ToxicProgress value={territory.controlLevel} className="h-1 mb-3" variant="radiation" />
              <div className="flex justify-between text-xs text-white/70">
                <span className="flex items-center">
                  <Scroll className="w-3 h-3 mr-1 text-toxic-neon/70" /> {territory.activeStories} Stories
                </span>
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1 text-toxic-neon/70" /> {territory.contributorsCount} Contributors
                </span>
              </div>
            </div>
          ))}
          
          <ToxicButton 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => navigate('/territories')}
          >
            <Map className="w-4 h-4 mr-2" /> View All Territories
          </ToxicButton>
        </div>
        
        {/* Chronicle Entries */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Scroll className="w-4 h-4 text-toxic-neon" />
            <h4 className="text-sm font-mono text-toxic-neon">YOUR CHRONICLES</h4>
          </div>
          
          {isConnected ? (
            <>
              {chronicles.map(entry => (
                <div key={entry.id} className="bg-black/50 border border-toxic-neon/20 p-3 rounded-md hover:bg-black/60 hover:border-toxic-neon/40 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-medium">{entry.title}</span>
                    {getStatusBadge(entry.status)}
                  </div>
                  <div className="flex justify-between text-xs text-white/70 mb-2">
                    <span className="flex items-center">
                      <Map className="w-3 h-3 mr-1 text-toxic-neon/70" /> {entry.territory}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-toxic-neon/70" /> {entry.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">Impact:</span>
                    <ToxicProgress value={entry.impact} className="h-1 flex-grow" variant="reputation" />
                    <span className="text-xs text-toxic-neon">{entry.impact}%</span>
                  </div>
                </div>
              ))}
              
              <ToxicButton 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/chronicles')}
              >
                <Scroll className="w-4 h-4 mr-2" /> View All Chronicles
              </ToxicButton>
            </>
          ) : (
            <div className="bg-black/50 border border-toxic-neon/20 p-4 rounded-md text-center">
              <Scroll className="w-8 h-8 text-toxic-neon/50 mx-auto mb-2" />
              <p className="text-white/70 mb-3">Connect your survival pack to record your wasteland chronicles</p>
              <ToxicButton 
                variant="marketplace" 
                size="sm"
                className="mx-auto"
                onClick={() => navigate('/hunt')}
              >
                <Eye className="w-4 h-4 mr-2" /> Begin Your Story
              </ToxicButton>
            </div>
          )}
        </div>
      </div>
      
      {isConnected && (
        <div className="mt-6 bg-black/50 border border-toxic-neon/20 p-3 rounded-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Award className="w-4 h-4 text-toxic-neon" />
            </div>
            <div>
              <h4 className="text-sm font-mono text-toxic-neon">CHRONICLE ACHIEVEMENTS</h4>
              <p className="text-xs text-white/70">Your story contributions earn achievements and territory influence</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <ToxicBadge variant="rating" className="animate-pulse">
              <Award className="w-3 h-3 mr-1" /> First Chronicler
            </ToxicBadge>
            <ToxicBadge variant="secondary">
              <Shield className="w-3 h-3 mr-1" /> Territory Guardian
            </ToxicBadge>
            <ToxicBadge variant="secondary">
              <Zap className="w-3 h-3 mr-1" /> Impact Writer
            </ToxicBadge>
          </div>
        </div>
      )}
    </ToxicCard>
  );
}
