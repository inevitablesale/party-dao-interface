import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyArsLfJI0fawJid7fD403HFjQEtqPe8iec");

interface NFTMetadata {
  fullName: string;
  publicIdentifier: string;
  profilePic?: string;
  profilePicCID?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number | null | {
      [key: string]: number;
    };
  }>;
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
}

const VALID_GOVERNANCE_POWERS = [
  "Governance-Power-Emerging-Firm-Owner",
  "Governance-Power-Established-Firm-Owner",
  "Governance-Power-Industry-Leader",
  "Governance-Power-Public-Figure",
  "Governance-Power-Board-Advisor",
  "Governance-Power-Market-Influencer",
  "Governance-Power-Policy-Maker",
  "Governance-Power-Veteran-Partner"
];

const extractJSONFromText = (text: string): string => {
  console.log('Raw text from Gemini:', text);
  
  // Find the first occurrence of '{'
  const startIndex = text.indexOf('{');
  if (startIndex === -1) {
    throw new Error('No JSON object found in response');
  }

  // Find the last occurrence of '}'
  const endIndex = text.lastIndexOf('}');
  if (endIndex === -1) {
    throw new Error('Invalid JSON structure in response');
  }

  // Extract the JSON portion and remove trailing commas
  let jsonString = text.substring(startIndex, endIndex + 1);
  // Remove trailing commas in arrays and objects
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  console.log('Extracted JSON string:', jsonString);
  
  return jsonString;
};

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('Raw LinkedIn data:', linkedInData);
    
    // Extract just the data object if it exists
    const profileData = linkedInData.data || linkedInData;
    
    console.log('Processing profile data:', profileData);

    // Extract full name from LinkedIn data
    const firstName = profileData.firstName || '';
    const lastName = profileData.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    if (!fullName) {
      throw new Error('Could not extract full name from LinkedIn profile');
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
You are an AI assistant that analyzes LinkedIn profiles and generates NFT metadata. Your task is to extract relevant information and return it in a specific JSON format.

IMPORTANT: For the Governance Power attribute, you MUST ONLY use one of these exact values:
- Governance-Power-Emerging-Firm-Owner
- Governance-Power-Established-Firm-Owner
- Governance-Power-Industry-Leader
- Governance-Power-Public-Figure
- Governance-Power-Board-Advisor
- Governance-Power-Market-Influencer
- Governance-Power-Policy-Maker
- Governance-Power-Veteran-Partner

Given a LinkedIn profile, generate NFT metadata with the following structure:
{
  "fullName": "${fullName}",
  "publicIdentifier": "string",
  "profilePic": "string (optional)",
  "attributes": [
    {
      "trait_type": "string",
      "value": "string or number"
    }
  ],
  "experiences": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "location": "string"
    }
  ]
}

Required attributes must include:
- Governance Power (MUST be one of the exact values listed above)
- Experience Level (Founder & Advisor, Managing Partner, Firm Owner, etc.)
- Specialty (Tax Advisory, Accounting & Compliance, M&A & Exit Planning, etc.)
- Years in Practice (1-5 Years, 6-10 Years, 11-15 Years, etc.)
- Client Base (Small Businesses, Accounting Firms, etc.)
- Service Line Expertise (Accounting Technology, Media & Thought Leadership, etc.)

IMPORTANT: Return ONLY the JSON object, with no additional text before or after.

Analyze this LinkedIn profile and generate the NFT metadata according to the specified format:
${JSON.stringify(profileData, null, 2)}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonString = extractJSONFromText(text);
      const parsedResponse = JSON.parse(jsonString);
      console.log('Parsed response:', parsedResponse);
      
      const nftMetadata = parsedResponse.data || parsedResponse;
      
      // Ensure the full name is set
      nftMetadata.fullName = fullName;

      if (!nftMetadata.publicIdentifier || !Array.isArray(nftMetadata.attributes)) {
        throw new Error('Missing required fields in NFT metadata');
      }

      const governancePowerAttr = nftMetadata.attributes.find(attr => 
        attr.trait_type === "Governance Power"
      );

      if (!governancePowerAttr || !governancePowerAttr.value || 
          !VALID_GOVERNANCE_POWERS.includes(governancePowerAttr.value as string)) {
        throw new Error('Invalid or missing Governance Power value');
      }

      const requiredAttributes = [
        "Governance Power",
        "Experience Level",
        "Specialty",
        "Years in Practice",
        "Client Base",
        "Service Line Expertise"
      ];

      const missingAttributes = requiredAttributes.filter(attr => 
        !nftMetadata.attributes.some(a => 
          a.trait_type === attr && a.value !== null
        )
      );

      if (missingAttributes.length > 0) {
        throw new Error(`Missing or null values for attributes: ${missingAttributes.join(', ')}`);
      }

      return nftMetadata;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};
