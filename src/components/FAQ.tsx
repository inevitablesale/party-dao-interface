import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    category: "Platform Fundamentals",
    questions: [
      {
        question: "What is our vision for the future of accounting?",
        answer: "We envision a protocol that puts accountants in charge of the industry's future. By leveraging decentralization, peer-to-peer DeFi, and creating entirely new asset classes, we're enabling unprecedented efficiency and revenue opportunities. Our framework serves a community of like-minded professionals who believe in the power of the invisible hand - where collective expertise and market forces naturally drive innovation and value creation. This protocol isn't just a platform; it's a movement to transform how accounting practices are acquired, managed, and evolved through the power of decentralized finance and community governance.",
      },
      {
        question: "What is decentralization and why is it important?",
        answer: "Decentralization is a core principle of LedgerFund that ensures no single entity controls the platform. By distributing power across our community of token holders, we create a more transparent, fair, and resilient system for acquiring and managing accounting practices. This approach eliminates traditional intermediaries and enables direct member participation in governance and value creation.",
      },
      {
        question: "How does blockchain technology power LedgerFund?",
        answer: "Blockchain technology provides the foundation for LedgerFund's transparent and immutable operations. Smart contracts automate and enforce rules around token distribution, voting, and profit sharing, while blockchain timestamps and assets create a verifiable record of all transactions. This technology ensures trustless execution of platform functions without relying on traditional intermediaries.",
      },
      {
        question: "How does the non-custodial wallet system work?",
        answer: "When you sign up, you create a non-custodial wallet that remains fully under your control. Your assets stay in your wallet until you choose to invest. Smart contracts handle all fund movements automatically and securely, including converting and transferring funds to acquired companies' bank accounts, distributing returns to LGR LP holders, and managing reflections to LGR holders. This ensures complete transparency and security while maintaining your full control over your assets.",
      },
    ],
  },
  {
    category: "Legal & Structure",
    questions: [
      {
        question: "What is LedgerFund DAO?",
        answer: "LedgerFund DAO is a decentralized autonomous organization that will be formally established in Wyoming (Q2 2025). It enables accounting professionals to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.",
      },
      {
        question: "Why establish the DAO in Wyoming?",
        answer: "Wyoming is the first U.S. state to establish a comprehensive legal framework for DAOs, recognizing them as legal entities. This provides clear regulatory guidance, legal protection for members, and a structured framework for decentralized operations. The Wyoming DAO LLC structure also enables efficient creation of Series SPVs for individual investments.",
      },
      {
        question: "What are Special Purpose Vehicles (SPVs)?",
        answer: "Special Purpose Vehicles are structured as Series SPVs under the Wyoming DAO LLC, which acts as the SPV manager. This structure allows individuals, trusts, and other entities to participate in alternative investments like accounting firm acquisitions while maintaining clear governance and distribution rights. Each Series SPV operates as a separate legal entity with its own assets and liabilities, providing maximum protection and flexibility for investors.",
      },
    ],
  },
  {
    category: "Platform Operations",
    questions: [
      {
        question: "What role does the platform play in operations?",
        answer: "The platform is designed to operate in a fully decentralized manner, utilizing smart contracts, blockchain assets, and timestamps instead of traditional databases. While we enable the infrastructure, we do not participate in decision-making, voting, or capital raising after the pre-sale stage. The platform serves purely as an enabler for member-driven activities.",
      },
      {
        question: "How does tokenized ownership work?",
        answer: "LedgerFund implements a dual-token model for ownership and investment. The LGR token represents governance rights and reflection earnings in the overall protocol, while RWA tokens represent direct ownership in specific accounting firm investments through our Series SPVs. This structure allows for both passive protocol earnings through LGR holdings and active investment participation through RWA tokens.",
      },
      {
        question: "What are RWA tokens and LGR LP tokens?",
        answer: "Real World Asset (RWA) tokens are digital representations of ownership in physical accounting firms. When you invest in a specific firm through our liquidity pools, you receive LGR LP tokens, which are RWA tokens that represent your proportional ownership in that investment. These tokens are backed by real-world revenue streams and enable fractional ownership and automated distribution of profits.",
      },
      {
        question: "How do LedgerFund's liquidity pools work?",
        answer: "Liquidity pools are launched in Phase 3 (Q3 2025) as part of our infrastructure development. These pools enable collective investment in accounting firm acquisitions, with the first acquisitions beginning after the deployment of our Deal Thesis Framework.",
      },
      {
        question: "What's the difference between LGR reflections and LP investment returns?",
        answer: "There are two distinct ways to earn with LedgerFund: 1) All LGR token holders automatically receive 10% of firm distributions as reflections, simply for holding the token. 2) LGR LP holders who actively invest in specific firm acquisitions through our liquidity pools receive 70% of net profits from those specific firms, represented by RWA tokens. This means you can earn both passive reflections as a token holder and direct profits as an LP investor.",
      },
    ],
  },
  {
    category: "Deal Paperwork",
    questions: [
      {
        question: "How are Blue Sky fees handled?",
        answer: "The platform charges a flat fee, calculated at time of investment of the total investment raised per acquisition to cover blue sky fees at a flat rate for all members.",
      },
      {
        question: "How will the Reg D paperwork be filed with the SEC?",
        answer: "We will utilize flowinc as our backbone to act as a registered agent, establish SPV's, and file the necessary Reg D 506b safe harbor exemption paperwork.",
      },
      {
        question: "Will I receive a K-1?",
        answer: "Yes, you will receive a K-1 annually from LedgerFund DAO regarding investment activity for each investment which are structured as pass-through vehicles.",
      },
    ],
  },
  {
    category: "Token Sale & Participation",
    questions: [
      {
        question: "Is this an investment opportunity?",
        answer: "No, this is not an investment opportunity. We are conducting an Initial Coin Offering (ICO) where participants are funding the creation of the platform's utility features. The funds raised during pre-sale will be used to develop the infrastructure and smart contracts that enable the platform's decentralized operations.",
      },
      {
        question: "How does the pre-sale smart contract work?",
        answer: "The pre-sale smart contract is designed with fairness and transparency in mind. It uses a strict presale price of $0.10 per token, enforces individual purchase caps, and distributes tokens immediately upon purchase. All transactions are verifiable on-chain, and the contract includes built-in protections against price manipulation.",
      },
      {
        question: "What is the total token supply?",
        answer: "The LedgerFren token smart contract has a fixed supply of 10 million tokens, with no ability to mint additional tokens. Of this total, 5 million tokens are allocated for the pre-sale phase, making it a truly limited opportunity for early supporters.",
      },
      {
        question: "When does the presale start and what are the caps?",
        answer: "The presale launches in Q1 2025 with a soft cap of $250K. Early supporters can participate in the initial phase, followed by a hard cap target of $500K in Q2 2025.",
      },
      {
        question: "How will the presale funds be used?",
        answer: "Funds raised during the presale will be primarily allocated to platform development. The remaining funds will be held in our treasury to serve as the main DAO liquidity pool, funding ongoing operations and token buybacks.",
      },
      {
        question: "What are reflection rights?",
        answer: "Reflection rights entitle token holders to receive 10% of all future firm distributions through our liquidity pools, creating a passive income stream from the success of acquired practices.",
      },
    ],
  },
  {
    category: "Governance",
    questions: [
      {
        question: "How is governance power calculated?",
        answer: "Our innovative governance system combines two key factors: your LGR token holdings and your professional experience 'node' generated from LinkedIn data. This dual approach ensures that both capital allocation and professional expertise contribute to governance power. The experience node analyzes factors like industry tenure, specializations, and relevant certifications, creating a comprehensive score that works alongside your token holdings to determine overall governance influence. More details about this system will be released as we approach the LedgerFren member NFT minting milestone.",
      },
      {
        question: "When can I participate in governance?",
        answer: "Community governance launches in Phase 3 (Q3 2025). As a token holder who has completed self-attestation of accreditation status, you'll be able to vote on key protocol decisions, including firm acquisitions, operational changes, and future development initiatives through our DAO structure. This attestation process ensures compliant participation in investment decisions.",
      },
      {
        question: "What is the Deal Thesis Framework?",
        answer: "The Deal Thesis Framework, launching in Phase 3, is a member-driven system where LGR token holders can submit and evaluate proposals for accounting firm acquisitions. Members create and submit detailed investment proposals to attract capital from fellow members, with clear criteria and transparent governance ensuring collective decision-making on all investments.",
      },
    ],
  },
  {
    category: "Compliance & Eligibility",
    questions: [
      {
        question: "Can I participate if I am not an accredited investor?",
        answer: "As a member, you will have access to Regulation D 506(b) raises on the platform that will accept an unlimited number of accredited investors and up to 35 unaccredited investors per firm investment. This structure ensures inclusive participation while maintaining regulatory compliance.",
      },
      {
        question: "What are the benefits of participating in the pre-sale?",
        answer: "Early supporters who participate in the pre-sale stage will receive priority access to future investment opportunities on the platform, subject to meeting KYC/AML and eligibility requirements. This early participation establishes your status as a qualified member for accessing private capital raising opportunities once the platform launches.",
      },
      {
        question: "How are accounting firms managed post-acquisition?",
        answer: "Experienced MSP (Managed Service Provider) partners integrated into our ecosystem manage the firms. They present detailed proposals through our Deal Thesis Framework that are put on the blockchain for community voting.",
      },
    ],
  },
];

