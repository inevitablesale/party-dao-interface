import React from "react";
import { SectionContentProps } from "@/types/litepaper";

const SectionContent: React.FC<SectionContentProps> = ({ sectionId }) => {
  const sectionContent: Record<string, React.ReactNode> = {
    "introduction": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">1.0 Introduction</h2>
        <p className="text-gray-300 leading-relaxed">
          Resistance DAO is a decentralized acquisition platform designed to buy, govern, 
          and scale accounting firms through blockchain-powered investment strategies. 
          Unlike traditional private equity roll-ups that focus on short-term profits 
          and aggressive cost-cutting, Resistance DAO is investor-led, ensuring sustainable 
          growth, operational efficiency, and long-term value creation in firm ownership.
        </p>
      </div>
    ),
    "how-it-works": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">2.0 How Resistance DAO Works</h2>
        <div className="grid gap-4">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Key Strategies</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">1️⃣</span>
                <span>Growth Capital – Fund firm expansion, hiring, and new service lines.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2️⃣</span>
                <span>Exit Liquidity – Provide structured buyouts for retiring firm owners.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3️⃣</span>
                <span>Turnarounds – Acquire underperforming firms and optimize operations.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4️⃣</span>
                <span>Revenue-Based Financing – Offer non-dilutive capital tied to firm revenue.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">5️⃣</span>
                <span>Strategic M&A – Consolidate firms into scalable, high-performing groups.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">6️⃣</span>
                <span>Tokenized Firm Ownership – Enable investor exposure to firm revenues.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">7️⃣</span>
                <span>Liquidity Solutions – Provide structured exit pathways via buybacks & sales.</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">
          By focusing on long-term scalability and operational efficiency, Resistance DAO 
          creates value for investors while transforming acquired firms into modern, 
          technology-driven operations.
        </p>
      </div>
    ),
    "purpose": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">3.0 Purpose</h2>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Problems in Traditional Firm Acquisitions – Why legacy accounting M&A is inefficient.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>The Resistance DAO Model – How blockchain and decentralized governance create a superior investment framework.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Investment Process & Tokenomics – How $LGR tokens drive governance, revenue-sharing, and investment participation.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Roadmap & Future Expansion – How Resistance DAO plans to scale firm acquisitions.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Technology & Compliance – The role of smart contracts, tokenized assets, and regulatory alignment in firm ownership.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "audience": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">4.0 Target Audience</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Resistance DAO is designed for those looking to redefine firm acquisitions through blockchain-enabled investment strategies.
        </p>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Investors & Asset Managers – Seeking exposure to cash-flowing, real-world assets via blockchain.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>M&A Specialists – Exploring tokenized firm acquisitions and decentralized investment models.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Accounting Professionals – Interested in next-gen ownership models and firm scaling strategies.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Crypto & RWA Investors – Looking for a compliant, transparent way to invest in tokenized real-world assets.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "executive-summary": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">5.0 Executive Summary</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Key Objectives & Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              Resistance DAO is a strategic acquisition engine focused on buying, governing, and optimizing 
              accounting firms at scale. Our mission is to modernize firm ownership through blockchain-driven 
              investment models that prioritize long-term value creation over short-term profit extraction.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Core Objectives</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Acquire Profitable Firms – Targeting under-optimized firms with strong fundamentals and growth potential.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Enhance Operational Efficiency – Deploying technology, automation, and streamlined management for value growth.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Tokenized Ownership – Enabling exposure to real-world assets (RWAs) through governance and revenue-sharing.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Transparent, Investor-Led Governance – Utilizing on-chain voting and smart contracts to drive acquisitions and operations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "industry-landscape": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">6.0 Industry Landscape</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          The accounting industry faces several critical challenges that create opportunities for innovative solutions.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">The Succession Crisis</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>70% of accounting firm owners are over 50, with many nearing retirement.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Limited succession options force firms to sell at a discount or struggle with leadership transitions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Internal buyouts fail because younger CPAs lack the capital or risk tolerance to acquire firms.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Private equity roll-ups aggressively strip firms of independence through rapid consolidation.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">The Private Equity Problem</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>PE firms focus on aggressive cost-cutting and rapid fee increases, often harming firm culture.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>High-leverage models leave firms overburdened with debt once PE firms exit.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Short-term exit cycles (3-5 years) prioritize financial engineering over sustainable growth.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Barriers to Traditional M&A</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Opaque valuations create pricing inconsistencies and risk for buyers.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>High transaction costs limit M&A accessibility for smaller firms.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Slow, inefficient deal structures discourage independent investors.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Regulatory complexities create costly and time-consuming acquisition processes.</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Resistance DAO provides a modern, decentralized alternative—eliminating inefficiencies, 
            increasing transparency, and giving investors direct control over firm ownership.
          </p>
        </div>
      </div>
    ),
    "succession-crisis": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">The Succession Crisis</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h4 className="text-xl font-semibold text-yellow-500 mb-4">Critical Industry Challenge</h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Over 75% of accounting firm owners are approaching retirement age within the next decade.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Less than 10% of firms have a formal succession plan in place.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Traditional succession options are limited and often result in undervalued sales.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Next-gen leaders lack capital access for internal buyouts.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "pe-problem": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">The Private Equity Problem</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>PE firms prioritize aggressive cost-cutting over sustainable growth.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Short investment horizons (3-5 years) create misaligned incentives.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>High leverage models burden firms with unsustainable debt.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Client relationships suffer from rapid consolidation tactics.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "barriers": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">Barriers to Traditional M&A</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Complex valuation processes create pricing uncertainty.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>High transaction costs limit deal accessibility.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Lengthy due diligence periods drain resources.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Regulatory compliance adds significant complexity.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "market-opportunity": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">7.0 Market Opportunity for Decentralized Solutions</h2>
        <p className="text-gray-300 leading-relaxed">
          The $140B+ accounting industry is ripe for disruption. Blockchain-based investment models provide a scalable, transparent, and investor-driven approach to firm ownership.
        </p>

        <div id="tokenized-ownership" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Tokenized Firm Ownership & Fractional Investment</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Resistance DAO enables tokenized ownership, making firm M&A accessible to a broader investor base.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>$LGR tokens provide exposure to a diversified portfolio of acquired firms.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Decentralized investment pools lower capital barriers, increasing participation in firm acquisitions.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="efficient-ma" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Efficient, Transparent & Scalable M&A</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Smart contracts eliminate middlemen, reducing costs and accelerating deal flow.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>On-chain governance ensures transparency—investors vote directly on acquisitions and firm decisions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Standardized deal structuring enables scalable and repeatable firm acquisitions.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="investment-models" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Passive & Active Investment Models</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Passive $LGR holders earn revenue-sharing from firm acquisitions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Active investors participate in governance, voting on acquisitions, leadership, and strategic direction.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="pe-alternative" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">A Better Alternative to Private Equity</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>No forced cost-cutting for short-term exits—Resistance DAO prioritizes long-term firm growth.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Investor-aligned governance prevents misaligned incentives common in PE roll-ups.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Expanded access to M&A beyond traditional private equity acquisition targets.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="next-wave" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Unlocking the Next Wave of Firm Growth</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Tech-driven acquisitions integrate AI, automation, and digital-first workflows.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Decentralized ownership attracts new investors and next-gen firm operators.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Optimized capital deployment ensures sustainable firm growth without excessive debt financing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    "dao-framework": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">8.0 DAO Framework</h2>
        <div className="space-y-8">
          <p className="text-gray-300 leading-relaxed">
            Resistance DAO is a decentralized, permissionless network, where governance and investment 
            decisions are executed via smart contracts and community voting.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Key Governance Components</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>$LGR Token Holders – Vote on acquisitions, firm operations, and governance decisions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Governance Board – Elected to oversee deal sourcing, acquisitions, and operational strategy.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>On-Chain Proposal & Voting System – Ensures fully transparent, investor-driven decision-making.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Governance Process</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>1. Proposal Submission – Investors and stakeholders submit acquisition and operational proposals.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>2. On-Chain Voting – $LGR holders vote on:</span>
                  <ul className="ml-8 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Firm acquisitions & due diligence approvals.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Operational improvements & leadership decisions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Revenue allocation & governance updates.</span>
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>3. Smart Contract Execution – Approved votes trigger automated, immutable smart contract execution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "tokenomics": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">9.0 Tokenomics</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Resistance DAO operates with two token models, offering governance rights, revenue-sharing, and liquidity incentives.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">$LGR Token (Governance)</h3>
            <p className="text-gray-300 mb-4">
              $LGR is the core governance token, granting holders:
            </p>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Voting Rights – Influence acquisitions, firm decisions, and DAO operations.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>DAO Revenue Sharing – Earn token reflections from firm-generated revenue.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Exclusive Access – Only $LGR holders can participate in DAO-backed firm acquisitions.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Token Distribution Model</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Presale Allocation: 5,000,000 $LGR tokens.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Liquidity & Operations: 20% for DAO operations and firm scaling.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Staking & Governance Rewards: Incentives for long-term participation.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Treasury Reserve: Capital for future acquisitions and growth.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">$LGR LP Tokens (Liquidity Pool & Passive Income)</h3>
            <p className="text-gray-300 mb-4">
              LGR LP represents liquidity pool shares and provides passive income exposure to firm acquisitions.
            </p>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Earn from firm revenues – A portion of acquisition fees and profits is distributed to LP holders.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Liquidity pool stability – Supports on-chain trading and enhances market depth.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Staking & Yield Farming – LP holders stake tokens for additional rewards.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "blockchain": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">10.0 Blockchain & Smart Contracts</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">1️⃣ Transparent & Trustless Firm Acquisitions</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="text-gray-300 mb-4">Smart contracts eliminate manual, opaque M&A processes, automating:</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Investment structures & equity allocations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Revenue-sharing & profit distributions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>On-chain voting & governance execution</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">2️⃣ Decentralized Governance Execution</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Automated fund allocations for firm acquisitions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Real-time investor voting & execution of governance decisions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Immutable records of financials, contracts, and firm ownership</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">3️⃣ Automated Revenue Distribution</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Smart contract-based revenue sharing – Token holders receive earnings directly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>On-chain staking rewards – Passive income model for long-term investors</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Decentralized liquidity management – $LGR LP tokens allow exposure to firm-backed investments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "investment-strategy": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">11.0 Investment Strategy</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Firm Selection Criteria</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-6 text-gray-300">
                <li>
                  <h4 className="font-semibold text-yellow-400 mb-2">📈 Revenue & Profitability</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Firms generating $250K–$5M in revenue with strong cash flow</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Recurring client base with long-term contracts</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold text-yellow-400 mb-2">📊 Market Position</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Located in high-demand metro areas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Specializing in high-margin services</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold text-yellow-400 mb-2">🔄 Succession & Exit</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Owners seeking retirement with no internal succession plan.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Clean acquisition opportunities without PE involvement.</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "risk-assessment": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">12.0 Risk Assessment</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Risk Mitigation Strategies</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-6 text-gray-300">
                <li>
                  <h4 className="font-semibold text-yellow-400 mb-2">1️⃣ Deal Structure Protection</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Performance-based payouts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Smart contract escrow</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Tiered investment models with staged capital deployment</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold text-yellow-400 mb-2">2️⃣ Regulatory Compliance</h4>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>KYC/AML verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>SEC-compliant token model</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "acquisition-process": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">13.0 Acquisition Process</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Due Diligence Framework</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>Initial Screening & Valuation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>Financial & Operational Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>Technology & Automation Potential</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4️⃣</span>
                  <span>Growth & Synergy Opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Deal Structure</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Performance-based earnouts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Smart contract escrow mechanisms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Transparent pricing models</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Post-Acquisition Integration</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Technology implementation & automation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Staff training & development</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Service expansion & optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return sectionContent[sectionId] || null;
};

export default SectionContent;
