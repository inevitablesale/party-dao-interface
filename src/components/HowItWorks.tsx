
import { CircleDollarSign, FileCheck, Wallet } from "lucide-react";
import { Card } from "./ui/card";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-black/30">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          How It Works: Invest, Own, and Share the Rewards
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <CircleDollarSign className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">1. Invest Your LGR Tokens</h3>
            <p className="text-gray-300 mb-6">
              When a new accounting practice is identified for acquisition, LedgerFund (LGR) token holders can invest their tokens into the deal.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>Step into Ownership: By investing LGR, you're securing your stake in a real-world business.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>Log in or sign up to connect your wallet and participate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>NFT Requirement: You'll need to mint a LedgerFren NFT to participate.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
            <FileCheck className="w-8 h-8 text-teal-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">2. Sign the SPV Paperwork</h3>
            <p className="text-gray-300 mb-6">
              Complete the necessary Special Purpose Vehicle (SPV) legal documentation that owns and operates the acquired practice.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-teal-300">•</span>
                <span>Legal Security: The SPV separates firm operations and liabilities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-300">•</span>
                <span>Ownership Transparency: Your rights and ownership are clearly defined.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-300">•</span>
                <span>Know Your Customer (KYC): Complete KYC process for compliance.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <Wallet className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">3. Receive Your RWA Tokens</h3>
            <p className="text-gray-300 mb-6">
              Receive Real World Asset (RWA) tokens representing your share in the SPV, unlocking direct benefits.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>Profit Sharing: Receive dividends based on practice performance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>Voting Rights: Participate in governance decisions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>Tradable Assets: Hold long-term or trade where permitted.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