export const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<{category: number, question: number} | null>(null);

  const handleCategoryClick = (categoryIndex: number) => {
    setSelectedCategory(selectedCategory === categoryIndex ? null : categoryIndex);
    setSelectedFaq(null);
  };

  const handleFaqClick = (categoryIndex: number, questionIndex: number) => {
    setSelectedFaq(
      selectedFaq?.category === categoryIndex && selectedFaq?.question === questionIndex
        ? null
        : { category: categoryIndex, question: questionIndex }
    );
  };

  return (
    <section className="relative z-50 py-16 min-h-screen bg-black/90" id="faq">
      <div className="container relative z-50 px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="relative z-50 max-w-4xl mx-auto space-y-6">
          {faqCategories.map((category, categoryIndex) => {
            const isCategorySelected = selectedCategory === categoryIndex;
            
            return (
              <div
                key={categoryIndex}
                className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-colors"
              >
                <button
                  onClick={() => handleCategoryClick(categoryIndex)}
                  className="relative z-10 w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 hover:bg-yellow-500/10 transition-colors"
                  aria-expanded={isCategorySelected}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-yellow-500">
                      {category.category}
                    </h3>
                    <ChevronDown 
                      className={`w-6 h-6 text-yellow-500 transition-transform duration-200 ${
                        isCategorySelected ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                <div
                  className={`relative z-10 transition-all duration-200 ease-in-out ${
                    isCategorySelected ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const isQuestionSelected = selectedFaq?.category === categoryIndex && selectedFaq?.question === questionIndex;
                      
                      return (
                        <div
                          key={questionIndex}
                          className="bg-black/50 rounded-lg border border-yellow-500/20"
                        >
                          <button
                            onClick={() => handleFaqClick(categoryIndex, questionIndex)}
                            className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                            aria-expanded={isQuestionSelected}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-medium text-white">
                                {faq.question}
                              </h4>
                              <ChevronDown 
                                className={`w-5 h-5 text-yellow-500/70 transition-transform duration-200 ${
                                  isQuestionSelected ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          
                          <div
                            className={`transition-all duration-200 ease-in-out ${
                              isQuestionSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                          >
                            <div className="px-4 pb-4 pt-2 border-t border-yellow-500/20">
                              <p className="text-gray-300 text-base">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
