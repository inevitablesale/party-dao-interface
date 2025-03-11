
export interface Publication {
  id: string;
  ipfsHash: string;
  publisher: string;
  timestamp: number;
  contentType: 'article' | 'job' | 'resume';
  title: string;
  category: string;
  lgrBalance: string;
  version: number;
  content?: string;
  expertise_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_reading_time?: number;
  topics?: string[];
  author_credentials?: string[];
}

const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: '1',
    ipfsHash: 'QmXzK2DyEx4dDZrcYLEEyhL1DJP9J9j4VhYYemL6pDD2TX',
    publisher: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 86400000,
    contentType: 'article',
    title: 'Crypto Tax Reporting: A Comprehensive Guide',
    category: 'Tax Advisory',
    lgrBalance: '1000000000000000000',
    version: 1,
    content: `
      <h2>Understanding Cryptocurrency Tax Obligations</h2>
      <p>As digital assets become increasingly mainstream, accounting professionals must adapt their practices to handle cryptocurrency transactions effectively. This comprehensive guide covers the essential aspects of crypto tax reporting.</p>
      
      <h3>Key Topics Covered:</h3>
      <ul>
        <li>Classification of crypto assets for tax purposes</li>
        <li>Capital gains calculations for crypto trades</li>
        <li>Mining income reporting requirements</li>
        <li>NFT tax implications</li>
        <li>Cross-border transaction considerations</li>
      </ul>

      <h3>Best Practices for Documentation</h3>
      <p>Maintaining detailed records is crucial for accurate crypto tax reporting. We recommend:</p>
      <ul>
        <li>Using specialized crypto tax software</li>
        <li>Keeping detailed transaction logs</li>
        <li>Documenting the fair market value at time of transactions</li>
        <li>Maintaining separate wallets for different types of activities</li>
      </ul>

      <h3>Common Pitfalls to Avoid</h3>
      <p>Watch out for these common mistakes in crypto tax reporting:</p>
      <ul>
        <li>Failing to report small transactions</li>
        <li>Incorrect cost basis calculations</li>
        <li>Missing airdrop and fork income</li>
        <li>Improper treatment of mining expenses</li>
      </ul>
    `,
    expertise_level: 'Intermediate',
    estimated_reading_time: 15,
    topics: ['Cryptocurrency', 'Tax Reporting', 'Digital Assets', 'Compliance'],
    author_credentials: ['CPA', 'Crypto Tax Specialist']
  },
  {
    id: '2',
    ipfsHash: 'QmYz92DyEx4dDZrcYLEEyhL1DJP9J9j4VhYYemL6pDD2TY',
    publisher: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 172800000,
    contentType: 'job',
    title: 'Senior Crypto Tax Specialist',
    category: 'Jobs',
    lgrBalance: '2000000000000000000',
    version: 1,
    content: `
      <h2>Senior Crypto Tax Specialist Position</h2>
      <p>Leading crypto-native accounting firm seeking an experienced tax specialist to join our growing team.</p>

      <h3>Key Responsibilities:</h3>
      <ul>
        <li>Handle complex cryptocurrency tax returns for high-net-worth individuals and institutions</li>
        <li>Develop and implement crypto tax strategies</li>
        <li>Provide guidance on DeFi and NFT tax implications</li>
        <li>Lead client consultations and advisory sessions</li>
      </ul>

      <h3>Requirements:</h3>
      <ul>
        <li>CPA certification</li>
        <li>5+ years of tax experience</li>
        <li>Strong understanding of cryptocurrency and blockchain technology</li>
        <li>Experience with crypto tax software</li>
      </ul>

      <h3>Compensation:</h3>
      <p>Competitive salary plus LGR token incentives</p>
      <ul>
        <li>Base salary: $120,000 - $180,000</li>
        <li>Token allocation: 50,000 LGR tokens vested over 3 years</li>
        <li>Performance bonuses</li>
        <li>Comprehensive benefits package</li>
      </ul>
    `,
    expertise_level: 'Advanced',
    topics: ['Cryptocurrency', 'Tax', 'Career']
  },
  {
    id: '3',
    ipfsHash: 'QmYz92DyEx4dDZrcYLEEyhL1DJP9J9j4VhYYemL6pDD2TZ',
    publisher: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 259200000,
    contentType: 'resume',
    title: 'Blockchain Accounting Expert - 8 Years Experience',
    category: 'Resumes',
    lgrBalance: '3000000000000000000',
    version: 1,
    content: `
      <h2>Professional Profile</h2>
      <p>Experienced accounting professional specializing in blockchain and cryptocurrency accounting, with a proven track record of implementing innovative solutions for complex digital asset scenarios.</p>

      <h3>Key Expertise:</h3>
      <ul>
        <li>Cryptocurrency tax planning and compliance</li>
        <li>DeFi protocol accounting</li>
        <li>Smart contract auditing</li>
        <li>Digital asset valuation</li>
      </ul>

      <h3>Professional Experience:</h3>
      <ul>
        <li>Led implementation of crypto accounting solutions for Fortune 500 companies</li>
        <li>Developed tax strategies for major DeFi protocols</li>
        <li>Authored multiple publications on blockchain accounting standards</li>
        <li>Regular speaker at industry conferences</li>
      </ul>

      <h3>Certifications:</h3>
      <ul>
        <li>Certified Public Accountant (CPA)</li>
        <li>Certified Blockchain Professional (CBP)</li>
        <li>Certified Cryptocurrency Tax Specialist</li>
      </ul>
    `,
    expertise_level: 'Advanced',
    topics: ['Blockchain', 'Accounting', 'DeFi', 'Professional Services']
  }
];

export const fetchPublications = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<{ publications: Publication[]; hasMore: boolean }> => {
  // Mock implementation
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const publications = MOCK_PUBLICATIONS.slice(start, end);
  
  return {
    publications,
    hasMore: end < MOCK_PUBLICATIONS.length
  };
};
