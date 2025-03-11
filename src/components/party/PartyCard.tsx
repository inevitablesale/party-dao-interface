
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Zap, Clock, DollarSign, Vote } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatEthAmount } from "@/utils/priceCalculator";
import { useNavigate } from "react-router-dom";

interface PartyCardProps {
  party: {
    id: string;
    name: string;
    description: string;
    totalContributions: string; // in ETH
    targetAmount: string; // in ETH
    memberCount: number;
    remainingTime: string;
    creator: string;
    status: "active" | "completed" | "failed";
  };
  compact?: boolean;
}

export const PartyCard = ({ party, compact = false }: PartyCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "completed": return "bg-blue-500/20 text-blue-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active Funding";
      case "completed": return "Funding Complete";
      case "failed": return "Funding Failed";
      default: return "Unknown";
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/settlements/${party.id}`);
  };
  
  const progressPercent = Math.min(
    100, 
    (parseFloat(party.totalContributions) / parseFloat(party.targetAmount)) * 100
  );
  
  if (compact) {
    return (
      <Card className="bg-[#111] border-toxic-neon/10 hover:border-toxic-neon/30 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{party.name}</CardTitle>
            <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(party.status)}`}>
              {getStatusText(party.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <Progress value={progressPercent} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatEthAmount(parseFloat(party.totalContributions))} ETH</span>
            <span>{formatEthAmount(parseFloat(party.targetAmount))} ETH</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-toxic-neon border-toxic-neon/30" onClick={handleViewDetails}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="bg-[#111] border-toxic-neon/10 hover:border-toxic-neon/30 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{party.name}</CardTitle>
          <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(party.status)}`}>
            {getStatusText(party.status)}
          </div>
        </div>
        <CardDescription className="text-gray-400 line-clamp-2">
          {party.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={progressPercent} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatEthAmount(parseFloat(party.totalContributions))} ETH raised</span>
            <span>Target: {formatEthAmount(parseFloat(party.targetAmount))} ETH</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0a1020] p-3 rounded-xl">
            <div className="flex items-center gap-2 text-toxic-neon mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Members</span>
            </div>
            <span className="text-lg font-bold">{party.memberCount}</span>
          </div>
          
          <div className="bg-[#0a1020] p-3 rounded-xl">
            <div className="flex items-center gap-2 text-toxic-neon mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Progress</span>
            </div>
            <span className="text-lg font-bold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          
          <div className="bg-[#0a1020] p-3 rounded-xl">
            <div className="flex items-center gap-2 text-toxic-neon mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Remaining</span>
            </div>
            <span className="text-lg font-bold">{party.remainingTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button 
          variant="outline" 
          className="flex-1 text-toxic-neon border-toxic-neon/30"
          onClick={handleViewDetails}
        >
          <Shield className="w-4 h-4 mr-2" />
          View Settlement
        </Button>
        <Button 
          variant="default" 
          className="flex-1 bg-toxic-neon text-black hover:bg-toxic-neon/90"
          onClick={handleViewDetails}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Contribute
        </Button>
      </CardFooter>
    </Card>
  );
};
