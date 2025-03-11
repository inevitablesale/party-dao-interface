import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletInfo } from "./WalletInfo";
import { Building2, Wallet } from "lucide-react";

export const PostOnboardingView = () => {
  const { user } = useDynamicContext();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
          Welcome to Fractional Firm Ownership
        </h1>
        <p className="text-gray-400 text-lg">
          Your gateway to investing in accounting firms through blockchain technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-polygon-primary" />
              <CardTitle className="text-white">Profile Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name</span>
              <span className="text-white">{user?.alias || 'Verified Professional'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            {user?.verifications?.customFields && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">LinkedIn Profile</span>
                <a 
                  href={user.verifications.customFields["LinkedIn Profile URL"]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-polygon-primary hover:text-polygon-secondary transition-colors"
                >
                  View Profile
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-polygon-primary" />
              <CardTitle className="text-white">Wallet Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <WalletInfo />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Your LinkedIn profile will be analyzed to generate unique NFT attributes that represent your professional experience and qualifications. These attributes will determine your eligibility for specific firm ownership opportunities.
          </p>
          <div className="flex items-center justify-center">
            <div className="animate-pulse-slow bg-polygon-primary/20 rounded-lg p-4 text-center">
              <p className="text-polygon-primary">Analyzing LinkedIn Profile...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};