// Maps governance power levels to their corresponding IPFS CIDs
export const governancePowerToCID: { [key: string]: string } = {
  "Governance-Power-Emerging-Firm-Owner": "QmYZK1vcxPkiPy8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YD",
  "Governance-Power-Established-Firm-Owner": "QmX9Z2X7vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YE",
  "Governance-Power-Industry-Leader": "QmW8Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YF",
  "Governance-Power-Public-Figure": "QmV7Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YG",
  "Governance-Power-Board-Advisor": "QmU6Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YH",
  "Governance-Power-Market-Influencer": "QmT5Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YI",
  "Governance-Power-Policy-Maker": "QmS4Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YJ",
  "Governance-Power-Veteran-Partner": "QmR3Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YK"
};

export const getGovernanceImageCID = (governancePower: string): string => {
  const cid = governancePowerToCID[governancePower];
  if (!cid) {
    console.warn(`No CID found for governance power: ${governancePower}`);
    return governancePowerToCID["Governance-Power-Emerging-Firm-Owner"]; // Default fallback
  }
  return cid;
};