
import { PartyPopper, Trophy, Gift, ShoppingBag, Medal, Star } from "lucide-react";

export const LedgerFrens = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse -top-32 -left-32" />
        <div className="absolute w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse -bottom-32 -right-32" />
      </div>

      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
            Raising Capital, Rewarding Supporters
          </h2>
          <p className="text-xl text-white/80 mb-8">
            As LedgerFund DAO grows, we reward our early supporters. From exclusive launch events to limited edition merchandise, 
            we're creating a community that shares in our success from day one.
          </p>
        </div>

        {/* Milestone Rewards Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Milestone Rewards</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <PartyPopper className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Early Minting Access</h4>
                  <p className="text-gray-300">
                    At $50K raised: LedgerFrens NFTs are minted, giving early supporters exclusive access to our decentralized accounting ecosystem.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Trophy className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Governance Board Election</h4>
                  <p className="text-gray-300">
                    At $100K raised: Voting begins for governance board seats, empowering our community to shape the future of decentralized accounting.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <ShoppingBag className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Exclusive DAO Merch</h4>
                  <p className="text-gray-300">
                    At $150K raised: 150 random stakers receive exclusive LedgerFund DAO merchandise pack including premium apparel and accessories.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Medal className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">MSP Proposals Open</h4>
                  <p className="text-gray-300">
                    At $250K raised: Proposals open for managed service providers, expanding our network's capabilities and reach.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Investment Thesis Proposals</h4>
                  <p className="text-gray-300">
                    At $300K raised: LedgerFren NFT holders can submit investment thesis proposals and pledge LGR tokens to indicate interest in potential acquisitions.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Medal className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Deal Bounty Program</h4>
                  <p className="text-gray-300">
                    At $400K raised: Launch of our Deal Bounty Program, rewarding community members who identify and help acquire qualified accounting practices.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Gift className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Launch Party Access</h4>
                  <p className="text-gray-300">
                    At $500K raised: 5 random holders will be invited to our exclusive launch party, with travel expenses covered up to $1,000.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">First Acquisition Made</h4>
                  <p className="text-gray-300">
                    First accounting firm acquisition completed, establishing the foundation of our decentralized network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
