
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Map, Globe, Target, Radiation, Users, Flag, Scroll, AlertTriangle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TerritoryStatusProps {
  className?: string;
}

export function TerritoryStatus({ className }: TerritoryStatusProps) {
  const navigate = useNavigate();
  
  // This would be populated from API data in production
  const territories = [
    {
      id: 'zone-1',
      name: 'Eastern Deadzone',
      controlStatus: 'contested',
      radiationLevel: 76,
      sentinelCount: 12,
      threatLevel: 'high'
    },
    {
      id: 'zone-2',
      name: 'Northern Refuge',
      controlStatus: 'secured',
      radiationLevel: 32,
      sentinelCount: 28,
      threatLevel: 'low'
    },
    {
      id: 'zone-3',
      name: 'Reactor Wasteland',
      controlStatus: 'hazardous',
      radiationLevel: 94,
      sentinelCount: 5,
      threatLevel: 'critical'
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'secured':
        return <ToxicBadge variant="default" className="text-toxic-neon"><Shield className="w-3 h-3 mr-1" /> Secured</ToxicBadge>;
      case 'contested':
        return <ToxicBadge variant="secondary" className="bg-amber-900/60 text-amber-300"><Target className="w-3 h-3 mr-1" /> Contested</ToxicBadge>;
      case 'hazardous':
        return <ToxicBadge variant="danger" className="animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> Hazardous</ToxicBadge>;
      default:
        return null;
    }
  };
  
  return (
    <ToxicCard className={`bg-black/70 border-toxic-neon/30 p-4 relative ${className}`}>
      <div className="scanline"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-toxic-neon/10">
            <Globe className="w-5 h-5 text-toxic-neon" />
          </div>
          <h3 className="text-lg font-mono text-toxic-neon">TERRITORY STATUS</h3>
        </div>
        
        <ToxicButton
          variant="outline"
          size="sm"
          className="text-toxic-neon border-toxic-neon/30"
          onClick={() => navigate('/territories/map')}
        >
          <Map className="w-4 h-4 mr-1" /> View Map
        </ToxicButton>
      </div>
      
      <div className="grid gap-3 mb-2">
        {territories.map(territory => (
          <div 
            key={territory.id} 
            className={`bg-black/50 border border-toxic-neon/20 p-3 rounded hover:bg-black/60 transition-all cursor-pointer ${
              territory.controlStatus === 'hazardous' ? 'border-apocalypse-red/40' : ''
            }`}
            onClick={() => navigate(`/territories/${territory.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{territory.name}</span>
              {getStatusBadge(territory.controlStatus)}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center text-white/70">
                <Radiation className="w-3 h-3 mr-1 text-toxic-neon/70" /> 
                <span className={territory.radiationLevel > 70 ? 'text-apocalypse-red' : 'text-white/70'}>
                  {territory.radiationLevel}% Rad
                </span>
              </div>
              
              <div className="flex items-center text-white/70">
                <Users className="w-3 h-3 mr-1 text-toxic-neon/70" /> 
                <span>{territory.sentinelCount} Sentinels</span>
              </div>
              
              <div className="flex items-center text-white/70">
                <AlertTriangle className="w-3 h-3 mr-1 text-toxic-neon/70" /> 
                <span className={
                  territory.threatLevel === 'critical' ? 'text-apocalypse-red' : 
                  territory.threatLevel === 'high' ? 'text-amber-400' : 'text-white/70'
                }>
                  {territory.threatLevel.charAt(0).toUpperCase() + territory.threatLevel.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-2">
        <ToxicButton 
          variant="outline" 
          size="sm" 
          className="text-toxic-neon border-toxic-neon/30"
          onClick={() => navigate('/territories/scout')}
        >
          <Target className="w-4 h-4 mr-1" /> Scout New Area
        </ToxicButton>
        
        <ToxicButton 
          variant="outline" 
          size="sm" 
          className="text-toxic-neon border-toxic-neon/30"
          onClick={() => navigate('/territories/chronicle')}
        >
          <Scroll className="w-4 h-4 mr-1" /> Add Chronicle
        </ToxicButton>
      </div>
    </ToxicCard>
  );
}
