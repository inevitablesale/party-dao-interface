
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Plus, Gavel, ShieldCheck, Building2, Target } from 'lucide-react';

export const SettlementsNavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-toxic-neon">Settlements</h1>
        <p className="text-gray-400 max-w-2xl">
          Discover and support settlements being built in the wasteland. Sentinels can contribute ETH to fund and govern promising projects.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="/settlements">
          <ToxicButton 
            variant={isActive("/settlements") ? "primary" : "tertiary"} 
            className="gap-2"
          >
            <Building2 className="w-4 h-4" />
            All Settlements
          </ToxicButton>
        </Link>
        <Link to="/governance">
          <ToxicButton 
            variant={isActive("/governance") ? "primary" : "tertiary"} 
            className="gap-2"
          >
            <Gavel className="w-4 h-4" />
            Governance
          </ToxicButton>
        </Link>
        <Link to="/my-settlements">
          <ToxicButton 
            variant={isActive("/my-settlements") ? "primary" : "tertiary"} 
            className="gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            My Contributions
          </ToxicButton>
        </Link>
        <Link to="/referrals">
          <ToxicButton 
            variant={isActive("/referrals") ? "primary" : "tertiary"} 
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Referrals
          </ToxicButton>
        </Link>
        <Link to="/thesis">
          <ToxicButton 
            variant="primary" 
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Settlement
          </ToxicButton>
        </Link>
      </div>
    </div>
  );
};
