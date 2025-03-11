
import Nav from "@/components/Nav";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400 mb-8">
            New to Crypto? Get Started Here
          </h1>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-8">
              <Card className="p-6 bg-gray-900/50 border-white/10">
                <h2 className="text-2xl font-semibold text-yellow-500 mb-4">What is Cryptocurrency?</h2>
                <p className="text-gray-300 leading-relaxed">
                  Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies issued by governments, cryptocurrencies are typically decentralized systems based on blockchain technology.
                </p>
              </Card>

              <Card className="p-6 bg-gray-900/50 border-white/10">
                <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Understanding Blockchain</h2>
                <p className="text-gray-300 leading-relaxed">
                  Blockchain is a distributed ledger technology that records all transactions across a network of computers. It's secure, transparent, and immutable - meaning once data is recorded, it cannot be changed.
                </p>
              </Card>

              <Card className="p-6 bg-gray-900/50 border-white/10">
                <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Getting Started with LedgerFund</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  LedgerFund DAO makes it easy to participate in cryptocurrency and decentralized finance (DeFi). Here's how to get started:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Connect your wallet using the button in the navigation bar</li>
                  <li>Purchase $LGR tokens to participate in governance</li>
                  <li>Stake your tokens to earn rewards</li>
                  <li>Join our community and participate in DAO decisions</li>
                </ol>
              </Card>

              <Card className="p-6 bg-gray-900/50 border-white/10">
                <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Safety Tips</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Never share your private keys or seed phrases</li>
                  <li>Always verify website URLs and contract addresses</li>
                  <li>Start with small amounts while learning</li>
                  <li>Keep your software and wallets updated</li>
                  <li>Use hardware wallets for large holdings</li>
                </ul>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default GettingStarted;
